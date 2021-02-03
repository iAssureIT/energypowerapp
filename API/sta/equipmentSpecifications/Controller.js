const mongoose          = require("mongoose");
const EquipmentSpecifications        = require('./Model.js');


exports.insertEquipmentSpecifications = (req,res,next)=>{
    processData();
    async function processData(){
        var allEquipmentSpecifications = await fetchEquipmentSpecifications()
        var equipmentSpecification = allEquipmentSpecifications.filter((data)=>{
        if (data.equipmentSpecification === req.body.fieldValue) {
            return data;
        }
        })
        if (equipmentSpecification.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const equipmentSpecificationMaster = new EquipmentSpecifications({
                                _id                         : new mongoose.Types.ObjectId(),
                                equipmentSpecification                  : req.body.fieldValue,
                                createdBy                   : req.body.createdBy,
                                createdAt                   : new Date()
                            })
                            equipmentSpecificationMaster.save()
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

var fetchEquipmentSpecifications= async ()=>{
    return new Promise(function(resolve,reject){ 
    EquipmentSpecifications.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countEquipmentSpecifications = (req, res, next)=>{
    EquipmentSpecifications.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchEquipmentSpecifications = (req, res, next)=>{
    EquipmentSpecifications.find({})
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
exports.fetchSingleEquipmentSpecifications = (req, res, next)=>{
    EquipmentSpecifications.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchEquipmentSpecifications  = (req, res, next)=>{
    EquipmentSpecifications.find({ equipmentSpecifications: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateEquipmentSpecifications  = (req, res, next)=>{
    processData();
    async function processData(){
        var allEquipmentSpecifications = await fetchEquipmentSpecifications()
        var equipmentSpecification = allEquipmentSpecifications.filter((data)=>{
        if (data.equipmentSpecification === req.body.fieldValue) {
            return data;
        }
        })
        if (equipmentSpecification.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
        EquipmentSpecifications.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'equipmentSpecification'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    EquipmentSpecifications.updateOne(
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
exports.deleteEquipmentSpecifications = (req, res, next)=>{
    EquipmentSpecifications.deleteOne({_id: req.params.fieldID})
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



