const mongoose = require('mongoose');

const nighttimingsmasterSchema = mongoose.Schema({
    _id             		: mongoose.Schema.Types.ObjectId,
    nightChargesFromTime    : String,
    nightChargesToTime      : String,
    createdAt       		: Date,
                                                 
}); 

module.exports = mongoose.model('nighttimingsmaster',nighttimingsmasterSchema);
