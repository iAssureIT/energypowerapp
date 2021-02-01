const mongoose = require('mongoose');

const cameralocSchema = mongoose.Schema({
      _id                       : mongoose.Types.ObjectId, 
      locationName        : String,
      recordingLocationName     : String,
      recording_id              : { type: mongoose.Schema.Types.ObjectId, ref: 'recordinglocation' },                
      cameraType                : String,
      cameraBrand               : String,
      cameraResolution          : String,
      cameraModel               : String,
      cameraUrl                 : String,
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

module.exports = mongoose.model('cameralocation',cameralocSchema);



