const mongoose    	    = require("mongoose");
var moment              = require('moment');
const Tracking          = require('./Model.js');
const User              = require('../../coreAdmin/userManagement/ModelUsers.js');
const PersonMaster      = require('../../sta/personMaster/ModelPersonMaster.js');
var ObjectId            = require('mongodb').ObjectID;
const haversine         = require('haversine');

exports.start_location_details = (req,res,next)=>{
    var selector = {user_id:req.body.user_id,createdAtStr:moment().format('YYYY-MM-DD')}
    Tracking
    .findOne(selector)
    .exec()
    .then(tracking=>{
        main();
        async function main(){
            if(tracking){
                Tracking.updateOne(
                { _id : tracking._id},
                {
                    $push : {
                        "routeCoordinates" : {
                              latitude          : req.body.startLocation.latitude,
                              longitude         : req.body.startLocation.longitude,
                              distanceTravelled : 0,
                              stop              : true,   
                              locationAt        : req.body.locationAt,
                        },
                    },
                    $set :{
                        "tracking_status"     : true,
                    }
                })
                .exec()
                .then(data=>{
                    res.status(200).json({"attendance_id"    : tracking._id});
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }else{
                vehicleDetails = await getVehicleDetails(req.body.user_id);
                const tracking = new Tracking({
                _id                     : new mongoose.Types.ObjectId(),                    
                startDateAndTime        : req.body.startDateTime,
                startOdometer           : req.body.startOdometer,
                totalDistanceTravelled  : 0,
                home_office_distance    : await getHomeOfficeDistance(req.body.user_id),
                vehicle                 : vehicleDetails.vehicle,
                vehicle_charges_per_km  : parseInt(vehicleDetails.charges),
                startLocation           :   {
                                                latitude   : req.body.startLocation.latitude,
                                                longitude  : req.body.startLocation.longitude,
                                            },
                routeCoordinates        : [{
                                          latitude          : req.body.startLocation.latitude,
                                          longitude         : req.body.startLocation.longitude,
                                          distanceTravelled : 0,
                                          stop              : true, 
                                          locationAt        : req.body.locationAt,  
                }],                       
                user_id                 : req.body.user_id,
                createdAt               : new Date(),
                tracking_status         : true,
                createdAtStr            : moment(new Date()).format("YYYY-MM-DD"),
            });
            tracking.save()
                .then(data=>{
                    res.status(200).json({"attendance_id"    : data._id});
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }
        }
       
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

function getHomeOfficeDistance(user_id){
    return new Promise(function(resolve,reject){
            PersonMaster.findOne({userId:user_id},{home_office_distance:1})
            .then(data=>{
                console.log("data",data);
                resolve(data.home_office_distance);
             })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });
};

function getVehicleDetails(user_id){
    return new Promise(function(resolve,reject){
            PersonMaster.findOne({userId:user_id},{vehicle:1,fuelreimbursement_id:1})
            .populate('fuelreimbursement_id')
            .then(data=>{
                console.log("data",data);
                resolve({vehicle:data.vehicle,charges:data.fuelreimbursement_id.fuelReimbursement});
             })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });
};


exports.get_location_details = (req,res,next)=>{
    Tracking.findOne({_id:req.params.tracking_id})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.get_tracking_status = (req,res,next)=>{
    Tracking.findOne({user_id:req.params.user_id,createdAtStr:moment(req.params.date).format('YYYY-MM-DD')})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


// exports.update_routeCoordinates = (req,res,next)=>{
//         Tracking.updateOne(
//             { _id : ObjectId(req.body.tracking_id)},
//             {
//                 $push : {
//                     "routeCoordinates" : req.body.routeCoordinates,
//                 },
//             })
//             .exec()
//             .then(data=>{
//                 Tracking.findOne({_id:ObjectId(req.body.tracking_id)},{tracking_status:1})
//                 .then(data=>{
//                     res.status(200).json(data);
//                 })
//                 .catch(err =>{
//                     console.log(err);
//                     res.status(500).json({
//                         error: err
//                     });
//                 });
//             })
//             .catch(err =>{
//                 console.log(err);
//                 res.status(500).json({
//                     error: err
//                 });
//             });
// };


exports.update_routeCoordinates = (req,res,next)=>{
    var routeCoordinates = req.body.routeCoordinates;
    Tracking.findOne({_id:req.body.tracking_id},{routeCoordinates:{ $slice: -1 },totalDistanceTravelled:1})
    .exec()
    .then(prevCoordinate=>{
        console.log("prevCoordinate",prevCoordinate);
        if(prevCoordinate && prevCoordinate.routeCoordinates.length > 0){
            var prevLatLng ={
                latitude:prevCoordinate.routeCoordinates[0].latitude,
                longitude:prevCoordinate.routeCoordinates[0].longitude,
            }
            var newLatLng ={
                latitude:routeCoordinates.latitude,
                longitude:routeCoordinates.longitude,
            }
            routeCoordinates.distanceTravelled = haversine(prevLatLng,newLatLng);
        }else{
            routeCoordinates.distanceTravelled = 0;
        }
        
        Tracking.updateOne(
        { _id:req.body.tracking_id},
        {
            $push : {
                "routeCoordinates" : routeCoordinates,
            },
            $set : {
                totalDistanceTravelled : prevCoordinate.totalDistanceTravelled  && prevCoordinate.totalDistanceTravelled!==null ? prevCoordinate.totalDistanceTravelled : 0 + routeCoordinates.distanceTravelled
            }
        })
        .exec()
        .then(data=>{
            Tracking.findOne({_id:ObjectId(req.body.tracking_id)},{tracking_status:1})
            .then(data=>{
                res.status(200).json(data);
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
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
    
};


function totalDistance(tracking_id,newDistance){
    return new Promise(function(resolve,reject){
            Tracking.aggregate([
                { 
                    $match :  
                        { 
                            "_id" : ObjectId(tracking_id)
                        } 
                },
                { $unwind: "$routeCoordinates" },
                {
                    $group: {
                      _id: null,
                      distance: { $sum: "$routeCoordinates.distanceTravelled" }
                    }
              }
            ])
            .then(distanceTravelled=>{
                var totalDistanceTravelled = distanceTravelled[0].distance + newDistance;
                resolve(totalDistanceTravelled);
             })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });
};

exports.end_location_details = (req,res,next)=>{
    Tracking.aggregate([
            { 
                $match :  
                { 
                    "_id" : ObjectId(req.body.tracking_id)
                } 
            },
            {
                $project: 
                    {
                        totalTime: 
                            {
                                $subtract: [  new Date(req.body.endDateAndTime) ,"$startDateAndTime"]
                            },
                            "routeCoordinates" : 1,
                    } 
            },
            { $unwind: "$routeCoordinates" },
            {
                $group: {
                  _id: null,
                  totalDistance: { $sum: "$routeCoordinates.distanceTravelled" },
                  totalTime : {$first : "$totalTime"}
                }
            }
        ])
    .exec()
    .then(data=>{
        Tracking.updateOne(
        { "_id" : ObjectId(req.body.tracking_id)},
        {
            $set : {
                "totalTime"                 : data[0].totalTime,
                "endDateAndTime"            : req.body.endDateAndTime,
                "totalDistanceTravelled"    : data[0].totalDistance,
                "endOdometer"               : req.body.endOdometer,
                "tracking_status"           : false,
            }
        })
        .then(data=>{
            res.status(200).json(data);
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



exports.get_daywise_location_details = (req,res,next)=>{
    Tracking
        .find({"userId":req.params.userId})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.get_daywise_location_details = (req,res,next)=>{
    Tracking
        .find({"userId":req.params.userId})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_details = (req,res,next)=>{
    Tracking
        .findOne({"_id":req.params.tracking_id})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.getPersonDetails = (req,res,next)=>{
    Tracking
        .findOne({"_id":req.params.tracking_id})
        .exec()
        .then(data=>{
            main();
            async function main(){
                var personDetails = await getPersonDetails(data.user_id);
                res.status(200).json(personDetails);
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
function getPersonDetails(user_id) {
    return new Promise(function (resolve, reject) {
        PersonMaster.findOne({"userId":user_id})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

exports.get_all = (req,res,next)=>{
    Tracking.find()
        .exec()
        .then(data=>{
            console.log("data",data);
            main();
            async function main(){
                for (var index = 0; index < data.length; index++) {
                    var personDetails = await getPersonDetails(data[index].user_id);
                    data[index] = {...data[index]._doc, personDetails};
                }
                if(index >= data.length){
                    res.status(200).json(data);
                }
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.day_wise = (req,res,next)=>{
    console.log("req.params.day",req.params.date);
    Tracking.find({createdAtStr:req.params.date})
        .exec()
        .then(data=>{
            console.log("data",data);
            main();
            async function main(){
                for (var index = 0; index < data.length; index++) {
                    var personDetails = await getPersonDetails(data[index].user_id);
                    data[index] = {...data[index]._doc, personDetails};
                }
                if(index >= data.length){
                    res.status(200).json(data);
                }
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

function getuserDetails(user_id) {
    return new Promise(function (resolve, reject) {
        User.find({"role":user})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}


exports.get_daywise_userdetails = (req, res, next)=>{
    const monthyear = req.params.monthyear;
    const monyr     = monthyear.split("-");
    const year      = monyr[0];
    const month     = monyr[1];

    const numberOfDaysInMonth = new Date(year,month,0).getDate();
    const startDate = year+"-"+month+"-"+"01";
    const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;

    User.findOne({_id : ObjectId(req.params.user_id)})
        .then(staff => {
            main();
            async function main(){
                var staffAttendance         = [];
                var totalDistanceTravelled  = 0;
                var totalTime               = 0;
                var present                 = 0;
                var startDateAndTime        = 0;
                var endDateAndTime          = 0;
               
                    attendanceData  = await getAttendanceData(staff._id,startDate,endDate);
                    console.log("attendanceData",attendanceData);
                    allDays         = await getDaysInMonth(parseInt(month-1),parseInt(year));

                    for(var i=0; i<allDays.length; i++) {
                        for(var j=0; j<attendanceData.length; j++){
                            if(moment(allDays[i]).format('L') === moment(attendanceData[j].createdAt).format('L')){
                               var attendanceObj ={
                                    tracking_id              : attendanceData[j]._id,    
                                    user_id                  : staff._id,    
                                    staffName                : staff.profile.fullName,
                                    totalDistanceTravelled   : attendanceData[j].totalDistanceTravelled,
                                    totalreimbursement       : 5*(attendanceData[j].totalDistanceTravelled),
                                    startDateAndTime         : moment(attendanceData[j].startDateAndTime).format('HH:MM'),
                                    endDateAndTime           : moment(attendanceData[j].endDateAndTime).format('HH:MM'),
                                    stotalTime               : parseInt(attendanceData[j].totalTime),
                                    createdAt                : moment(attendanceData[j].createdAt).format('YYYY-MM-DD'),
                                    tracking_status          : attendanceData[j].tracking_status,
                                    present                  : true,
                                }
                            }else{
                              var attendanceObj ={
                                    tracking_id              : null,    
                                    user_id                  : null,    
                                    staffName                : staff.profile.fullName,
                                    totalDistanceTravelled   : null,
                                    stotalTime               : null,
                                    startDateAndTime         : null,
                                    endDateAndTime           : null,
                                    totalreimbursement       : null,
                                    createdAt                : moment(allDays[i]).format('YYYY-MM-DD'),
                                    present                  : false,
                                }
                            }
                            staffAttendance.push(attendanceObj)
                        }
                    }
                if(i>=allDays.length){
                    staffAttendanceObject      = staffAttendance.map(JSON.stringify);
                    staffAttendanceUniqueSet   = new Set(staffAttendanceObject);
                    staffAttendanceUniqueArray = Array.from(staffAttendanceUniqueSet).map(JSON.parse);
                    res.status(200).json(staffAttendanceUniqueArray);
                }
            }

        })
        .catch()
            function getAttendanceData(user_id,startDate,endDate){
                console.log("user_id",user_id,startDate,endDate);
                return new Promise(function(resolve,reject){
                    Tracking.find({
                                    user_id : user_id,
                                    "createdAtStr": {
                                        $gte    : startDate,
                                        $lt     : endDate
                                    }                   
                            })
                        .then(data=>{
                            console.log("data",data);
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
                        days.push(new Date(date));
                        date.setUTCDate(date.getUTCDate() + 1);
                      }
                    resolve(days);
                })
            }
};


exports.get_count = (req,res,next)=>{
    Tracking.find({tracking_status:true})
        .countDocuments()
        .exec()
        .then(count=>{
            res.status(200).json({count});
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};
