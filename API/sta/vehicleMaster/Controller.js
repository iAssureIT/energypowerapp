const mongoose          = require("mongoose");
const VehicleMaster    = require('./Model.js');


exports.insertVehicle = (req,res,next)=>{
    processData();
    async function processData(){
        var allVehicle= await fetchVehicle()
        var Vehicle = allVehicle.filter((data)=>{
        if (data.vehicleType === req.body.fieldValue) {
            return data;
        }
        })
        if (Vehicle.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const vehicleMaster = new VehicleMaster({
                    _id                         : new mongoose.Types.ObjectId(),
                    vehicleType                    : req.body.fieldValue,
                    createdBy                   : req.body.createdBy,
                    createdAt                   : new Date()
                })
                vehicleMaster.save()
                .then(data=>{
                    res.status(200).json({ created : true, fieldID : data._id });
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
          }                    
     }                 
};

var fetchVehicle= async ()=>{
    return new Promise(function(resolve,reject){ 
    VehicleMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countVehicle = (req, res, next)=>{
    VehicleMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchVehicle = (req, res, next)=>{
    VehicleMaster.find({})
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
exports.fetchSingleVehicle = (req, res, next)=>{
    VehicleMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchVehicle = (req, res, next)=>{
    VehicleMaster.find({ vehicleType: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateVehicle = (req, res, next)=>{
    processData();
    async function processData(){
        var allVehicle= await fetchVehicle()
        var Vehicle = allVehicle.filter((data)=>{
            if(data.vehicleType === req.body.fieldValue){
                return data;
            }
        })
        if (Vehicle.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            VehicleMaster.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'vehicleType'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    VehicleMaster.updateOne(
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
exports.deleteVehicle = (req, res, next)=>{
    VehicleMaster.deleteOne({_id: req.params.fieldID})
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



