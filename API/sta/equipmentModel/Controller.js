const mongoose                = require("mongoose");
const EquipmentModel       = require('./Model.js');


exports.insertEquipmentModel= (req,res,next)=>{
   processData();
    async function processData(){
        var allEquipmentModel= await fetchEquipmentModel();
        console.log("allEquipmentModel",allEquipmentModel);
        var equipmentModel= allEquipmentModel.filter((data)=>{
        if (data.equipmentModel.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (equipmentModel.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const equipmentModel= new EquipmentModel({
                _id                         : new mongoose.Types.ObjectId(),
                equipmentModel           : req.body.fieldValue,
                createdBy                   : req.body.createdBy,
                createdAt                   : new Date(),
            })
            equipmentModel.save()
            .then(data=>{
                res.status(200).json({ created : true, fieldID : data._id });
            })
            .catch(err =>{
                res.status(500).json({ error: err }); 
            });
        }                    
     }               
};

var fetchEquipmentModel= async ()=>{
    return new Promise(function(resolve,reject){ 
    EquipmentModel.find({})
        .exec()
        .then(data=>{
            console.log("fetchEquipmentModel",data)
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countEquipmentModel= (req, res, next)=>{
    EquipmentModel.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.getEquipmentModel= (req, res, next)=>{
    EquipmentModel.find({})
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
exports.fetchSingleEquipmentModel= (req, res, next)=>{
    EquipmentModel.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchEquipmentModel= (req, res, next)=>{
    EquipmentModel.find({ equipmentModel: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateEquipmentModel= (req, res, next)=>{
    processData();
    async function processData(){
        var allEquipmentModel= await fetchEquipmentModel();
        console.log("allEquipmentModel",allEquipmentModel);
        var equipmentModel= allEquipmentModel.filter((data)=>{
        if (data.equipmentModel.trim().toLowerCase() === req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (equipmentModel.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            EquipmentModel.updateOne(
                    { _id:req.body.fieldID },  
                    {
                        $set:   {  'equipmentModel'       : req.body.fieldValue  }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        EquipmentModel.updateOne(
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
exports.deleteEquipmentModel= (req, res, next)=>{
    EquipmentModel.deleteOne({_id: req.params.fieldID})
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



