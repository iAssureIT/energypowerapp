const mongoose                = require("mongoose");
const CameraModel       = require('./Model.js');


exports.insertCameraModel= (req,res,next)=>{
   processData();
    async function processData(){
        var allCameraModel= await fetchCameraModel();
        console.log("allCameraModel",allCameraModel);
        var cameraModel= allCameraModel.filter((data)=>{
        if (data.cameraModel.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (cameraModel.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const cameraModel= new CameraModel({
                _id                         : new mongoose.Types.ObjectId(),
                cameraModel           : req.body.fieldValue,
                createdBy                   : req.body.createdBy,
                createdAt                   : new Date(),
            })
            cameraModel.save()
            .then(data=>{
                res.status(200).json({ created : true, fieldID : data._id });
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
            });
        }                    
     }               
};

var fetchCameraModel= async ()=>{
    return new Promise(function(resolve,reject){ 
    CameraModel.find({})
        .exec()
        .then(data=>{
            console.log("fetchCameraModel",data)
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countCameraModel= (req, res, next)=>{
    CameraModel.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.getCameraModel= (req, res, next)=>{
    CameraModel.find({})
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
exports.fetchSingleCameraModel= (req, res, next)=>{
    CameraModel.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchCameraModel= (req, res, next)=>{
    CameraModel.find({ cameraModel: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateCameraModel= (req, res, next)=>{
    processData();
    async function processData(){
        var allCameraModel= await fetchCameraModel();
        console.log("allCameraModel",allCameraModel);
        var cameraModel= allCameraModel.filter((data)=>{
        if (data.cameraModel.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (cameraModel.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            CameraModel.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'cameraModel'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        CameraModel.updateOne(
                        { _id:req.body.fieldID},
                        {
                            $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                        updatedBy      : req.body.updatedBy 
                                                    }] 
                                    }
                        })
                        .exec()
                        .then(data=>{
                            res.status(200).json({ updated : true });
                        })
                    }else{
                        res.status(200).json({ updated : false });
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({ error: err });
                });
          }
    }            
};
exports.deleteCameraModel= (req, res, next)=>{
    CameraModel.deleteOne({_id: req.params.fieldID})
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



