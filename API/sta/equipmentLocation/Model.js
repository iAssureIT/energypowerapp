const mongoose = require('mongoose');

const equipmentlocSchema = mongoose.Schema({
      _id                       : mongoose.Types.ObjectId, 
      locationName              : String,
      projectLocationName       : String,
      project_id                : { type: mongoose.Schema.Types.ObjectId, ref: 'projectlocation' },                
      equipmentSpecifications    : String,
      industry                  : String,
      actualPerformance         : String,
      equipmentModel            : String,
      equipmentUrl              : String,
      images                    : Array,                 
      address                   : [{
                                    addressLine1    : String,
                                    addressLine2    : String,
                                    landmark        : String,
                                    area            : String,
                                    city            : String,
                                    district        : String,
                                    stateCode       : String,
                                    state           : String,
                                    countryCode     : String,
                                    country         : String,
                                    pincode         : Number,
                                    latitude        : Number,
                                    longitude       : Number,
                                    addressProof    : Array
                              }],
});

module.exports = mongoose.model('equipmentlocation',equipmentlocSchema);



