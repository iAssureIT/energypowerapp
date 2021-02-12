const mongoose	        = require("mongoose");
const ProcessMaster = require('./Model.js');


exports.insertprocess = (req,res,next)=>{
    processData();
    async function processData(){
        var allProcess = await fetchProcess()
        var process = allProcess.filter((data)=>{
        if (data.process == req.body.fieldValue) {
            return data;
        }
        })
        if (process.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const processMaster = new ProcessMaster({
                                _id                         : new mongoose.Types.ObjectId(),
                                process                 : req.body.fieldValue,
                                createdBy                   : req.body.createdBy,
                                createdAt                   : new Date()
                            })
                            processMaster.save()
                            .then(data=>{
                                res.status(200).json({ created : true, fieldID : data._id });
                            })
                            .catch(err =>{
                                res.status(500).json({ error: err }); 
                            });
        }                    
     }                   
};

var fetchProcess = async ()=>{
    return new Promise(function(resolve,reject){ 
    ProcessMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countprocess = (req, res, next)=>{
    ProcessMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchprocess = (req, res, next)=>{
    ProcessMaster.find({})
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
exports.fetchSingleprocess = (req, res, next)=>{
    ProcessMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchprocess = (req, res, next)=>{
    ProcessMaster.find({ fuelType: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateprocess = (req, res, next)=>{
    processData();
    async function processData(){
        var allProcess = await fetchProcess()
        var process = allProcess.filter((data)=>{
        if (data.process == req.body.fieldValue) {
            return data;
        }
        })
        if (process.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            ProcessMaster.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'process'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    ProcessMaster.updateOne(
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
exports.deleteprocess = (req, res, next)=>{
    ProcessMaster.deleteOne({_id: req.params.fieldID})
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



