const mongoose = require('mongoose');

const projectlocSchema = mongoose.Schema({


            _id                   : mongoose.Types.ObjectId, 
            clientName            : String,
            client_id             : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' }, 
            department            : String,   
            project               : String,
            siteName              : String,
            locationName          : String,
            division              : String,
            industry              : String,
            process               : String,
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

module.exports = mongoose.model('projectlocation',projectlocSchema);



