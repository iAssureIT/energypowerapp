const mongoose             = require("mongoose");
var ObjectId            = require('mongodb').ObjectID;
// const Tickets              = require('./Model.js');
// const PersonMaster      = require('../../coreadmin/personMaster/ModelPersonMaster');
let Tickets = mongoose.model('tickets');
let PersonMaster = mongoose.model('personmasters');
let Attendance =  require('../attendance/Model');
let MonthlyReimbursement =  require('../monthlyReimbursement/Model');
const ProjectSetting    = require('../../coreAdmin/projectSettings/ModelProjectSettings.js');

let Users = mongoose.model('users');
const moment = require('moment');
const haversine = require("haversine");
const axios = require('axios');

exports.daily_employee_task_report = (req,res,next)=>{
    console.log("req.params",req.params);
    var {fromdate, enddate,searchtext}=req.params;
    var selector={roles:"technician","profile.status":"active"};
        if(searchtext!=="All"){
            selector['$or'] = [];
            selector["$or"].push({ "profile.firstname": { $regex: searchtext, $options: "i" } })
            selector["$or"].push({ "profile.lastname": { $regex: searchtext, $options: "i" } })
            selector["$or"].push({ "profile.fullName": { $regex: searchtext, $options: "i" } })
        }
    Users.find(selector)
        .exec()
        .then(users=>{
            let userIDArray = users.map(user => user._id);
            PersonMaster.find({userId:{$in:userIDArray}},{firstName:1,middleName:1,lastName:1,employeeId:1,userId:1})
            .exec()
            .then(persons=>{
                main();
                async function main(){
                        for(var i = 0; i < persons.length ; i++){
                             persons[i] = {...persons[i]._doc, 
                                "startTime"         : null,
                                "endTime"           : null,
                                "totalHours"        : null,
                                "distanceTravelled" : null,
                                "startOdometer"     : null,
                                "endOdometer"       : null,
                                "ticketAllocated"   : await getTicketAllocated(persons[i]._id,fromdate,enddate),
                                "ticketsClosed"     : await getCloseTickets(persons[i]._id,fromdate,enddate),
                            };     
                        }
                    Attendance.find({
                        $and:[
                            {user_id:{$in:userIDArray}},
                            {
                                'createdAt'   : {$gte : new Date(fromdate), $lt : new Date(enddate) }
                            }
                        ]    
                    })
                    .exec()
                    .then(attendance=>{
                        main();
                        async function main(){
                            var returnData = [];
                            for(var k = 0; k < persons.length ; k++){
                                for(var j = 0; j < attendance.length ; j++){
                                    if(persons[k].userId && persons[k].userId.equals(attendance[j].user_id)){
                                        persons[k] = {...persons[k], 
                                            "startTime"         : attendance[j].startDateAndTime,
                                            "endTime"           : attendance[j].endDateAndTime,
                                            "totalHours"        : attendance[j].totalTime,
                                            "startOdometer"     : attendance[j].startOdometer,
                                            "endOdometer"       : attendance[j].endOdometer,
                                            "distanceTravelled" : attendance[j].totalDistanceTravelled,
                                        }
                                        break;
                                    }    
                                }
                            }
                             if(k >= persons.length){
                                res.status(200).json(persons);
                            }  
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }    
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};




function getTicketAllocated(person_id,fromdate,enddate){
   return new Promise(function(resolve,reject){
        Tickets.find({
            $and:[
                {status:{$elemMatch:{allocatedTo:person_id}}},
                {status:{$elemMatch:{statusAt:{$gte : new Date(fromdate), $lt : new Date(enddate) }}}}
            ]    
        })
        .countDocuments()
        .exec()
        .then(count=>{
            resolve(count);
        })
        .catch(err =>{
           console.log("err",err)
        });
    });
}

function getCloseTickets(person_id,fromdate,enddate){
   return new Promise(function(resolve,reject){
        Tickets.find({
            $and:[
                {status:{$elemMatch:{allocatedTo:person_id}}},
                {status:{$elemMatch:{value:"Resolved",statusAt:{$gte : new Date(fromdate), $lt : new Date(enddate) }}}}
            ]    
        }) 
         .countDocuments()
         .exec()
         .then(count=>{
            resolve(count);
         })
        .catch(err =>{
           console.log("err",err)
        });
    });
}

function monthlyReimbursement(fromdate,enddate,person_id){
    console.log("fromdate",fromdate);
    console.log("enddate",enddate);
    console.log("person_id",person_id);
   return new Promise(function(resolve,reject){
        MonthlyReimbursement.findOne({
            $and:[
                {person_id:person_id},
                {startDate:{$gte : new Date(fromdate)}},
                {endDate:{$gte : new Date(enddate)}}
            ]    
        }) 
         .exec()
         .then(data=>{
             console.log("data",data);
            resolve(data ? data.paid : 0);
         })
        .catch(err =>{
           console.log("err",err)
        });
    });
}

exports.employee_wise_task_report = (req,res,next)=>{
    var { employee_id,monthyear } =req.params;
    const monyr     = monthyear.split("-");
    const year      = monyr[0];
    const month     = monyr[1];

    const numberOfDaysInMonth = new Date(year,month,0).getDate();
    const startDate = year+"-"+month+"-"+"01";
    const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;
    Tickets.find({
        status:{$elemMatch:{allocatedTo:employee_id}},
        createdAtStr: {
            $gte    : startDate,
            $lt     : endDate
        }
        },{ticketId:1,statusValue:1}) 
        .exec()
        .then(tickets=>{
            main();
                async function main(){
                for(var i = 0; i < tickets.length ; i++){
                    tickets[i] = {...tickets[i]._doc, 
                    "allocatedOn"     : await getDate(employee_id,tickets[i]._id,'Allocated'),
                    "startedOn"       : await getDate(employee_id,tickets[i]._id,'Work Started'),
                    "completedOn"     : await getDate(employee_id,tickets[i]._id,'Resolved'),
                    "ticketClosedDate": await getDate(employee_id,tickets[i]._id,'Closed'),
                };     
            }
            if(i >= tickets.length){
                var returnObj={
                    "employee" : await getPersonDetails(employee_id),
                    "tickets"  : tickets,
                }
                res.status(200).json(returnObj);
            } 
            
        }    
        })
    .catch(err =>{
        console.log("err",err)
    });
};


function getDate(employee_id,ticket_id,status){
   return new Promise(function(resolve,reject){
        Tickets.findOne({
            $and:[
                {_id:ticket_id},
                {status:{$elemMatch:{value:status}}},
            ]    
        }, {_id:0,'status.$': 1}) 
         .exec()
         .then(date=>{
            console.log("date",date);
            if(date){
                resolve(date.status[0].statusAt);
            }else{
                resolve(date);
            }
         })
        .catch(err =>{
           console.log("err",err)
        });
    });
}

function getPersonDetails(employee_id){
   return new Promise(function(resolve,reject){
        PersonMaster.findOne({_id:employee_id},{firstName:1,middleName:1,lastName:1,employeeId:1}) 
         .exec()
         .then(data=>{
            console.log("data",data);
            resolve(data);
         })
        .catch(err =>{
           console.log("err",err)
        });
    });
}
function homeToStartDistance(origin,destination){
    return new Promise(function(resolve,reject){
        ProjectSetting.findOne({type:'GOOGLE'},{googleapikey:1,_id:0})
        .then(res => {
            var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+origin+'&destinations='+destination+'&key='+res.googleapikey;
            axios.get(url)
            .then(result=>{
                console.log("ggogleapi=>",result.data.rows[0])
                if(result.data.rows.length > 0){
                    resolve(result.data.rows[0].elements[0]);
                }else{
                    resolve([]);
                }
            })
            .catch(error=>{
              console.log("error",error)
            })
        })
        .catch((error) =>{
            console.log("err",error)
        })
    })
}  

exports.get_datewise_userdetails = (req, res, next)=>{
    const monthyear = req.params.monthyear;
    const monyr     = monthyear.split("-");
    const year      = monyr[0];
    const month     = monyr[1];

    const numberOfDaysInMonth = new Date(year,month,0).getDate();
    const startDate = year+"-"+month+"-"+"01";
    const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;
     Users.find({roles:"technician"})
        .exec()
        .then(users=>{
            let userIDArray = users.map(user => user._id);
            PersonMaster
            .find({userId:{$in:userIDArray}},{firstName:1,middleName:1,lastName:1,employeeId:1,userId:1,workLocationLatLng:1,address:1})
            .populate('fuelreimbursement_id')
            .exec()
            .then(persons=>{
                for(var i = 0; i < persons.length ; i++){
                     persons[i] = {...persons[i]._doc, 
                        totalDistanceTravelled   : 0,
                        totalreimbursement       : 0,
                        totalTime                : 0,
                        present                  : 0,
                        absent                   : numberOfDaysInMonth,
                    };     
                }
                Attendance.find({
                    "createdAtStr": {
                        $gte    : startDate,
                        $lt     : endDate
                    },
                    user_id:{$in:userIDArray}                   
                 })
                .exec()
                .then(attendance=>{
                    main();
                    async function main(){
                        var returnData              = [];             
                        for(var k = 0; k < persons.length ; k++){
                            var present                 = 0 ;
                            var totalDistanceTravelled  = 0;
                            var totalReimbursementDistance = 0;
                            var totalTime               = 0;
                            for(var j = 0; j < attendance.length ; j++){
                                console.log("attendance[j].vehicle_charges_per_km",attendance[j].vehicle_charges_per_km);
                                if(String(persons[k].userId) === String(attendance[j].user_id)){
                                    // break;
                                    if(persons[k].workLocationLatLng && attendance[j].startLocation){
                                        var officeLatLng = {
                                            latitude  : persons[k].workLocationLatLng.split(",")[0],
                                            longitude : persons[k].workLocationLatLng.split(",")[1],
                                        };
                                        var office_to_start_distance = haversine(officeLatLng, attendance[j].startLocation);
                                        var home_to_office_distance  = attendance[j].home_office_distance.distance.value/1000;
                                        var paidamount  = await monthlyReimbursement(startDate,endDate,persons[k]._id);
                                        console.log("office_to_start_distance",office_to_start_distance);
                                        console.log("home_to_office_distance",home_to_office_distance);
                                        if(office_to_start_distance > 0.200){
                                            var origin = persons[k].address[0].latitude+","+persons[k].address[0].longitude;
                                            var destination = attendance[j].startLocation.latitude+","+attendance[j].startLocation.longitude;
                                            console.log("origin",origin);
                                            console.log("destination",destination);
                                            var home_to_start   = await homeToStartDistance(origin,destination);
                                            var home_to_start_distance = home_to_start.distance.value/1000;
                                            var home_to_start_time     = home_to_start.duration.value/60;
                                            console.log("home_to_start_distance",home_to_start_distance);

                                            if(home_to_start_distance > home_to_office_distance){
                                                console.log("home_to_start > home_to_office_distance)");
                                                totalDistanceTravelled     += attendance[j].totalDistanceTravelled;
                                                totalReimbursementDistance += Math.max(0,attendance[j].totalDistanceTravelled -(attendance[j].home_office_distance.distance.value/1000)) ;
                                                totalTime                  += attendance[j].totalTime;
                                                present                    += 1;
                                                persons[k] = {...persons[k], 
                                                    totalDistanceTravelled      : totalDistanceTravelled,
                                                    totalReimbursementDistance  : totalReimbursementDistance,
                                                    totalreimbursement          : totalReimbursementDistance * attendance[j].vehicle_charges_per_km,
                                                    totalTime                   : totalTime,
                                                    paidreimbursement           : paidamount,
                                                    remainingreimbursement      : totalReimbursementDistance * attendance[j].vehicle_charges_per_km - paidamount,
                                                    present                     : present,
                                                    absent                      : numberOfDaysInMonth - present,
                                                }
                                            }else{
                                                console.log("home_to_start < home_to_office_distance)");
                                                totalDistanceTravelled     += attendance[j].totalDistanceTravelled;
                                                totalReimbursementDistance += Math.max(0,attendance[j].totalDistanceTravelled -(attendance[j].home_office_distance.distance.value/1000)) ;
                                                totalTime                  += attendance[j].totalTime;
                                                present                    += 1;
                                                persons[k] = {...persons[k], 
                                                    totalDistanceTravelled      : totalDistanceTravelled,
                                                    totalReimbursementDistance  : totalReimbursementDistance,
                                                    totalreimbursement          : totalReimbursementDistance * attendance[j].vehicle_charges_per_km,
                                                    paidreimbursement           : paidamount,
                                                    remainingreimbursement      : totalReimbursementDistance * attendance[j].vehicle_charges_per_km - paidamount,
                                                    totalTime                   : totalTime,
                                                    present                     : present,
                                                    absent                      : numberOfDaysInMonth - present,
                                                }
                                            } 
                                        }else{
                                            totalDistanceTravelled      += attendance[j].totalDistanceTravelled;
                                            totalReimbursementDistance  += attendance[j].totalDistanceTravelled;
                                            totalTime                   += attendance[j].totalTime;
                                            present                     += 1;
                                            persons[k] = {...persons[k], 
                                                totalDistanceTravelled      : totalDistanceTravelled,
                                                totalReimbursementDistance  : totalReimbursementDistance,
                                                totalreimbursement          : totalDistanceTravelled * attendance[j].vehicle_charges_per_km,
                                                paidreimbursement           : paidamount,
                                                remainingreimbursement      : totalReimbursementDistance * attendance[j].vehicle_charges_per_km - paidamount,
                                                totalTime                   : totalTime,
                                                present                     : present,
                                                absent                      : numberOfDaysInMonth - present,
                                            }
                                        }
                                   } 
                                }    
                                
                            }
                        }
                         if(k >= persons.length){
                            res.status(200).json(persons);
                        }  
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    function getPersonata(user_id){
        return new Promise(function(resolve,reject){
            PersonMaster.findOne({userId : ObjectId(user_id)})
                .then(staff => {
                      resolve(staff);
                })
                .catch()
        })
    }
};

exports.get_daywise_userdetails = (req, res, next)=>{
    const monthyear = req.params.monthyear;
    const monyr     = monthyear.split("-");
    const year      = monyr[0];
    const month     = monyr[1];

    const numberOfDaysInMonth = new Date(year,month,0).getDate();
    const startDate = year+"-"+month+"-"+"01";
    const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;

    PersonMaster.findOne({_id : ObjectId(req.params.employee_id)})
        .populate('fuelreimbursement_id')    
        .then(staff => {
            main();
            async function main(){
                var staffAttendance         = [];
                attendanceData  = await getAttendanceData(staff.userId,startDate,endDate);
                allDays         = await getDaysInMonth(parseInt(month-1),parseInt(year));
                var paidamount  = await monthlyReimbursement(startDate,endDate,staff._id);
                console.log("paidamount",paidamount);
                var totalDistanceTravelled = 0;
                var totalTime              = 0;
                var totalReimbursement     = 0; 
                for(var i=0; i<allDays.length; i++){
                    for(var j=0; j<attendanceData.length; j++){
                        if(moment(allDays[i].createdAt).format('DD-MM-YYYY') === moment(attendanceData[j].createdAt).format('DD-MM-YYYY')){
                            if(staff.workLocationLatLng && attendanceData[j].startLocation){
                                var officeLatLng = {
                                    latitude  : staff.workLocationLatLng.split(",")[0],
                                    longitude : staff.workLocationLatLng.split(",")[1],
                                };
                                var office_to_start_distance = haversine(officeLatLng, attendanceData[j].startLocation);
                                var home_to_office_distance  = attendanceData[j].home_office_distance.distance.value/1000;
                                
                                console.log("office_to_start_distance",office_to_start_distance);
                               
                                if(office_to_start_distance > 0.200){
                                    var origin = staff.address[0].latitude+","+staff.address[0].longitude;
                                    var destination = attendanceData[j].startLocation.latitude+","+attendanceData[j].startLocation.longitude
                                    var home_to_start   = await homeToStartDistance(origin,destination);
                                    var home_to_start_distance = home_to_start.distance.value/1000;
                                    var home_to_start_time     = home_to_start.duration.value/60;
                                    var calculated_distance = attendanceData[j].totalDistanceTravelled-(attendanceData[j].home_office_distance.distance.value/1000);
                                    var max_calculated_distance = Math.max(0,calculated_distance);
                                    if(home_to_start_distance > home_to_office_distance){
                                        allDays[i].person_id                    = staff._id;
                                        allDays[i].staffName                    = staff.firstName + " "+staff.lastName;
                                        allDays[i].tracking_id                  = attendanceData[j]._id;  
                                        allDays[i].totalDistanceTravelled       = attendanceData[j].totalDistanceTravelled;
                                        allDays[i].totalReimbursementDistance   = max_calculated_distance;
                                        allDays[i].vehicle                      = attendanceData[j].vehicle,
                                        allDays[i].vehicle_charges_per_km       = attendanceData[j].vehicle_charges_per_km,
                                        allDays[i].totalReimbursement           = max_calculated_distance* attendanceData[j].vehicle_charges_per_km;
                                        allDays[i].startDateAndTime             = attendanceData[j].startDateAndTime;
                                        allDays[i].attendanceDateAndTime        = moment(attendanceData[j].startDateAndTime).subtract(home_to_start_time, 'minutes').toDate();
                                        allDays[i].endDateAndTime               = attendanceData[j].endDateAndTime;
                                        allDays[i].startOdometer                = attendanceData[j].startOdometer;
                                        allDays[i].endOdometer                  = attendanceData[j].endOdometer;
                                        allDays[i].stotalTime                   = parseInt(attendanceData[j].totalTime);
                                        allDays[i].present                      = true;
                                        allDays[i].tracking_status              = attendanceData[j].tracking_status;
                                        allDays[i].createdAt                    = attendanceData[j].createdAt;
                                        totalDistanceTravelled                  +=max_calculated_distance;
                                        totalTime                               +=parseInt(attendanceData[j].totalTime);
                                        totalReimbursement                      +=(max_calculated_distance * attendanceData[j].vehicle_charges_per_km);
                                    }else{
                                        allDays[i].person_id                    = staff._id;
                                        allDays[i].staffName                    = staff.firstName + " "+staff.lastName;
                                        allDays[i].tracking_id                  = attendanceData[j]._id;  
                                        allDays[i].totalDistanceTravelled       = attendanceData[j].totalDistanceTravelled;
                                        allDays[i].totalReimbursementDistance   = max_calculated_distance;
                                        allDays[i].vehicle                      = attendanceData[j].vehicle,
                                        allDays[i].vehicle_charges_per_km       = attendanceData[j].vehicle_charges_per_km,
                                        allDays[i].totalReimbursement           = max_calculated_distance* attendanceData[j].vehicle_charges_per_km;
                                        allDays[i].startDateAndTime             = attendanceData[j].startDateAndTime;
                                        allDays[i].attendanceDateAndTime        = moment(attendanceData[j].startDateAndTime).subtract(home_to_start_time, 'minutes').toDate();
                                        allDays[i].endDateAndTime               = attendanceData[j].endDateAndTime;
                                        allDays[i].startOdometer                = attendanceData[j].startOdometer;
                                        allDays[i].endOdometer                  = attendanceData[j].endOdometer;
                                        allDays[i].stotalTime                   = parseInt(attendanceData[j].totalTime);
                                        allDays[i].present                      = true;
                                        allDays[i].tracking_status              = attendanceData[j].tracking_status;
                                        allDays[i].createdAt                    = attendanceData[j].createdAt;
                                        totalDistanceTravelled                  +=max_calculated_distance;
                                        totalTime                               +=parseInt(attendanceData[j].totalTime);
                                        totalReimbursement                      +=(max_calculated_distance* attendanceData[j].vehicle_charges_per_km);
                                    }    
                                }else{
                                    allDays[i].person_id                    = staff._id;
                                    allDays[i].staffName                    = staff.firstName + " "+staff.lastName;
                                    allDays[i].tracking_id                  = attendanceData[j]._id;  
                                    allDays[i].totalDistanceTravelled       = attendanceData[j].totalDistanceTravelled;
                                    allDays[i].totalReimbursementDistance   = attendanceData[j].totalDistanceTravelled;
                                    allDays[i].vehicle                      = attendanceData[j].vehicle,
                                    allDays[i].vehicle_charges_per_km       = attendanceData[j].vehicle_charges_per_km,
                                    allDays[i].totalReimbursement           = attendanceData[j].totalDistanceTravelled * attendanceData[j].vehicle_charges_per_km;
                                    allDays[i].startDateAndTime             = attendanceData[j].startDateAndTime;
                                    allDays[i].attendanceDateAndTime        = attendanceData[j].startDateAndTime;
                                    allDays[i].endDateAndTime               = attendanceData[j].endDateAndTime;
                                    allDays[i].startOdometer                = attendanceData[j].startOdometer;
                                    allDays[i].endOdometer                  = attendanceData[j].endOdometer;
                                    allDays[i].stotalTime                   = parseInt(attendanceData[j].totalTime);
                                    allDays[i].present                      = true;
                                    allDays[i].tracking_status              = attendanceData[j].tracking_status;
                                    allDays[i].createdAt                    = attendanceData[j].createdAt;
                                    totalDistanceTravelled                  +=attendanceData[j].totalDistanceTravelled;
                                    totalTime                               +=parseInt(attendanceData[j].totalTime);
                                    totalReimbursement                      +=(attendanceData[j].totalDistanceTravelled * attendanceData[j].vehicle_charges_per_km);
                                }
                           } 
                            
                        }
                    }
                }
                if(i>=allDays.length){
                    // console.log("allDays",allDays);
                    var returnObj ={
                        employee : staff,
                        staffAttendance : allDays,
                        totalDistanceTravelled,
                        totalTime,
                        totalReimbursement : totalReimbursement -paidamount
                    }
                    res.status(200).json(returnObj);
                }
        }

    })
    .catch()
    function getAttendanceData(user_id,startDate,endDate){
        return new Promise(function(resolve,reject){
            Attendance.find({
                            user_id : user_id,
                            "createdAtStr": {
                                $gte    : startDate,
                                $lt     : endDate
                            }                   
                    })
                .then(data=>{
                    resolve(data);
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
    }

    
    function getDaysInMonth(month, year) {
      return new Promise(function(resolve,reject){
           var date = new Date(Date.UTC(year, month, 1));
              var days = [];
              while (date.getUTCMonth() === month) {
                days.push({
                    createdAt               :new Date(date),
                    tracking_id             : null,  
                    person_id               : null,
                    staffName               : null,
                    totalDistanceTravelled  : null,
                    totalReimbursement      : null,
                    stotalTime              : null,
                    startDateAndTime        : null,
                    endDateAndTime          : null,
                    startOdometer           : null,
                    endOdometer             : null,
                    present                 : false,
                });
                date.setUTCDate(date.getUTCDate() + 1);
              }
            resolve(days);
        })
    }
};
