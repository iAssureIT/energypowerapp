const mongoose = require('mongoose');

const personMasterSchema = mongoose.Schema({
    _id                         : mongoose.Schema.Types.ObjectId,
    company_Id                  : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
    companyID                   : Number,
    companyName                 : String,
    type                        : String,
    CompanyID                   : String,
    firstName                   : String,
    middleName                  : String,
    lastName                    : String,
    DOB                         : Date,
    gender                      : String,
    contactNo                   : String,
    altContactNo                : String,
    profilePhoto                : String,
    email                       : String,
    whatsappNo                  : String,
    workLocation                : String,
    workLocationId              : String,
    workLocationLatLng          : String,
    branchCode                  : String,
    badgeNumber                 : String,
    designationId               : { type: mongoose.Schema.Types.ObjectId, ref: 'designationmasters' },
    departmentId                : { type: mongoose.Schema.Types.ObjectId, ref: 'departmentmasters' },
    employeeId                  : String,
    loginCredential             : String,
    vehicle                     : String,
    workImages                  : Array,
    socialMediaArray            :  [{
                                        social_id : { type: mongoose.Schema.Types.ObjectId, ref: 'socialMediamasters' },
                                        name : String,
                                        icon : String,
                                        url : String
                                    }],
    home_office_distance        : {
                                        distance : {text:String, value:Number},
                                        duration : {text:String, value:Number},
                                  },
    fuelreimbursement_id        : { type: mongoose.Schema.Types.ObjectId, ref: 'fuelreimbursements' },  
    address                     : [{
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
    Documentarray               : [{
                                        documentName        : String,
                                        documentNumber      : String,
                                        documentValidFrom   : Date,
                                        documentValidTo     : Date,
                                        documentProof       : {
                                                                imgUrl : Array,
                                                                status : String,
                                                                remark : String,
                                                                createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                                                createdAt : Date
                                                            },
                                    }],
    verification                :{
                                    verificationNumber: String,
                                    verificationProof : Array
                                },  
    corporateId                 : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },                              
    userId                      : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status                      : String,
    fileName                    : String,
    createdBy                   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                   : Date,
    updateLog                   : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                            ],
    statusLog                   :   [
                                        {
                                            
                                            status 				: String,
                                            updatedAt           : Date,
                                            updatedBy           : String,
                                        }
                                    ]
});

module.exports = mongoose.model('personmasters',personMasterSchema);
