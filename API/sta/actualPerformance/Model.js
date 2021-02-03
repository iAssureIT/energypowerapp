const mongoose = require('mongoose');

const actualPerformanceSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    actualPerformance            : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('actualPerformance',actualPerformanceSchema);