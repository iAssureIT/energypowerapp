const mongoose = require('mongoose');

const addSiteSchema = mongoose.Schema({
     _id                       : mongoose.Schema.Types.ObjectId,
     client                    : String,
     project                   : String, 
     sitename                  : String,
     latitude                  : Number,
     longitude                 : Number,
    
});

module.exports = mongoose.model('addSite',addSiteSchema);