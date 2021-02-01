const mongoose  = require("mongoose");
var moment      = require('moment');

const EarlyMorningTimingsMaster = require('./ModelEarlyMorningTimings.js');

exports.insertEarlyMorningTimings = (req,res,next)=>{
    console.log("body = ",req.body);
    processData();
    async function processData(){
        var allData = await fetchAllData();
        if (allData.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            const earlyMorningTimingsMaster = new EarlyMorningTimingsMaster({
                    _id                            : new mongoose.Types.ObjectId(),
                    earlyMorningChargesFromTime    : req.body.earlyMorningChargesFromTime,
                    earlyMorningChargesToTime      : req.body.earlyMorningChargesToTime,
                    createdAt                      : new Date(),
                })
                earlyMorningTimingsMaster.save()
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
    EarlyMorningTimingsMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.fetchEarlyMorningTimingsList = (req, res, next) => {
    EarlyMorningTimingsMaster.find({})
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

exports.getEarlyMorningTimingsList = (req, res, next) => {
    EarlyMorningTimingsMaster.find({})
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
    EarlyMorningTimingsMaster.find({})
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
	EarlyMorningTimingsMaster.find({_id:req.params.id})
    .exec() 
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};

exports.fetchSingleEarlyMorningTimings = (req, res, next) => {
    EarlyMorningTimingsMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.updateEarlyMorningTimings = (req,res,next)=>{
    // console.log("in Update EarlyMorning Timings = ", req.body);
    EarlyMorningTimingsMaster.updateOne(

        { "_id" : req.body.id},
        {
            $set:{
                "earlyMorningChargesFromTime"       : req.body.earlyMorningChargesFromTime,
                "earlyMorningChargesToTime"         : req.body.earlyMorningChargesToTime,
            }
        }
        )
        .exec()
        .then(data=>{        
            if(data.nModified == 1){ 
                EarlyMorningTimingsMaster.updateOne(
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

exports.deleteEarlyMorningTimings = (req, res, next)=>{
    EarlyMorningTimingsMaster.deleteOne({_id: req.params.fieldID})
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
