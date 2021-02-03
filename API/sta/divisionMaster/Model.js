const mongoose = require('mongoose');

const divisionMasterSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    division              : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('divisionMaster',divisionMasterSchema);