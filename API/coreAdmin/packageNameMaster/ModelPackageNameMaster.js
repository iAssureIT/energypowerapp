const mongoose = require('mongoose');

const packageNameSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    packageTypeId             : { type: mongoose.Schema.Types.ObjectId, ref: 'packagetypemasters' },
    packageName               : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    updateLog                 : [
                                    {
                                        updatedAt           : Date,
                                        updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                    }
                                ]
});

module.exports = mongoose.model('packagenamemaster',packageNameSchema);