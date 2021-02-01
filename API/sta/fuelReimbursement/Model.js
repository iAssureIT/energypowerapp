const mongoose = require('mongoose');

const modelSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    vehicle_id                : { type: mongoose.Schema.Types.ObjectId, ref: 'vehicleMaster' },
    fuelReimbursement         : String,  
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

module.exports = mongoose.model('fuelreimbursements',modelSchema);