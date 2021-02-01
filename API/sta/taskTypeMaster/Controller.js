const mongoose	        = require("mongoose");
const Tasktypemaster    = require('./Model.js');


exports.inserttaskType = (req,res,next)=>{
    processData();
    async function processData(){
        var allTaskType= await fetchTaskType()
        var taskType = allTaskType.filter((data)=>{
        if (data.taskType === req.body.fieldValue) {
            return data;
        }
        })
        if (taskType.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const taskTypeMaster = new Tasktypemaster({
                    _id                         : new mongoose.Types.ObjectId(),
                    taskType                    : req.body.fieldValue,
                    createdBy                   : req.body.createdBy,
                    createdAt                   : new Date()
                })
                taskTypeMaster.save()
                .then(data=>{
                    res.status(200).json({ created : true, fieldID : data._id });
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
          }                    
     }                 
};

var fetchTaskType= async ()=>{
    return new Promise(function(resolve,reject){ 
    Tasktypemaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.counttaskType = (req, res, next)=>{
    Tasktypemaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchtaskType = (req, res, next)=>{
    Tasktypemaster.find({})
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
exports.fetchSingletaskType = (req, res, next)=>{
    Tasktypemaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchtaskType = (req, res, next)=>{
    Tasktypemaster.find({ tasktype: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updatetaskType = (req, res, next)=>{
    processData();
    async function processData(){
        var allTaskType= await fetchTaskType()
        var taskType = allTaskType.filter((data)=>{
        if (data.taskType === req.body.fieldValue) {
            return data;
        }
        })
        if (taskType.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            Tasktypemaster.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'taskType'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        Tasktypemaster.updateOne(
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
exports.deletetaskType = (req, res, next)=>{
    Tasktypemaster.deleteOne({_id: req.params.fieldID})
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



