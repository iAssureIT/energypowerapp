const mongoose              = require("mongoose");
const PackageNameMaster     = require('./ModelPackageNameMaster.js');
const PackageTypeMaster     = require('../packageTypeMaster/ModelPackageTypeMaster.js');
var   ObjectId              = require('mongodb').ObjectId;

exports.insertPackageName = (req, res, next) => {
    // console.log("In insertPackageName = ", req.body);
    processData();
    async function processData(){
    var packageName = await fetchPackageNameList();

    var packageNameVar = packageName.filter((data)=>{
        if ( data.packageTypeId == req.body.dropdownID && data.packageName.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
    })
    if (packageNameVar.length > 0) {
        res.status(200).json({ duplicated : true });
    }else{
            const packageNameMaster = new PackageNameMaster({
                _id             : new mongoose.Types.ObjectId(),
                packageTypeId   : req.body.dropdownID,
                packageName     : req.body.fieldValue,
                createdBy       : req.body.createdBy,
                createdAt       : new Date()
            })
            packageNameMaster.save()
                .then(data => {
                    res.status(200).json({ created: true, fieldID: data._id });
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                });
        }
    }
};

var fetchPackageNameList = async (req,res,next)=>{
        return new Promise(function(resolve,reject){ 
        PackageNameMaster.aggregate([
            {$lookup:
                {
                    from        : "packagetypemasters",
                    localField  : "packageTypeId",
                    foreignField: "_id",
                    as          : "packageTypeDetails"
                }
            },
            {"$unwind": "$packageTypeDetails" },
            {$addFields: 
                { 
                    packageType : "$packageTypeDetails.packageType"
                }
            }
        ])
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            var alldata = data.map((a, i)=>{
                    // console.log("a =>",a);
                    return {
                        "_id"             : a._id,
                        "packageType"     : a.packageType,
                        "packageName"     : a.packageName,
                        "packageTypeId"   : a.packageTypeId  
                    }
            })
            resolve( data )
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
    });
};

exports.fetchPackageNameList = (req, res, next)=>{
    PackageNameMaster.aggregate([
            {
            $lookup:
                {
                    from        : "packagetypemasters",
                    localField  : "packageTypeId",
                    foreignField: "_id",
                    as          : "packageTypeDetails"
                }
            },
            { "$unwind": "$packageTypeDetails" },
            {$addFields: { packageType : "$packageTypeDetails.packageType"}}
        ])
        .sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data=>{
            var alldata = data.map((a, i)=>{
                    // console.log("a =>",a);
                    return {
                        "_id"                : a._id,
                        "packageType"        : a.packageType,
                        "packageName"        : a.packageName,
                        "packageTypeId"      : a.packageTypeId  
                    }
            })
            res.status(200).json(alldata);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchSortedPackageNameList = (req, res, next)=>{
    // console.log("fetchSortedPackageNameList = ", req.params.packageTypeID);
    PackageNameMaster.aggregate([
            {
                $lookup:
                {
                    from        : "packagetypemasters",
                    localField  : "packageTypeId",
                    foreignField: "_id",
                    as          : "packageTypeDetails"
                }
            },
            { "$unwind"     : "$packageTypeDetails" },
            { "$addFields"  : {"packageType"  : "$packageTypeDetails.packageType"}},
            { "$match"      : {"packageTypeId": ObjectId(req.params.packageTypeID)}},
        ])
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            var alldata = data.map((a, i)=>{
                    // console.log("a =>",a);
                    return {
                        "_id"                : a._id,
                        "packageType"        : a.packageType,
                        "packageName"        : a.packageName,
                        "packageTypeId"      : a.packageTypeId  
                    }
            })
            res.status(200).json(alldata);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};


exports.getPackageNameList = (req, res, next) => {
    PackageNameMaster.find({})
        .sort({ createdAt: -1 })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.fetchSinglePackageName = (req, res, next) => {
    // console.log("Package field Id = ", req.params.fieldID);
    PackageNameMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data => {
            // console.log("Package One Data = ", data);
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.updatePackageName = (req, res, next) => {    
    // console.log("req.params.fieldID==>",req.body.fieldID)
    PackageNameMaster.updateOne(
            { _id: req.body.fieldID },
            {
                $set: {
                    'packageTypeId' : req.body.dropdownID,
                    'packageName'   : req.body.fieldValue
                }
            }
        )
        .exec()
        .then(data => {
            console.log("reqdata==>",data)
            if (data.nModified == 1) {
                PackageNameMaster.updateOne(
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

exports.deletePackageName = (req, res, next) => {
    PackageNameMaster.deleteOne({ _id: req.params.fieldID })
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
