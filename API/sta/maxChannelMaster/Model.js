const mongoose = require('mongoose');

const maxchannelSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    maxchannels               : Number,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('maxChannelsMaster',maxchannelSchema);