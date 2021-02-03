const mongoose = require('mongoose');

const EquipmentSpecificationsSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    equipmentSpecification                : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('equipmentSpecificationMaster', EquipmentSpecificationsSchema);