const mongoose = require('mongoose');

const recorderTypeMasterSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    recorderType              : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('recorderTypeMaster',recorderTypeMasterSchema);