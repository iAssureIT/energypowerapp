const mongoose = require('mongoose');

const timeFormatSchema = mongoose.Schema({
    _id                  : mongoose.Schema.Types.ObjectId,
    timeFormat           : String,                  
}); 

module.exports = mongoose.model('timeformat',timeFormatSchema);
