const mongoose = require('mongoose');

const ticketsSchema = mongoose.Schema({
     _id                      : mongoose.Schema.Types.ObjectId,
     ticketId                 : String,
     client_id                : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
     clientName               : String,
     contactPerson            : String,
     contactPerson_id         : { type: mongoose.Schema.Types.ObjectId, ref: 'personmasters' },
     department               : String,
     project                  : String,
     site                     : String,
     typeOfIssue              : String,
     projectLocationName    : String,
     projectLocation_id     : { type: mongoose.Schema.Types.ObjectId, ref: 'projectlocation' },
     equipmentLocationName       : String,
     equipmentLocation_id        : { type: mongoose.Schema.Types.ObjectId, ref: 'equipmentlocation' },
     description              : String,
     images                   : Array,
     videos                   : Array,
     statusValue              : String,
     cost                     : Number,
     serviceRequest           : String,
     is_type                  : String,
     status                   :  [{
                                        value          : String,
                                        allocatedTo    : { type: mongoose.Schema.Types.ObjectId, ref: 'personmasters' },
                                        statusBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                        review         : String,
                                        remark         : String,
                                        images         : Array,
                                        videos         : Array,
                                        rating         : Number,
                                        latitude       : Number,
                                        longitude      : Number,
                                        statusAt       : Date,
                                   }],
     createdBy                : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
     createdAt                : Date,
     createdAtStr             : String,
     updateLog                : [{
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                              }]                         
});

module.exports = mongoose.model('tickets',ticketsSchema);