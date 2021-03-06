const mongoose = require('mongoose');

const taskTypeMasterSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    taskType                  : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('taskTypeMaster',taskTypeMasterSchema);