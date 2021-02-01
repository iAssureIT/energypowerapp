const mongoose = require('mongoose');

const monthlyReimbursementSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    startDate                 : Date,
    endDate                   : Date,
    paid                      : Number,
    person_id                 : { type: mongoose.Schema.Types.ObjectId, ref: 'personmasters' },
    paidArray                 : [{
                                    paid        : Number,
                                    updatedAt   : Date,
                                    updatedBy   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
                                }],
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
});

module.exports = mongoose.model('monthlyReimbursement',monthlyReimbursementSchema);