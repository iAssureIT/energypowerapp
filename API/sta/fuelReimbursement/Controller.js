const mongoose = require("mongoose");
const FuelReibursement = require('./Model.js');
const VehicleMaster  = require('../vehicleMaster/Model.js')

exports.insertFuelReimbursement = (req, res, next) => {
    // console.log("Document Data = ", req.body);
    processData();
    async function processData(){
    var fuelReibursement = await fetchFuelReibursement();

    var fuelReibursementName = fuelReibursement.filter((data)=>{
        if ( data.vehicle_id == req.body.dropdownID && data.fuelReimbursement.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (fuelReibursementName.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            const fuelReibursementMaster = new FuelReibursement({
                _id: new mongoose.Types.ObjectId(),
                vehicle_id: req.body.dropdownID,
                fuelReimbursement: req.body.fieldValue,
                createdBy: req.body.createdBy,
                createdAt: new Date()
            })
            fuelReibursementMaster.save()
                .then(data => {
                    res.status(200).json({ created: true, fieldID: data._id });
                })
                .catch(err => {
                    console.log("error",error);
                    res.status(500).json({ error: err });
                });
            }
        }
};


var fetchFuelReibursement = async (req,res,next)=>{
    return new Promise(function(resolve,reject){ 
    FuelReibursement.aggregate([

        {$lookup:
            {
                from: "vehiclemasters",
                localField: "vehicle_id",
                foreignField: "_id",
                as: "vehicleDetails"
            }
        },
        { "$unwind": "$vehicleDetails" },
        {$addFields: { vehicleType : "$vehicleDetails.vehicleType"}}
    ])
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            console.log("data =>",data);
            var alldata = data.map((a, i)=>{
                    // console.log("a =>",a);
                    return {
                        "_id"                : a._id,
                        "vehicleType"        : a.vehicleType,
                        "fuelReimbursement"  : a.fuelReimbursement,
                        "vehicle_id"         : a.vehicle_id  
                    }
            })
            resolve( data )
            // console.log("data =>",data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
            console.log("data Error=>",err);;
        }); 
    });
};



exports.fetchFuelReimbursement = (req, res, next)=>{
    FuelReibursement.aggregate([
    {$lookup:
        {
            from: "vehiclemasters",
            localField: "vehicle_id",
            foreignField: "_id",
            as: "vehicleDetails"
        }
    },
    { "$unwind": "$vehicleDetails" },
    {$addFields: { vehicleType : "$vehicleDetails.vehicleType"}}
    ])
    .sort({createdAt : -1})
    .exec()
    .then(data=>{
        console.log("data =>",data);
        var alldata = data.map((a, i)=>{
                // console.log("a =>",a);
                return {
                    "_id"                : a._id,
                    "vehicleType"        : a.vehicleType,
                    "fuelReimbursement"  : a.fuelReimbursement,
                    "vehicle_id"         : a.vehicle_id  
                }
        })
        console.log("alldata",alldata);
        res.status(200).json(alldata);;
    })
    .catch(err =>{
        res.status(500).json({ error: err });
        console.log("data Error=>",err);;
    }); 
};



exports.getFuelReimbursement = (req, res, next) => {
    FuelReibursement.find({})
        .sort({ createdAt: -1 })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getFuelReimbursementData = (req, res, next) => {
    VehicleMaster.find({vehicleType : req.params.entityname})
        .sort({ createdAt: -1 })
        .exec()
        .then(data => {
            console.log("document data==>",data);
            if(data && data.length > 0){
                FuelReibursement.find({vehicle_id:data[0]._id})
                .sort({ createdAt: -1 })
                .exec()
                .then(data => {
                    res.status(200).json(data);
                })
                .catch(err => {
                console.log("error",err);
                    res.status(500).json({ error: err });
                });
            }else{
                res.status(200).json(data);
            }
        })
        .catch(err => {
            console.log("error",err);
            res.status(500).json({ error: err });
        });
};
exports.fetchSingleFuelReimbursement = (req, res, next) => {
    FuelReibursement.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.updateFuelReimbursement = (req, res, next) => {
    
    // console.log("req.params.fieldID==>",req.body.fieldID)
    processData();
    async function processData(){
    var fuelReibursement = await fetchFuelReibursement();

    var fuelReibursementName = fuelReibursement.filter((data)=>{
        if ( data.vehicle_id == req.body.dropdownID && data.fuelReimbursement.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (fuelReibursementName.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            FuelReibursement.updateOne(
                { _id: req.body.fieldID },
                {
                    $set: {
                        'vehicle_id': req.body.dropdownID,
                        'fuelReimbursement': req.body.fieldValue
                    }
                }
            )
                .exec()
                .then(data => {
                    // console.log("reqdata==>",data)
                    if (data.nModified == 1) {
                        FuelReibursement.updateOne(
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
         }
    }            
};
exports.deleteFuelReimbursement = (req, res, next) => {
    FuelReibursement.deleteOne({ _id: req.params.fieldID })
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
