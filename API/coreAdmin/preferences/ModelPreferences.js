const mongoose = require('mongoose');

const preferenceSchema = mongoose.Schema({
    _id                    : mongoose.Schema.Types.ObjectId,
    profitMargin           : String,                  
}); 

module.exports = mongoose.model('preferences',preferenceSchema);
