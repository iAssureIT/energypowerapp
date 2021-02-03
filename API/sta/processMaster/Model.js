const mongoose = require('mongoose');

const processSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    process               : Number,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('processMaster',processSchema);