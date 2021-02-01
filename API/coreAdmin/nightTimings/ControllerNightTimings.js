const mongoose  = require("mongoose");
var moment      = require('moment');

const NightTimingsMaster = require('./ModelNightTimings.js');

exports.insertNightTimings = (req,res,next)=>{
    console.log("body = ",req.body);
    processData();
    async function processData(){
        var allData = await fetchAllData();
        if (allData.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            const nightTimingsMaster = new NightTimingsMaster({
                    _id                     : new mongoose.Types.ObjectId(),
                    nightChargesFromTime    : req.body.nightChargesFromTime,
                    nightChargesToTime      : req.body.nightChargesToTime,
                    createdAt               : new Date(),
                })
                nightTimingsMaster.save()
                .then(data=>{
                    res.status(200).json({ created : true, fieldID : data._id });
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
        }
    }         
};

var fetchAllData = async ()=>{
    return new Promise(function(resolve,reject){ 
    NightTimingsMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.fetchNightTimingsList = (req, res, next) => {
    NightTimingsMaster.find({})
        .sort({ createdAt: -1 })
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getNightTimingsList = (req, res, next) => {
    NightTimingsMaster.find({})
        .sort({ createdAt: -1 })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.showAllData = (req,res,next)=>{
    NightTimingsMaster.find({})
    .sort({createdAt : -1})
    .exec() 
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });

}

exports.getSingleData = (req,res,next)=>{
	NightTimingsMaster.find({_id:req.params.id})
    .exec() 
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};

exports.fetchSingleNightTimings = (req, res, next) => {
    NightTimingsMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.updateNightTimings = (req,res,next)=>{
    // console.log("in Update Night Timings = ", req.body);
    NightTimingsMaster.updateOne(

        { "_id" : req.body.id},
        {
            $set:{
                "nightChargesFromTime"       : req.body.nightChargesFromTime,
                "nightChargesToTime"         : req.body.nightChargesToTime,
            }
        }
        )
        .exec()
        .then(data=>{        
            if(data.nModified == 1){ 
                NightTimingsMaster.updateOne(
                { _id:req.body.id},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy 
                                            }] 
                            }
                } )
                .exec()
                .then(updata=>{
                    res.status(200).json({ updated : true });
                })
            }else{
                res.status(404).json("Data Not found");
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
}

exports.deleteNightTimings = (req, res, next)=>{
    NightTimingsMaster.deleteOne({_id: req.params.fieldID})
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
