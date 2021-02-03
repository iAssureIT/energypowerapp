const mongoose	              = require("mongoose");
const DivisionMaster      = require('./Model.js');


exports.insertDivisionMaster = (req,res,next)=>{
  processData();
    async function processData(){
        var allDivision = await fetchDivision()
        var division = allDivision.filter((data)=>{
        if (data.division.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (division.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const divisionMaster = new DivisionMaster({
                    _id                         : new mongoose.Types.ObjectId(),
                    division                : req.body.fieldValue,
                    createdBy                   : req.body.createdBy,
                    createdAt                   : new Date()
                })
                divisionMaster.save()
                .then(data=>{
                    res.status(200).json({ created : true, fieldID : data._id });
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
         }                    
     }               
};

var fetchDivision = async ()=>{
    return new Promise(function(resolve,reject){ 
    DivisionMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countDivisionMaster = (req, res, next)=>{
    DivisionMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.list_recoredrtypelist = (req,res,next)=>{
    DivisionMaster.find()
    .select("division")
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
exports.fetchDivisionMaster = (req, res, next)=>{
    DivisionMaster.find({})
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
exports.fetchSingleDivisionMaster = (req, res, next)=>{
    DivisionMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchDivisionMaster = (req, res, next)=>{
    DivisionMaster.find({ division: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateDivisionMaster = (req, res, next)=>{
    processData();
    async function processData(){
        var allDivision = await fetchDivision()
        var division = allDivision.filter((data)=>{
        if (data.division.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (division.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            DivisionMaster.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'division'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        DivisionMaster.updateOne(
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
exports.deleteDivisionMaster = (req, res, next)=>{
    DivisionMaster.deleteOne({_id: req.params.fieldID})
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



