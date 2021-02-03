const mongoose          = require("mongoose");
var ObjectID            = require('mongodb').ObjectID;
const Equipmentlocation    = require('./Model.js');
const Projectlocation    = require('../projectLocation/Model.js');

exports.create_equipmentlocation = (req, res, next) => {
    console.log("inside comment");

    const equipmentlocation  = new Equipmentlocation({

            _id                       : new mongoose.Types.ObjectId(), 
            locationName              : req.body.locationName,
            projectLocationName       : req.body.projectLocationName,
            project_id                : req.body.project_id,
            equipmentSpecifications   : req.body.equipmentSpecifications,
            industry                  : req.body.industry,
            equipmentModel            : req.body.equipmentModel,
            actualPerformance         : req.body.actualPerformance,
            images                    : req.body.images,
            equipmentUrl              : req.body.equipmentUrl,
            address                   : req.body.address,
            createdAt                 : new Date(),     
        });
        
        equipmentlocation.save()
            .then(data=>{
                console.log("data--->",data);
                    res.status(200).json({
                                        message : "Equipment Location details inserted",
                                        ID      : data._id
                                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

                           
}; 
exports.list_equipmentLoc_with_filter = (req,res,next)=>{
    var selector = {};
    if(req.body.search!=="All"){
        selector['$or'] = [];
        selector["$or"].push({ projectLocationName: { $regex: req.body.search, $options: "i" } })
        selector["$or"].push({ locationName: { $regex: req.body.search, $options: "i" } })
    }


    Equipmentlocation.find(selector)
        .populate('project_id')
        .exec()
        .then(data=>{
            main();
            async function main(){
                var equipmentlocation_id = data.map(a=>a._id);
                var equipmentLocation = await getEquipmentLocation(req.body.search,equipmentlocation_id);
                // console.log("equipmentLocation",equipmentLocation);
                if(equipmentLocation.length > 0){
                    const newArray = [...data, ...equipmentLocation];
                    res.status(200).json(newArray);
                }else{
                     res.status(200).json(data);
                }
                
            }  
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
}; 

     


function getEquipmentLocation(text,equipmentlocation_id){
   return new Promise(function(resolve,reject){
        Projectlocation.find({clientName:{ $regex: text, $options: "i" }},{_id:1})
        .exec()
        .then(projectLocation=>{
            var selector = {};
            if(equipmentlocation_id.length > 0){
                selector = {_id:{$nin:equipmentlocation_id}}
            }
            Equipmentlocation.find(selector)
            .populate('project_id')
            .exec()
            .then(equipmentlocation=>{
                var returnArray = [];
                for (var i = 0; i < projectLocation.length; i++) {
                    for (var j = 0; j < equipmentlocation.length; j++) {
                        if(String(projectLocation[i]._id)===String(equipmentlocation[j].project_id._id)){
                            returnArray.push(equipmentlocation[j])
                        }
                    }
                }
                if(i >= projectLocation.length){
                    resolve(returnArray)
                }
            })
            .catch(err =>{
                console.log("err",err);
            });
            
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
    });
}


exports.list_equipmentLoc = (req,res,next)=>{
    Equipmentlocation.find({})
        .populate('project_id')
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
};

exports.list_using_project_id = (req,res,next)=>{
    Equipmentlocation.find({project_id:req.params.project_id})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log("err",err);
            res.status(500).json({
                error: err
            });
        });
};
exports.fetch_one = (req,res,next)=>{
    Equipmentlocation.findOne({"_id":req.params.fetchId})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('PAGE_NOT_FOUND');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};   
exports.update_equipmentLoc = (req,res,next)=>{
    Equipmentlocation.updateOne(

                        { "_id":req.params.equipment_id},    
                        
                        {
                            $set:{
                                locationName              : req.body.locationName,
                                projectLocationName     : req.body.projectLocationName,
                                project_id              : req.body.project_id,
                                equipmentSpecifications                : req.body.equipmentSpecifications,
                                industry               : req.body.industry,
                                actualPerformance          : req.body.actualPerformance,
                                equipmentModel               : req.body.equipmentModel,
                                images                    : req.body.images,
                                equipmentUrl                 : req.body.equipmentUrl,
                                address                   : req.body.address,
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data){
                            res.status(200).json("CAMERA_LOCATION_UPDATED");
                        }else{
                            res.status(401).json("CAMERA_LOCATION_NOT_UPDATED");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}; 

exports.delete_equipmentLoc = (req,res,next)=>{
    Equipmentlocation.deleteOne({"_id":req.params.equipment_id})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount === 1){
                res.status(200).json("CAMERA_LOCATION_DELETED");
            }else{
                res.status(200).json("CAMERA_LOCATION_NOT_DELETED");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete_all_equipmentLoc = (req,res,next)=>{
    Equipmentlocation.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All equipment locations deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.list_address = (req,res,next)=>{
    Equipmentlocation.aggregate([
      { $unwind : "$address" },
      { $project : { address : 1  } },
      { $unwind : "$_id" },
    ])
    .then(data=>{
        console.log("data",data);
            res.status(200).json(data);
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 

exports.list_location_name = (req,res,next)=>{
    Equipmentlocation.find({},{locationName:1})
    .then(data=>{
        console.log("data",data);
            res.status(200).json(data);
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 

exports.get_count = (req,res,next)=>{
    Equipmentlocation.find({}).count()
    .then(count=>{
            res.status(200).json({count});
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 