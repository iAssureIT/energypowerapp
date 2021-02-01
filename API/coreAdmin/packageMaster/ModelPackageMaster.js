const mongoose = require('mongoose');

const packageMasterSchema = mongoose.Schema({
	_id			                : mongoose.Schema.Types.ObjectId,
    packageTypeId               : { type: mongoose.Schema.Types.ObjectId, ref: 'packagetypemasters' },
    packageNameId               : { type: mongoose.Schema.Types.ObjectId, ref: 'packagenamemasters' },
    fixCharges                  : Number,
    minHours                    : Number,
    minKm                       : Number,
    way                         : String,
    cityTypeId                  : { type: mongoose.Schema.Types.ObjectId, ref: 'citytypemasters' },
    categoryId                  : { type: mongoose.Schema.Types.ObjectId, ref: 'categorymasters' },
    extraHrCharges              : Number,
    extraKmsCharges             : Number,
    driverAllow                 : Number,
    nightHalt                   : Number,
    nightCharges                : Number,
    morningCharges              : Number,
    packageEntity               : String,
    profitMarginPercentage      : Number,
    createdBy                   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                   : Date,
    updateLog                   : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('packagemasters',packageMasterSchema);
