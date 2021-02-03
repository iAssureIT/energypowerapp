const mongoose                = require("mongoose");
const ActualPerformance        = require('./Model.js');


exports.insertActualPerformance = (req,res,next)=>{
   processData();
    async function processData(){
        var allActualPerformance = await fetchActualPerformance();
        console.log("allActualPerformance",allActualPerformance);
        var actualPerformance = allActualPerformance.filter((data)=>{
        if (data.actualPerformance.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (actualPerformance.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const actualPerformance = new ActualPerformance({
                _id                         : new mongoose.Types.ObjectId(),
                actualPerformance            : req.body.fieldValue,
                createdBy                   : req.body.createdBy,
                createdAt                   : new Date(),
            })
            actualPerformance.save()
            .then(data=>{
                res.status(200).json({ created : true, fieldID : data._id });
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
            });
        }                    
     }               
};

var fetchActualPerformance = async ()=>{
    return new Promise(function(resolve,reject){ 
    ActualPerformance.find({})
        .exec()
        .then(data=>{
            console.log("fetchActualPerformance",data)
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countActualPerformance = (req, res, next)=>{
    ActualPerformance.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.getActualPerformance = (req, res, next)=>{
    ActualPerformance.find({})
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
exports.fetchSingleActualPerformance = (req, res, next)=>{
    ActualPerformance.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchActualPerformance = (req, res, next)=>{
    ActualPerformance.find({ cameraresolution: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateActualPerformance = (req, res, next)=>{
    processData();
        async function processData(){
        var allActualPerformance = await fetchActualPerformance();
        console.log("allActualPerformance",allActualPerformance);
        var actualPerformance = allActualPerformance.filter((data)=>{
        if (data.actualPerformance.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (actualPerformance.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            ActualPerformance.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'actualPerformance'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        ActualPerformance.updateOne(
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
exports.deleteActualPerformance = (req, res, next)=>{
    ActualPerformance.deleteOne({_id: req.params.fieldID})
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



