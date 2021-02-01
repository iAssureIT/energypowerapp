const mongoose = require('mongoose');

const vehicleEmployeeMappingmasterSchema = mongoose.Schema({
    _id             : mongoose.Schema.Types.ObjectId,
    empCategory     : Number,
    VehicleCategory : [{
                        category_id   : { type: mongoose.Schema.Types.ObjectId, ref: 'categorymasters' },
                    }],
    createdBy   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt       : Date,
    updateLog                   : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                            ]
                                                 
}); 

module.exports = mongoose.model('vehicleEmployeeMappingmaster',vehicleEmployeeMappingmasterSchema);
