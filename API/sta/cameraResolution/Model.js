const mongoose = require('mongoose');

const cameraResolutionSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    cameraResolution            : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('cameraResolution',cameraResolutionSchema);