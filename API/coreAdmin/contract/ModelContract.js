const mongoose = require('mongoose');

const entitySchema = mongoose.Schema({
    _id                         : mongoose.Schema.Types.ObjectId,
    contractDate                : Date,
    effectiveUpto               : Date,
    companyId                   : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    companyLocationId           : String,
    entityType                  : String,
    entityId                    : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
    entityLocationId            : String,
    conditions                  : String,
    contractDuration            : Number,
    status                      : String,
    statusLog                   : [{
                                    status          : String,
                                    statusAt        : Date,
                                    statusBy        : { 
                                                        userid      : {type  : mongoose.Schema.Types.ObjectId, ref: 'users'},
                                                        username    : String, 
                                                        empid       : String, 
                                                        companyId   : String, 
                                                        department  : String, 
                                                        designation : String,
                                                      },
                                }],
    earlyMorningChargesFromTime : String,
    earlyMorningChargesToTime   : String,
    nightChargesFromTime        : String,
    nightChargesToTime          : String,
    
    packages                    :  [
                                        {
                                            packageID       : { type: mongoose.Schema.Types.ObjectId, ref: 'packagemasters' },
                                            packageName     : String,
                                            packageType     : String,
                                            cityClass       : String,
                                            carCategory     : String,
                                            maxHours        : Number,
                                            maxKm           : Number,
                                            extraHr         : Number,
                                            extraKms        : Number,
                                            fixCharges      : Number,
                                            way             : String,
                                            driverAllowance : Number,
                                            nightHalt       : Number,
                                            nightCharges    : Number,
                                            morningCharges  : Number,
                                        }
                                    ], 
    createdBy                   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                   : Date,
    updateLog                   : [
                                    {
                                        updatedAt           : Date,
                                        updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                    }
                                  ]
});

module.exports = mongoose.model('contracts',entitySchema);