const mongoose          = require("mongoose");
const CameraType        = require('./Model.js');


exports.insertCameratype = (req,res,next)=>{
    processData();
    async function processData(){
        var allCameraType = await fetchCameraType()
        var cameraType = allCameraType.filter((data)=>{
        if (data.cameraType === req.body.fieldValue) {
            return data;
        }
        })
        if (cameraType.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const cameraTypeMaster = new CameraType({
                                _id                         : new mongoose.Types.ObjectId(),
                                cameraType                  : req.body.fieldValue,
                                createdBy                   : req.body.createdBy,
                                createdAt                   : new Date()
                            })
                            cameraTypeMaster.save()
                            .then(data=>{
                                console.log("data--->",data);
                                res.status(200).json({ created : true, fieldID : data._id });
                            })
                            .catch(err =>{
                                res.status(500).json({ error: err }); 
                                console.log("error---->",err);
                            });
         }                    
     }                 
};

var fetchCameraType= async ()=>{
    return new Promise(function(resolve,reject){ 
    CameraType.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countCameratype = (req, res, next)=>{
    CameraType.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchCameratype = (req, res, next)=>{
    CameraType.find({})
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
exports.fetchSingleCameratype = (req, res, next)=>{
    CameraType.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchCameratype  = (req, res, next)=>{
    CameraType.find({ cameratype: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateCameratype  = (req, res, next)=>{
    processData();
    async function processData(){
        var allCameraType = await fetchCameraType()
        var cameraType = allCameraType.filter((data)=>{
        if (data.cameraType === req.body.fieldValue) {
            return data;
        }
        })
        if (cameraType.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
        CameraType.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'cameraType'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    CameraType.updateOne(
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
exports.deleteCameratype = (req, res, next)=>{
    CameraType.deleteOne({_id: req.params.fieldID})
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



