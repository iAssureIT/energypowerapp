const mongoose             = require("mongoose");
var   ObjectID             = require('mongodb').ObjectID;
const AddSite              = require('./Model.js');

exports.create_site = (req, res, next) => {
    console.log("inside comment");

    const addSite  = new AddSite({

            _id                       :  new mongoose.Types.ObjectId(), 
            client                    : req.body.client,
            project                   : req.body.project, 
            sitename                  : req.body.sitename,
            lattitude                 : req.body.latitude,
            longitude                 : req.body.longitude,
            createdAt                 : new Date(),     
        });
        
        addSite.save()
            .then(data=>{
                console.log("data--->",data);
                    res.status(200).json({
                                        message : "SIte details inserted",
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
exports.list_Allsites = (req,res,next)=>{
    AddSite.find()
    .select("sitename")
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

exports.list_site = (req,res,next)=>{
    AddSite.find()
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
exports.fetch_onesite= (req,res,next)=>{
    AddSite.findOne({"_id":req.params.site_Id})
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
exports.update_site = (req,res,next)=>{
    AddSite.updateOne(

                        { "_id":req.params.site_id},    
                        
                        {
                    $set:{
                         
                            "client"                    : req.body.client,
                            "project"                   : req.body.project, 
                            "sitename"                  : req.body.sitename,
                            "latitude"                  : req.body.latitude,
                            "longitude"                 : req.body.longitude,
                            
                         }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data){
                            res.status(200).json("SITE_DETAILS_UPDATED");
                        }else{
                            res.status(401).json("SITE_DETAILS_NOT_UPDATED");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}; 

exports.delete_site = (req,res,next)=>{
    AddSite.deleteOne({"_id":req.params.site_id})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount === 1){
                res.status(200).json("SITE_DELETED");
            }else{
                res.status(200).json("SITE_NOT_DELETED");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
/*exports.delete_all_clients = (req,res,next)=>{
    AddClient.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All clients deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};*/