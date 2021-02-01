const mongoose = require('mongoose');

const recordinglocSchema = mongoose.Schema({


            _id                   : mongoose.Types.ObjectId, 
            clientName            : String,
            client_id             : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' }, 
            department            : String,   
            project               : String,
            siteName              : String,
            locationName          : String,
            recorderType          : String,
            brand                 : String,
            maxchannels           : Number,
            images                : Array,
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

module.exports = mongoose.model('recordinglocation',recordinglocSchema);



