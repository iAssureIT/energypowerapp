const mongoose          = require("mongoose");
var   ObjectId          = require('mongodb').ObjectId;
const Preferences       = require('./ModelPreferences.js');
const PackageMaster     = require('../packageMaster/ModelPackageMaster.js');

exports.create_preferences = (req,res,next)=>{
    Preferences.find()
        .exec()
        .then(data =>{                       
            const preferences = new Preferences({
                    _id                    : new mongoose.Types.ObjectId(),
                    profitMargin           : req.body.profitMargin
            });
            preferences.save()
                .then(data=>{
                    processData();
                    async function processData() {
                        var profitMargin = req.body.profitMargin;
                        var allVendorPackages = await fetchVendorPackages();
                        var vendorData = allVendorPackages.filter((data) => {
                            return data;                        
                        })
                        for (var i = 0; i < vendorData.length; i++) {
                            var packageTypeId = vendorData[i].packageTypeId;
                            var cityTypeId    = vendorData[i].cityTypeId;
                            var categoryId    = vendorData[i].categoryId;
                            var packageNameId = vendorData[i].packageNameId;
                            var packageEntity = "CorporatePackage";
                            var vendorId = vendorData[i]._id;
                            var oneCorpData = await fetchCorporatePackages(packageTypeId, cityTypeId, categoryId, packageNameId, packageEntity);
                            console.log("oneCorpData = ",oneCorpData);
                            if(oneCorpData){
                                var oneVendorUpdate = await updateOneVendor(vendorId, oneCorpData, profitMargin);
                                console.log("oneVendorUpdate = ",oneVendorUpdate);
                            }
                        }
                       res.status(200).json("Profit Margin Added"); 
                    }                     
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

var fetchVendorPackages = async () => {
    return new Promise(function (resolve, reject) {
        PackageMaster.find({'packageEntity' : 'VendorPackage'})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

var fetchCorporatePackages = async (packageTypeId, cityTypeId, categoryId, packageNameId, packageEntity) => {
    return new Promise(function (resolve, reject) {
        console.log("async data = ",packageTypeId)
        PackageMaster.findOne(
            {
                'packageTypeId' : packageTypeId,
                'cityTypeId'    : cityTypeId,
                'categoryId'    : categoryId,
                'packageNameId' : packageNameId,
                'packageEntity' : packageEntity
            })
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

var updateOneVendor = async (vendorId, oneCorpData, profitMargin) => {
    return new Promise(function (resolve, reject) {
        console.log("async vendorId = ",vendorId);
        console.log("async oneCorpData = ",oneCorpData);
        console.log("async profitMargin = ",profitMargin);
        PackageMaster.updateOne(
            { _id : vendorId},  
            {
                $set:   {
                            'fixCharges'                  : (oneCorpData.fixCharges - ((oneCorpData.fixCharges * profitMargin)/100)), 
                            'extraHrCharges'              : (oneCorpData.extraHrCharges - ((oneCorpData.extraHrCharges * profitMargin)/100)),
                            'extraKmsCharges'             : (oneCorpData.extraKmsCharges - ((oneCorpData.extraKmsCharges * profitMargin)/100)),
                            'driverAllow'                 : (oneCorpData.driverAllow - ((oneCorpData.driverAllow * profitMargin)/100)),
                            'nightHalt'                   : (oneCorpData.nightHalt - ((oneCorpData.nightHalt * profitMargin)/100)),
                            'nightCharges'                : (oneCorpData.nightCharges - ((oneCorpData.nightCharges * profitMargin)/100)),
                            'morningCharges'              : (oneCorpData.morningCharges - ((oneCorpData.morningCharges * profitMargin)/100)),
                            'profitMarginPercentage'      : profitMargin,             
                        }
            }
        )
        .exec()
        .then(data=>{
            resolve(data);                          
        })
        .catch(err =>{
            reject(err);
        });
    });
};

exports.detail_preferences = (req,res,next)=>{
    Preferences.findOne({})
        .exec()
        .then(data=>{
            if(data){                
                res.status(200).json(data);
            }else{
                res.status(404).json('Preferences Not Found');
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
}

exports.update_profitMargin = (req,res,next)=>{
    Preferences.updateOne(
        { _id : req.body.id},    
            {
                $set:{
                    "profitMargin"            : req.body.profitMargin,                 
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                processData();
                    async function processData() {
                        var profitMargin = req.body.profitMargin;
                        var allVendorPackages = await fetchVendorPackages();
                        var vendorData = allVendorPackages.filter((data) => {
                            return data;                        
                        })
                        for (var i = 0; i < vendorData.length; i++) {
                            var packageTypeId = vendorData[i].packageTypeId;
                            var cityTypeId    = vendorData[i].cityTypeId;
                            var categoryId    = vendorData[i].categoryId;
                            var packageNameId = vendorData[i].packageNameId;
                            var packageEntity = "CorporatePackage";
                            var vendorId = vendorData[i]._id;
                            var oneCorpData = await fetchCorporatePackages(packageTypeId, cityTypeId, categoryId, packageNameId, packageEntity);
                            console.log("oneCorpData = ",oneCorpData);
                            if(oneCorpData){
                                var oneVendorUpdate = await updateOneVendor(vendorId, oneCorpData, profitMargin);
                                console.log("oneVendorUpdate = ",oneVendorUpdate);
                            }
                        }
                       res.status(200).json("Profit Margin Updated"); 
                    }  
                
            }else{
                res.status(401).json("Profit Margin Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}