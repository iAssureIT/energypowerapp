const mongoose = require('mongoose');

const cameraModelSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    cameraModel               : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('cameraModel',cameraModelSchema);