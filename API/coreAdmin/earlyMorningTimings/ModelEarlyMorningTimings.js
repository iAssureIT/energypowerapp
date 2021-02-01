const mongoose = require('mongoose');

const earlyMorningTimingsMasterSchema = mongoose.Schema({
    _id             			   : mongoose.Schema.Types.ObjectId,
    earlyMorningChargesFromTime    : String,
    earlyMorningChargesToTime      : String,
    createdAt       		       : Date,
                                                 
}); 

module.exports = mongoose.model('earlymorningtimingsmaster',earlyMorningTimingsMasterSchema);
