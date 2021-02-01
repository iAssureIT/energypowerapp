const mongoose             = require("mongoose");
var   ObjectID             = require('mongodb').ObjectID;
const AddProject           = require('./Model.js');

exports.create_project = (req, res, next) => {
    console.log("inside comment");

    const addProject  = new AddProject({

            _id                       :  new mongoose.Types.ObjectId(), 
            client                    : req.body.client,
            projectName               : req.body.projectName, 
            createdAt                 : new Date(),     
        });
        
        addProject.save()
            .then(data=>{
                console.log("data--->",data);
                    res.status(200).json({
                                        message : "Project details inserted",
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
exports.list_project = (req,res,next)=>{
    AddProject.find()
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
exports.list_AllProject = (req,res,next)=>{
    AddProject.find()
    .select("projectName")
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

exports.fetch_oneproject = (req,res,next)=>{
    AddProject.findOne({"_id":req.params.client_Id})
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
exports.update_project = (req,res,next)=>{
    AddProject.updateOne(

                        { "_id":req.params.client_id},    
                        
                        {
                    $set:{
                         
                            "client"                : req.body.client,
                            "projectName"           : req.body.projectName, 
                         }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data){
                            res.status(200).json("PROJECT_DETAILS_UPDATED");
                        }else{
                            res.status(401).json("PROJECT_DETAILS_NOT_UPDATED");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}; 

exports.delete_project = (req,res,next)=>{
    AddProject.deleteOne({"_id":req.params.client_id})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount === 1){
                res.status(200).json("PROJECT_DELETED");
            }else{
                res.status(200).json("PROJECT_NOT_DELETED");
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