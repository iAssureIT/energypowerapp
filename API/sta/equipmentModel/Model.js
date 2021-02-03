const mongoose = require('mongoose');

const equipmentModelSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    equipmentModel               : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('equipmentModel',equipmentModelSchema);