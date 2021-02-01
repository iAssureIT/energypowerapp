const mongoose                = require("mongoose");
const Cameraresolution        = require('./Model.js');


exports.insertCameraResolution = (req,res,next)=>{
   processData();
    async function processData(){
        var allCameraResolution = await fetchCameraResolution();
        console.log("allCameraResolution",allCameraResolution);
        var cameraResolution = allCameraResolution.filter((data)=>{
        if (data.cameraResolution.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (cameraResolution.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const cameraResolution = new Cameraresolution({
                _id                         : new mongoose.Types.ObjectId(),
                cameraResolution            : req.body.fieldValue,
                createdBy                   : req.body.createdBy,
                createdAt                   : new Date(),
            })
            cameraResolution.save()
            .then(data=>{
                res.status(200).json({ created : true, fieldID : data._id });
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
            });
        }                    
     }               
};

var fetchCameraResolution = async ()=>{
    return new Promise(function(resolve,reject){ 
    Cameraresolution.find({})
        .exec()
        .then(data=>{
            console.log("fetchCameraResolution",data)
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countCameraresolution = (req, res, next)=>{
    Cameraresolution.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.getCameraresolution = (req, res, next)=>{
    Cameraresolution.find({})
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
exports.fetchSingleCameraresolution = (req, res, next)=>{
    Cameraresolution.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchCameraresolution = (req, res, next)=>{
    Cameraresolution.find({ cameraresolution: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateCameraresolution = (req, res, next)=>{
    processData();
        async function processData(){
        var allCameraResolution = await fetchCameraResolution();
        console.log("allCameraResolution",allCameraResolution);
        var cameraResolution = allCameraResolution.filter((data)=>{
        if (data.cameraResolution.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (cameraResolution.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            Cameraresolution.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'cameraResolution'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        Cameraresolution.updateOne(
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
exports.deleteCameraresolution = (req, res, next)=>{
    Cameraresolution.deleteOne({_id: req.params.fieldID})
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



