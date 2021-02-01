const mongoose          = require("mongoose");
var ObjectID            = require('mongodb').ObjectID;
const Cameralocation    = require('./Model.js');
const Recordinglocation    = require('../recordingLocation/Model.js');

exports.create_cameralocation = (req, res, next) => {
    console.log("inside comment");

    const cameralocation  = new Cameralocation({

            _id                       : new mongoose.Types.ObjectId(), 
            locationName              : req.body.locationName,
            recordingLocationName     : req.body.recordingLocationName,
            recording_id              : req.body.recording_id,
            cameraType                : req.body.cameraType,
            cameraBrand               : req.body.cameraBrand,
            cameraModel               : req.body.cameraModel,
            cameraResolution          : req.body.cameraResolution,
            images                    : req.body.images,
            cameraUrl                 : req.body.cameraUrl,
            address                   : req.body.address,
            createdAt                 : new Date(),     
        });
        
        cameralocation.save()
            .then(data=>{
                console.log("data--->",data);
                    res.status(200).json({
                                        message : "Camera Location details inserted",
                                        ID      : data._id
                                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

                           
}; 
exports.list_cameraLoc_with_filter = (req,res,next)=>{
    var selector = {};
    if(req.body.search!=="All"){
        selector['$or'] = [];
        selector["$or"].push({ recordingLocationName: { $regex: req.body.search, $options: "i" } })
        selector["$or"].push({ locationName: { $regex: req.body.search, $options: "i" } })
    }


    Cameralocation.find(selector)
        .populate('recording_id')
        .exec()
        .then(data=>{
            main();
            async function main(){
                var cameralocation_id = data.map(a=>a._id);
                var cameraLocation = await getCameraLocation(req.body.search,cameralocation_id);
                // console.log("cameraLocation",cameraLocation);
                if(cameraLocation.length > 0){
                    const newArray = [...data, ...cameraLocation];
                    res.status(200).json(newArray);
                }else{
                     res.status(200).json(data);
                }
                
            }  
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
}; 

     


function getCameraLocation(text,cameralocation_id){
   return new Promise(function(resolve,reject){
        Recordinglocation.find({clientName:{ $regex: text, $options: "i" }},{_id:1})
        .exec()
        .then(recordingLocation=>{
            var selector = {};
            if(cameralocation_id.length > 0){
                selector = {_id:{$nin:cameralocation_id}}
            }
            Cameralocation.find(selector)
            .populate('recording_id')
            .exec()
            .then(cameralocation=>{
                var returnArray = [];
                for (var i = 0; i < recordingLocation.length; i++) {
                    for (var j = 0; j < cameralocation.length; j++) {
                        if(String(recordingLocation[i]._id)===String(cameralocation[j].recording_id._id)){
                            returnArray.push(cameralocation[j])
                        }
                    }
                }
                if(i >= recordingLocation.length){
                    resolve(returnArray)
                }
            })
            .catch(err =>{
                console.log("err",err);
            });
            
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
    });
}


exports.list_cameraLoc = (req,res,next)=>{
    Cameralocation.find({})
        .populate('recording_id')
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
};

exports.list_using_recording_id = (req,res,next)=>{
    Cameralocation.find({recording_id:req.params.recording_id})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
};
exports.fetch_one = (req,res,next)=>{
    Cameralocation.findOne({"_id":req.params.fetchId})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('PAGE_NOT_FOUND');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};   
exports.update_cameraLoc = (req,res,next)=>{
    Cameralocation.updateOne(

                        { "_id":req.params.camera_id},    
                        
                        {
                            $set:{
                                locationName              : req.body.locationName,
                                recordingLocationName     : req.body.recordingLocationName,
                                recording_id              : req.body.recording_id,
                                cameraType                : req.body.cameraType,
                                cameraBrand               : req.body.cameraBrand,
                                cameraResolution          : req.body.cameraResolution,
                                cameraModel               : req.body.cameraModel,
                                images                    : req.body.images,
                                cameraUrl                 : req.body.cameraUrl,
                                address                   : req.body.address,
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data){
                            res.status(200).json("CAMERA_LOCATION_UPDATED");
                        }else{
                            res.status(401).json("CAMERA_LOCATION_NOT_UPDATED");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}; 

exports.delete_cameraLoc = (req,res,next)=>{
    Cameralocation.deleteOne({"_id":req.params.camera_id})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount === 1){
                res.status(200).json("CAMERA_LOCATION_DELETED");
            }else{
                res.status(200).json("CAMERA_LOCATION_NOT_DELETED");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete_all_cameraLoc = (req,res,next)=>{
    Cameralocation.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All camera locations deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.list_address = (req,res,next)=>{
    Cameralocation.aggregate([
      { $unwind : "$address" },
      { $project : { address : 1  } },
      { $unwind : "$_id" },
    ])
    .then(data=>{
        console.log("data",data);
            res.status(200).json(data);
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 

exports.list_location_name = (req,res,next)=>{
    Cameralocation.find({},{locationName:1})
    .then(data=>{
        console.log("data",data);
            res.status(200).json(data);
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 

exports.get_count = (req,res,next)=>{
    Cameralocation.find({}).count()
    .then(count=>{
            res.status(200).json({count});
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 