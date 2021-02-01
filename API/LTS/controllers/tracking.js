const mongoose    	    = require("mongoose");
var moment              = require('moment');
const Tracking          = require('../models/tracking');
const User              = require('../../coreAdmin/userManagement/ModelUsers.js');
var ObjectId            = require('mongodb').ObjectID;


exports.start_location_details = (req,res,next)=>{
	const tracking = new Tracking({
        _id                 : new mongoose.Types.ObjectId(),                    
        startDateAndTime    : req.body.startDateTime,
        startLocation       :   {
                                    latitude   : req.body.startLocation.latitude,
                                    longitude    : req.body.startLocation.longitude,
                                },
        routeCoordinates    : [{
                                  latitude   : req.body.startLocation.latitude,
                                  longitude    : req.body.startLocation.longitude,
                                  distanceTravelled : 0  
        }],                       
        userId              : req.body.userId,
        createdAt           : new Date(),
        createdAtStr        : moment(new Date()).format("YYYY-MM-DD"),
    });
    tracking.save()
        .then(data=>{
            res.status(200).json({"tracking_id"    : data._id});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
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


exports.update_routeCoordinates = (req,res,next)=>{
        Tracking.updateOne(
            { _id : ObjectId(req.body.tracking_id)},
            {
                $push : {
                    "routeCoordinates" : req.body.routeCoordinates,
                },
            })
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
/*exports.get_datewise_userdetails = (req, res, next)=>{
    Tracking.find({})
        .sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};*/
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


// exports.get_daywise_userdetails = (req, res, next)=>{
//     console.log("req body = ", req.body.monthyear);
//     const monthyear = req.params.monthyear;
//     const monyr     = monthyear.split("-");
//     const year      = monyr[0];
//     const month     = monyr[1];

//     const numberOfDaysInMonth = new Date(year,month,0).getDate();
//     const startDate = year+"-"+month+"-"+"01";
//     console.log("startDate--",startDate);
//     const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;
//     console.log("endDate--",endDate);

//     User.findOne({_id : ObjectId(req.params.user_id)})
//         .then(staff => {
//             main();
//             async function main(){
//                 var staffAttendance         = [];
//                 var totalDistanceTravelled  = 0;
//                 var totalTime               = 0;
//                 var present                 = 0;
//                 console.log("staff",staff);
//                     attendanceData                           = await getAttendanceData(staff._id,startDate,endDate);
//                     console.log("attendanceData",attendanceData);
//                     for(var j=0; j<attendanceData.length; j++){
//                         var attendanceObj ={
//                         tracking_id              : attendanceData[j]._id,    
//                         user_id                  : staff._id,    
//                         staffName                : staff.profile.fullName,
//                         totalDistanceTravelled   : attendanceData[j].totalDistanceTravelled,
//                         stotalTime               : parseInt(attendanceData[j].totalTime),
//                         createdAt                : attendanceData[j].createdAt,

//                         // present                  : present,
//                         // absent                   : numberOfDaysInMonth - present,
//                     }
//                     staffAttendance.push(attendanceObj)

//                     console.log("staffAttendance",staffAttendance);
//                 }
                    
//                 if(j>=attendanceData.length){
//                     res.status(200).json(staffAttendance);
//                 }
//             }

//         })
//         .catch()
//             function getAttendanceData(user_id,startDate,endDate){
//                 return new Promise(function(resolve,reject){
//                     Tracking.find({
//                                     userId : user_id,
//                                     "createdAtStr": {
//                                         $gte    : startDate,
//                                         $lt     : endDate
//                                     }                   
//                             })
//                         .then(data=>{
//                             resolve(data);
//                         })
//                         .catch(err =>{
//                             console.log(err);
//                             res.status(500).json({
//                                 error: err
//                             });
//                         });
//                 })
//             }
// };


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
                                    startDateAndTime         : moment(attendanceData[j].startDateAndTime).format('hh:mm:ss'),
                                    endDateAndTime           : moment(attendanceData[j].endDateAndTime).format('hh:mm:ss'),
                                    stotalTime               : parseInt(attendanceData[j].totalTime),
                                    createdAt                : moment(attendanceData[j].createdAt).format('YYYY-MM-DD'),
                                    present                  : true,
                                }
                            }else{
                              var attendanceObj ={
                                    tracking_id              : "",    
                                    user_id                  : "",    
                                    staffName                : staff.profile.fullName,
                                    totalDistanceTravelled   : 0,
                                    stotalTime               : 0,
                                    startDateAndTime         : 0,
                                    endDateAndTime           : 0,
                                    totalreimbursement       : 0,
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
                return new Promise(function(resolve,reject){
                    Tracking.find({
                                    userId : user_id,
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
                        days.push(new Date(date));
                        date.setUTCDate(date.getUTCDate() + 1);
                      }
                    resolve(days);
                })
            }
};
exports.get_datewise_userdetails = (req, res, next)=>{
    const monthyear = req.params.monthyear;
    const monyr     = monthyear.split("-");
    const year      = monyr[0];
    const month     = monyr[1];

    const numberOfDaysInMonth = new Date(year,month,0).getDate();
    const startDate = year+"-"+month+"-"+"01";
    const endDate   = year+"-"+month+"-"+numberOfDaysInMonth;

    Tracking.find({
            "createdAtStr": {
                $gte    : startDate,
                $lt     : endDate
            }                   
    })
    .then(data=>{
        main();
            async function main(){
                var staffAttendance         = [];
                var totalDistanceTravelled  = 0;
                var totalTime               = 0;
                var present                 = 0;

                for(var i=0; i<data.length; i++){
                        userData                    = await getUserData(data[i].userId);
                        if(userData){
                            totalDistanceTravelled  += data[i].totalDistanceTravelled;      
                            userId                  = data[i].userId;
                            totalTime               += parseInt(data[i].totalTime);
                            present                 = data.length;
                            var attendanceObj = {
                                _id                      : data[i]._id,
                                staffName                : userData.profile.fullName,
                                totalDistanceTravelled   : parseFloat(totalDistanceTravelled),
                                totalreimbursement       : parseFloat(totalDistanceTravelled),
                                stotalTime               : totalTime,
                                present                  : present,
                                userId                   : userId,
                                absent                   : numberOfDaysInMonth - present,
                            }
                            staffAttendance.push(attendanceObj)
                        }
                        
                }
                if(i>=data.length){
                    res.status(200).json({
                                            staffAttendance,
                                            "doc_id"    : data._id
                                        })
                }
            }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

    function getUserData(user_id){
        return new Promise(function(resolve,reject){
            User.findOne({_id : ObjectId(user_id)})
                .then(staff => {
                      resolve(staff);
                })
                .catch()
        })
    }
};
