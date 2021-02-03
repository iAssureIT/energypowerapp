const mongoose = require('mongoose');

const industryMasterSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    industry                     : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('industryMaster',industryMasterSchema);