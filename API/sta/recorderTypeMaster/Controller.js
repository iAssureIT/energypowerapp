const mongoose	              = require("mongoose");
const RecorderTypeMaster      = require('./Model.js');


exports.insertRecorderTypeMaster = (req,res,next)=>{
  processData();
    async function processData(){
        var allRecorderType = await fetchRecorderType()
        var recorderType = allRecorderType.filter((data)=>{
        if (data.recorderType.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (recorderType.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const recorderTypeMaster = new RecorderTypeMaster({
                    _id                         : new mongoose.Types.ObjectId(),
                    recorderType                : req.body.fieldValue,
                    createdBy                   : req.body.createdBy,
                    createdAt                   : new Date()
                })
                recorderTypeMaster.save()
                .then(data=>{
                    res.status(200).json({ created : true, fieldID : data._id });
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
         }                    
     }               
};

var fetchRecorderType = async ()=>{
    return new Promise(function(resolve,reject){ 
    RecorderTypeMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countRecorderTypeMaster = (req, res, next)=>{
    RecorderTypeMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.list_recoredrtypelist = (req,res,next)=>{
    RecorderTypeMaster.find()
    .select("recorderType")
        .exec()
        .then(data=>{
           
                res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 
exports.fetchRecorderTypeMaster = (req, res, next)=>{
    RecorderTypeMaster.find({})
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
exports.fetchSingleRecorderTypeMaster = (req, res, next)=>{
    RecorderTypeMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchRecorderTypeMaster = (req, res, next)=>{
    RecorderTypeMaster.find({ recorderType: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateRecorderTypeMaster = (req, res, next)=>{
    processData();
    async function processData(){
        var allRecorderType = await fetchRecorderType()
        var recorderType = allRecorderType.filter((data)=>{
        if (data.recorderType.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (recorderType.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            RecorderTypeMaster.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'recorderType'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        RecorderTypeMaster.updateOne(
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
exports.deleteRecorderTypeMaster = (req, res, next)=>{
    RecorderTypeMaster.deleteOne({_id: req.params.fieldID})
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



