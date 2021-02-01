const mongoose	        = require("mongoose");
const PackageMaster     = require('./ModelPackageMaster.js');
const Preferences       = require('../preferences/ModelPreferences.js');
var   ObjectId          = require('mongodb').ObjectId;

exports.insertPackage = (req,res,next)=>{
    PackageMaster.findOne({
                    "packageTypeId" : req.body.packageTypeId, 
                    "categoryId"    : req.body.categoryId,
                    "packageNameId" : req.body.packageNameId,
                    "packageEntity" : req.body.packageEntity
                })
    .then(data=>{
        if(data){
            res.status(200).json({ duplicate : true });
        }else{
            const packageMaster = new PackageMaster({
                _id                         : new mongoose.Types.ObjectId(),
                packageTypeId               : req.body.packageTypeId,
                packageNameId               : req.body.packageNameId,
                fixCharges                  : req.body.fixCharges, 
                minHours                    : req.body.maxHours, 
                minKm                       : req.body.maxKm,                
                way                         : req.body.way,
                cityTypeId                  : req.body.cityTypeId,
                categoryId                  : req.body.categoryId,
                extraHrCharges              : req.body.extraHr,
                extraKmsCharges             : req.body.extraKms,
                driverAllow                 : req.body.driverAllow,
                nightHalt                   : req.body.nightHalt,
                nightCharges                : req.body.nightCharges,
                morningCharges              : req.body.morningCharges,
                packageEntity               : req.body.packageEntity,
                createdBy                   : req.body.createdBy,
                createdAt                   : new Date()
            })
            packageMaster.save()
            .then(data=>{
                processData();
                async function processData() {
                    var allPreferences = await fetchPreferences();
                    var profitMarginData = allPreferences.filter((data) => {
                        return data;                        
                    })
                    // console.log("profitMarginData = ",profitMarginData[0].profitMargin);
                    if(profitMarginData.length>0){
                        profitMargin = profitMarginData[0].profitMargin;
                    }else{
                        profitMargin = 20;
                    }                    
                    // console.log("profitMargin = ", profitMargin);
                    const packageMaster = new PackageMaster({
                            _id                         : new mongoose.Types.ObjectId(),
                            packageTypeId               : req.body.packageTypeId,
                            packageNameId               : req.body.packageNameId,
                            fixCharges                  : (req.body.fixCharges - ((req.body.fixCharges * profitMargin)/100)), 
                            minHours                    : req.body.maxHours, 
                            minKm                       : req.body.maxKm,                
                            way                         : req.body.way,
                            cityTypeId                  : req.body.cityTypeId,
                            categoryId                  : req.body.categoryId,
                            extraHrCharges              : (req.body.extraHr - ((req.body.extraHr * profitMargin)/100)),
                            extraKmsCharges             : (req.body.extraKms - ((req.body.extraKms * profitMargin)/100)),
                            driverAllow                 : (req.body.driverAllow - ((req.body.driverAllow * profitMargin)/100)),
                            nightHalt                   : (req.body.nightHalt - ((req.body.nightHalt * profitMargin)/100)),
                            nightCharges                : (req.body.nightCharges - ((req.body.nightCharges * profitMargin)/100)),
                            morningCharges              : (req.body.morningCharges - ((req.body.morningCharges * profitMargin)/100)),
                            packageEntity               : "VendorPackage",
                            profitMarginPercentage      : profitMargin,                                
                            createdBy                   : req.body.createdBy,
                            createdAt                   : new Date()
                        })
                        packageMaster.save()
                        .then(vendordata=>{ 
                            // console.log("Vendor data = ", vendordata);
                            res.status(200).json({ created : true, packageId : vendordata._id });
                        })
                        .catch(err =>{
                            res.status(500).json({ error: err }); 
                        });                
                    res.status(200).json({ created : true, packageId : data._id });
                }
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
            })
        }
    })
    .catch(err=>{
        res.status(500).json({ error: err }); 
    })
};

var fetchPreferences = async () => {
    return new Promise(function (resolve, reject) {
        Preferences.find({})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// exports.insertPackage = (req,res,next)=>{
//     PackageMaster.findOne({
//                     "packageTypeId" : req.body.packageTypeId, 
//                     "categoryId"    : req.body.categoryId,
//                     "packageNameId" : req.body.packageNameId,
//                     "packageEntity" : req.body.packageEntity
//                 })
//     .then(data=>{
//         if(data){
//             res.status(200).json({ duplicate : true });
//         }else{
//             const packageMaster = new PackageMaster({
//                 _id                         : new mongoose.Types.ObjectId(),
//                 packageTypeId               : req.body.packageTypeId,
//                 packageNameId               : req.body.packageNameId,
//                 fixCharges                  : req.body.fixCharges, 
//                 minHours                    : req.body.maxHours, 
//                 minKm                       : req.body.maxKm,                
//                 way                         : req.body.way,
//                 cityTypeId                  : req.body.cityTypeId,
//                 categoryId                  : req.body.categoryId,
//                 extraHrCharges              : req.body.extraHr,
//                 extraKmsCharges             : req.body.extraKms,
//                 driverAllow                 : req.body.driverAllow,
//                 nightHalt                   : req.body.nightHalt,
//                 nightCharges                : req.body.nightCharges,
//                 morningCharges              : req.body.morningCharges,
//                 packageEntity               : req.body.packageEntity,
//                 createdBy                   : req.body.createdBy,
//                 createdAt                   : new Date()
//             })
//             packageMaster.save()
//             .then(data=>{
//                 Preferences.find()
//                     .sort({ createdAt: -1 })
//                     .exec()
//                     .then(preferenceData => {
//                         // console.log("preferenceData==>",preferenceData[0]);
//                         if(preferenceData[0].profitMargin){
//                             var profitMargin = preferenceData[0].profitMargin;
//                         }else{
//                             var profitMargin = 20;
//                         }
//                         const packageMaster = new PackageMaster({
//                             _id                         : new mongoose.Types.ObjectId(),
//                             packageTypeId               : req.body.packageTypeId,
//                             packageNameId               : req.body.packageNameId,
//                             fixCharges                  : (req.body.fixCharges - ((req.body.fixCharges * profitMargin)/100)), 
//                             minHours                    : req.body.maxHours, 
//                             minKm                       : req.body.maxKm,                
//                             way                         : req.body.way,
//                             cityTypeId                  : req.body.cityTypeId,
//                             categoryId                  : req.body.categoryId,
//                             extraHrCharges              : (req.body.extraHr - ((req.body.extraHr * profitMargin)/100)),
//                             extraKmsCharges             : (req.body.extraKms - ((req.body.extraKms * profitMargin)/100)),
//                             driverAllow                 : (req.body.driverAllow - ((req.body.driverAllow * profitMargin)/100)),
//                             nightHalt                   : (req.body.nightHalt - ((req.body.nightHalt * profitMargin)/100)),
//                             nightCharges                : (req.body.nightCharges - ((req.body.nightCharges * profitMargin)/100)),
//                             morningCharges              : (req.body.morningCharges - ((req.body.morningCharges * profitMargin)/100)),
//                             packageEntity               : "VendorPackage",
//                             profitMarginPercentage      : profitMargin,                                
//                             createdBy                   : req.body.createdBy,
//                             createdAt                   : new Date()
//                         })
//                         packageMaster.save()
//                         .then(vendordata=>{ 
//                             // console.log("Vendor data = ", vendordata);
//                             res.status(200).json({ created : true, packageId : vendordata._id });
//                         })
//                         .catch(err =>{
//                             res.status(500).json({ error: err }); 
//                         });                  
//                     })
//                     .catch(err => {
//                         res.status(500).json({ error: err });
//                     });
//                     res.status(200).json({ created : true, packageId : data._id });
//             })
//             .catch(err =>{
//                 res.status(500).json({ error: err }); 
//             })
//         }
//     })
//     .catch(err=>{
//         res.status(500).json({ error: err }); 
//     })
// };

exports.countPackages = (req, res, next)=>{
    PackageMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchPackages = (req, res, next)=>{
    PackageMaster.aggregate([{
        $lookup:
            {
               from         : "packagetypemasters",
               localField   : "packageTypeId",
               foreignField : "_id",
               as           : "packageType"
            }
        },
        { "$unwind" : "$packageType" },
        {$lookup:
            {
               from         : "citytypemasters",
               localField   : "cityTypeId",
               foreignField : "_id",
               as           : "cityType"
            }
        },
        { "$unwind": "$cityType" },
        {$lookup:
            {
               from         : "categorymasters",
               localField   : "categoryId",
               foreignField : "_id",
               as           : "carCategory"
            }
        },
        { "$unwind": "$carCategory" },
        {$lookup:
            {
               from         : "packagenamemasters",
               localField   : "packageNameId",
               foreignField : "_id",
               as           : "packageName"
            }
        },
        { "$unwind": "$packageName" },
        {$addFields: { 
                    cityType    : "$cityType.cityType",
                    packageType : "$packageType.packageType",
                    carCategory : "$carCategory.category",
                    packageName : "$packageName.packageName"
            }   
        }
        ])
        .sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchListPackages = (req, res, next)=>{
    PackageMaster.find({})
        .sort({packageName : 1})
        .exec()
        .then(data=>{
            // console.log(res.data);
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchGroupedListPackages = (req, res, next)=>{
    // console.log("packageEntity = ",req.params.packageEntity);
    PackageMaster.aggregate([
            {"$match" : {"packageEntity": req.params.packageEntity}},
            {$lookup:
                {
                   from         : "packagetypemasters",
                   localField   : "packageTypeId",
                   foreignField : "_id",
                   as           : "packageType"
                }
            },
            { "$unwind" : "$packageType" },
            {$lookup:
                {
                   from         : "packagenamemasters",
                   localField   : "packageNameId",
                   foreignField : "_id",
                   as           : "packageName"
                }
            },
            { "$unwind" : "$packageType" },
            {$addFields: { 
                            packageType : "$packageType.packageType",
                            packageName : "$packageName.packageName",
                         }   
            },
            {
                 $group : { _id : "$packageType", packages: { $push: "$$ROOT" } }
            },               
        ])
        .sort({packageName : 1})
        .exec()
        .then(data=>{
            // console.log("grouped Data = ",data);
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchGroupedByCityPackages = (req, res, next)=>{
    PackageMaster.aggregate([
            {$lookup:
                {
                   from         : "cityTypemasters",
                   localField   : "cityTypeId",
                   foreignField : "_id",
                   as           : "cityType"
                }
            },
            { "$unwind" : "$cityType" },
            {$lookup:
                {
                   from         : "packagenamemasters",
                   localField   : "packageNameId",
                   foreignField : "_id",
                   as           : "packageName"
                }
            },
            { "$unwind" : "$packageName" },
            {$addFields: { 
                            cityType : "$cityType.cityType",
                            packageName : "$packageName.packageName",
                         }   
            },
            {
                 $group : { _id : "$cityType", packages: { $push: "$$ROOT" } }
            },                
        ])
        .sort({packageName : 1})
        .exec()
        .then(data=>{
            // console.log(res.data);
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchSinglePackage = (req, res, next)=>{
    PackageMaster.findOne({ _id: req.params.packageID })
        .exec()
        .then(data=>{
            res.status(200).json( data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.fetchSortedSinglePackage = (req, res, next)=>{
    // console.log("req.params.packageID = ", req.params.packageID);
    PackageMaster.aggregate([
        {$lookup :
            {
                from            : "citytypemasters",
                localField      : "cityTypeId",
                foreignField    : "_id",
                as              : "cityDetails"
            }                            
        },
        {$unwind : "$cityDetails"}, 
        {$lookup :
            {
                from            : "categorymasters",
                localField      : "categoryId",
                foreignField    : "_id",
                as              : "categoryDetails"
            }                            
        },
        {$unwind : "$categoryDetails"},
        {$lookup :
            {
                from            : "packagetypemasters",
                localField      : "packageTypeId",
                foreignField    : "_id",
                as              : "packageTypeDetails"
            }                            
        },
        {$unwind : "$packageTypeDetails"},
        {$lookup :
            {
                from            : "packagenamemasters",
                localField      : "packageNameId",
                foreignField    : "_id",
                as              : "packageNameDetails"
            }                            
        },
        {$unwind : "$packageNameDetails"},
        {"$match" : {"_id": ObjectId(req.params.packageID)}},
    ])
    .sort({createdAt : -1})
    .exec()
    .then(data=>{
        // console.log("in fetchSortedSinglePackage = ",data);
        res.status(200).json(data);
        // for (var i = data.length - 1; i >= 0; i--) { 
        // console.log("condition = ",data(data[i]._id) == req.params.packageID);           
        //     if((data[i]._id) == req.params.packageID) { 

        //         var joinData = data[i];
        //         res.status(200).json(joinData);
        //     }       
        // }             
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    }); 
};

exports.updatePackage = (req, res, next)=>{ 
    PackageMaster.findOne({_id : req.body.packageID})
    .then(data=>{ 
        PackageMaster.updateOne(
            { _id:req.body.packageID},  
            {
                $set:   {   'packageTypeId'               : req.body.packageTypeId,  
                            'packageNameId'               : req.body.packageNameId,
                            'fixCharges'                  : req.body.fixCharges, 
                            'minHours'                    : req.body.maxHours, 
                            'minKm'                       : req.body.maxKm,
                            'way'                         : req.body.way,
                            'cityTypeId'                  : req.body.cityTypeId,
                            'categoryId'                  : req.body.categoryId,
                            'extraHrCharges'              : req.body.extraHr,
                            'extraKmsCharges'             : req.body.extraKms,
                            'driverAllow'                 : req.body.driverAllow,
                            'nightHalt'                   : req.body.nightHalt,
                            'nightCharges'                : req.body.nightCharges,
                            'morningCharges'              : req.body.morningCharges
                        }
            }
        )
        .exec()
        .then(upcorpdata=>{
            if(upcorpdata.nModified == 1){
                PackageMaster.updateOne(
                { _id:req.body.packageID},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy 
                                            }] 
                            }
                } )
                .exec()
                .then(corpdata=>{
                    processData();
                    async function processData() {
                        var allPreferences = await fetchPreferences();
                        var profitMarginData = allPreferences.filter((data) => {
                            return data;                        
                        })
                        // console.log("profitMarginData = ",profitMarginData[0].profitMargin);
                        if(profitMarginData.length>0){
                            profitMargin = profitMarginData[0].profitMargin;
                        }else{
                            profitMargin = 20;
                        }                                           
                        // console.log("profitMargin = ", profitMargin);
                        PackageMaster.findOne(
                        {
                            'packageTypeId' : req.body.packageTypeId,
                            'cityTypeId'    : req.body.cityTypeId,
                            'categoryId'    : req.body.categoryId,
                            'packageNameId' : req.body.packageNameId,
                            'packageEntity' : "VendorPackage"
                        })
                        .then(onevendordata=>{  
                            // console.log("onevendordata = ",onevendordata);
                            PackageMaster.updateOne(
                                { _id:onevendordata._id},  
                                {
                                    $set:   {   'packageTypeId'               : req.body.packageTypeId,
                                                'packageNameId'               : req.body.packageNameId,
                                                'fixCharges'                  : (req.body.fixCharges - ((req.body.fixCharges * profitMargin)/100)), 
                                                'minHours'                    : req.body.maxHours, 
                                                'minKm'                       : req.body.maxKm,                
                                                'way'                         : req.body.way,
                                                'cityTypeId'                  : req.body.cityTypeId,
                                                'categoryId'                  : req.body.categoryId,
                                                'extraHrCharges'              : (req.body.extraHr - ((req.body.extraHr * profitMargin)/100)),
                                                'extraKmsCharges'             : (req.body.extraKms - ((req.body.extraKms * profitMargin)/100)),
                                                'driverAllow'                 : (req.body.driverAllow - ((req.body.driverAllow * profitMargin)/100)),
                                                'nightHalt'                   : (req.body.nightHalt - ((req.body.nightHalt * profitMargin)/100)),
                                                'nightCharges'                : (req.body.nightCharges - ((req.body.nightCharges * profitMargin)/100)),
                                                'morningCharges'              : (req.body.morningCharges - ((req.body.morningCharges * profitMargin)/100)),
                                                'profitMarginPercentage'      : profitMargin,             
                                            }
                                }
                            )
                            .exec()
                            .then(upvendordata=>{
                                // console.log("upvendordata = ",upvendordata)
                                if(upvendordata.nModified == 1){
                                    PackageMaster.updateOne(
                                    { _id:onevendordata._id},
                                    {
                                        $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                                    updatedBy      : req.body.updatedBy 
                                                                }] 
                                                }
                                    } )
                                    .exec()
                                    .then(vendor=>{                                                        
                                        res.status(200).json({ updated : true });
                                    })
                                }else{
                                    res.status(200).json({ updated : false });
                                }
                            })
                            .catch(err =>{
                                res.status(500).json({ error: err });
                            })
                        })                        
                        .catch(err =>{
                            res.status(500).json({ error: err });
                        });               
                        // res.status(200).json({ created : true, packageId : data._id });
                    }                    
                    res.status(200).json({ updated : true });
                })
            }else{
                res.status(200).json({ updated : false });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });        
    })
    .catch(err=>{
        res.status(500).json({ error: err }); 
    })
};

exports.deletePackage = (req, res, next)=>{
    PackageMaster.deleteOne({_id: req.params.packageID})
        .exec()
        .then(data=>{
            if(data.deletedCount === 1){
                res.status(200).json({ deleted : true });
            }else{
                res.status(200).json({ deleted : false });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });            
};

