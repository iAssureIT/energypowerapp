const mongoose = require('mongoose');

const CameraTypeSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    cameraType                : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('cameraTypeMaster', CameraTypeSchema);