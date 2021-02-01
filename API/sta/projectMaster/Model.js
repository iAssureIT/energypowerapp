const mongoose = require('mongoose');

const addProjectSchema = mongoose.Schema({
     _id                       : mongoose.Schema.Types.ObjectId,
     client                    : String,
     projectName               : String, 
     
});

module.exports = mongoose.model('Project',addProjectSchema);