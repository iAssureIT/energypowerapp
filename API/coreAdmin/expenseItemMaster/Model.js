const mongoose = require('mongoose');

const modelSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    expenseTypeId             : { type: mongoose.Schema.Types.ObjectId, ref: 'expensetypemasters' },
    expenseItem               : String,  
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    fileName                  : String,
    updateLog                 : [
                                    {
                                        updatedAt           : Date,
                                        updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                    }
                                ]
});

module.exports = mongoose.model('expenseitemmaster',modelSchema);