const mongoose = require('mongoose');

const socialMediaSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    socialMedia               : String,
    iconUrl                   : String,  
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('socialMediamasters',socialMediaSchema);