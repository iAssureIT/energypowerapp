const mongoose          = require("mongoose");
var   ObjectId          = require('mongodb').ObjectId;
const TimeFormat       = require('./ModelTimeFormat.js');

exports.create_timeFormat = (req,res,next)=>{
    TimeFormat.find()
        .exec()
        .then(data =>{                       
            const timeFormat = new TimeFormat({
                    _id                  : new mongoose.Types.ObjectId(),
                    timeFormat           : req.body.timeFormat
            });
            timeFormat.save()
                .then(data=>{                    
                    res.status(200).json("Time Format Added");                    
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

exports.detail_timeFormat = (req,res,next)=>{
    TimeFormat.findOne({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Time Format Not Found');
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
}

exports.update_timeFormat = (req,res,next)=>{
    TimeFormat.updateOne(
        { _id : req.body.id},    
            {
                $set:{
                    "timeFormat"            : req.body.timeFormat,                 
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json("Time Format Updated");
            }else{
                res.status(401).json("Time Format Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

