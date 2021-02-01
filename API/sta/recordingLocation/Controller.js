const mongoose             = require("mongoose");
var   ObjectId          = require('mongodb').ObjectID;
const Recordinglocation    = require('./Model.js');
const CameraLocation    = require('../cameraLocation/Model.js');


exports.create_recordinglocation = (req, res, next) => {
     Recordinglocation.findOne({clientName : req.body.clientName,locationName : req.body.locationName})
    .exec()
    .then(recordinglocation=>{
        if(recordinglocation){
            res.status(200).json({duplicate:true});
        }else{
            const recordinglocation  = new Recordinglocation({
                _id                       :  new mongoose.Types.ObjectId(), 
                clientName                : req.body.clientName,   
                client_id                 : req.body.client_id,   
                department                : req.body.department,   
                project                   : req.body.project,   
                siteName                  : req.body.siteName,
                locationName              : req.body.locationName,
                recorderType              : req.body.recorderType,
                brand                     : req.body.brand,
                maxchannels               : req.body.maxchannels,
                images                    : req.body.images,
                address                   : req.body.address,
                createdAt                 : new Date(),     
            });
            recordinglocation.save()
            .then(data=>{
                res.status(200).json({created:true});
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }); 
        }
    })
    .catch(err =>{
        console.log("err",err);
        res.status(500).json({
            error: err
        });
    });
                            
};
 
exports.list_recordingLoc_with_filter = (req,res,next)=>{
    var selector = {};
    if(req.body.search!=="All"){
        selector['$or'] = [];
        selector["$or"].push({ clientName: { $regex: req.body.search, $options: "i" } })
        selector["$or"].push({ locationName: { $regex: req.body.search, $options: "i" } })
    }
    console.log("selector",selector);
    Recordinglocation.find(selector)
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err","err");
            res.status(500).json({
                error: err
            });
        });
}; 

exports.list_recordingLoc = (req,res,next)=>{
    Recordinglocation.find({})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err","err");
            res.status(500).json({
                error: err
            });
        });
};

exports.list_using_client_id = (req,res,next)=>{
    Recordinglocation.find({client_id:req.params.client_id})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err","err");
            res.status(500).json({
                error: err
            });
        });
};

exports.list_address = (req,res,next)=>{
    var selector = [
      { $unwind : "$address" },
      { $project : { address : 1 ,locationName:1 } },
      { $unwind : "$_id" },
      { $addFields: { 'address.locationType':"Recording"}}
    ];
    if(req.body.client_id !== "All"){
        selector =[
            {$match:{'client_id':ObjectId(req.body.client_id)}},
            { $unwind : "$address" },
            { $project : { address : 1,locationName:1  } },
            { $addFields: { 'address.locationType':"Recording"}}
        ]
    }
    if(req.body.department !== "All"){
        selector =[
            {$match:{'department':req.body.department}},
            { $unwind : "$address" },
            { $project : { address : 1,locationName:1  } },
            { $addFields: { 'address.locationType':"Recording"}}
        ]
    }
    if(req.body.project !== "All"){
        selector =[
            {$match:{'project':req.body.project}},
            { $unwind : "$address" },
            { $project : { address : 1,locationName:1  } },
            { $addFields: { 'address.locationType':"Recording"}}
        ]
    }
    console.log("selector",selector);
    Recordinglocation.aggregate(selector)
    .then(recLoc=>{
        let recordingIDArray = recLoc.map(a => a._id);
            if(req.body.locationType === "Camera" || req.body.locationType === "All"){
                CameraLocation.aggregate([
                  {$match:{'recording_id':{ $in: recordingIDArray }}},  
                  { $unwind : "$address" },
                  { $project : { address : 1,  locationName:1} },
                  { $addFields: { 'address.locationType':"Camera"}}
                ])
                .then(camLoc=>{
                    let combinedArray = [];
                    if(req.body.locationType === "Camera"){
                        res.status(200).json(camLoc);
                    }else{
                        combinedArray.push(...recLoc,...camLoc)
                        res.status(200).json(combinedArray);
                    }
                    
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }else{
                res.status(200).json(recLoc)
            }
            
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 

exports.list_client_name = (req,res,next)=>{
    Recordinglocation.aggregate([
      { $unwind : "$address" },
      { $project : { address : 1  } },
    ])
    .then(recLoc=>{
        let recordingIDArray = recLoc.map(a => a.locationName);
        CameraLocation.aggregate([
          {$match:{'recordingLocationName':{ $in: recordingIDArray }}},  
          { $unwind : "$address" },
          { $project : { address : 1} },
        ])
        .then(camLoc=>{
            res.status(200).json({
                clientName : recLoc.clientName,
                RLCount    : recLoc.length,
                camLoc     : camLoc.length
            });                
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

exports.list_location_name = (req,res,next)=>{
    Recordinglocation.find({},{locationName:1})
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

exports.fetch_one = (req,res,next)=>{
    Recordinglocation.findOne({"_id":req.params.fetchId})
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
exports.update_recordingLoc = (req,res,next)=>{
    Recordinglocation.updateOne(

                        { "_id":req.params.recording_id},    
                        
                        {
                    $set:{
                            clientName                : req.body.clientName,   
                            client_id                 : req.body.client_id,   
                            department                : req.body.department,  
                            project                   : req.body.project,  
                            siteName                  : req.body.siteName,
                            locationName              : req.body.locationName,
                            recorderType              : req.body.recorderType,
                            brand                     : req.body.brand,
                            maxchannels               : req.body.maxchannels,
                            images                    : req.body.images,
                            address                   : req.body.address,
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data){
                            res.status(200).json("RECORDING_LOCATION_UPDATED");
                        }else{
                            res.status(401).json("RECORDING_LOCATION_NOT_UPDATED");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}; 

exports.delete_recordingLoc = (req,res,next)=>{
    Recordinglocation.deleteOne({"_id":req.params.recording_id})
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
exports.delete_all_recordingLoc = (req,res,next)=>{
    Recordinglocation.deleteMany({})
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

exports.get_count = (req,res,next)=>{
    Recordinglocation.find({}).count()
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