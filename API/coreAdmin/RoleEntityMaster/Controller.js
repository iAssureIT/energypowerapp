const mongoose = require("mongoose");
const RolesEntityMaster = require('./Model.js');
const FailedRecords = require('../failedRecords/ModelFailedRecords');

exports.insertDocuments = (req, res, next) => {
    // console.log("req.body In Doc entity=>", req.body.fieldValue);
    RolesEntityMaster
        .find({roleentity:req.body.fieldValue})
        .then(data =>{
            if (data.length > 0) {
                res.status(200).json({message:"Role Entity already exists"});
                // res.status(409).json({ duplicated: true });
            } else {
                const rolesEntityMaster = new RolesEntityMaster({
                    _id: new mongoose.Types.ObjectId(),
                    rolesentity: req.body.fieldValue,
                    createdBy: req.body.createdBy,
                    createdAt: new Date()
                })
                rolesEntityMaster.save()
                    .then(data => {
                        res.status(200).json({ created: true, fieldID: data._id });
                    })
                    .catch(err => {
                        console.log("err", err.code)
                        if (err.code == 11000) {
                            res.status(409).json({ duplicated: true });
                        } else {
                            res.status(500).json({ error: err });
                        }
    
                    });   
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });    
};
exports.countdocuments = (req, res, next) => {
    RolesEntityMaster.find({}).count()
        .exec()
        .then(data => {
            res.status(200).json({ count: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};
exports.fetchDocuments = (req, res, next) => {
    RolesEntityMaster.find({})
        .sort({ createdAt: -1 })
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data => {
            // console.log("data fetch roles==",data)
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};
exports.getDocuments = (req, res, next) => {
    RolesEntityMaster.find({})
        .exec()
        .then(data => {
            // console.log("data roles==",data)
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};
exports.fetchSingleDocument = (req, res, next) => {
    RolesEntityMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.searchDocuments = (req, res, next) => {
    RolesEntityMaster.find({ document: { $regex: req.params.str, $options: "i" } })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};
exports.updateDocument = (req, res, next) => {
    RolesEntityMaster.updateOne(
        { _id: req.body.fieldID },
        {
            $set: { 'rolesentity': req.body.fieldValue }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                RolesEntityMaster.updateOne(
                    { _id: req.body.fieldID },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
exports.deletedocument = (req, res, next) => {
    RolesEntityMaster.deleteOne({ _id: req.params.fieldID })
        .exec()
        .then(data => {
            if (data.deletedCount === 1) {
                res.status(200).json({ deleted: true });
            } else {
                res.status(200).json({ deleted: false });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.filedetails = (req, res, next) => {
    console.log(req.params.fileName)
    RolesEntityMaster.find({ rolesentity: req.params.fileName })
        .exec()
        .then(data => {
                res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};



