const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	user_id                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } ,
    startDateAndTime        : Date,
    endDateAndTime          : Date,
    home_office_distance    : {
                                    distance : {text:String, value:Number},
                                    duration : {text:String, value:Number},
                            },
    startLocation           : {
    							longitude	: Number,
    							latitude	: Number,
                            },
    startOdometer           : {
                                Reading     : Number,
                                Proof       : String       
                              },
    endOdometer            : {
                                Reading     : Number,
                                Proof       : String       
                            },
    routeCoordinates        : [],
    totalDistanceTravelled  : Number,
    vehicle                 : String,
    vehicle_charges_per_km  : Number,
    totalTime               : String,
    createdAt               : Date,
    tracking_status         : Boolean,
    createdAtStr            : String,
});

module.exports = mongoose.model('attendance',attendanceSchema);

