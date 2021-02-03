const mongoose	        = require("mongoose");
const IndustryMaster      = require('./Model.js');


exports.insertIndustryMaster = (req,res,next)=>{
    processData();
    async function processData(){
        var allIndustryChannels = await fetchIndustry()
        var industry = allIndustryChannels.filter((data)=>{
        if (data.industry.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (industry.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const industryMaster = new IndustryMaster({
                                _id                         : new mongoose.Types.ObjectId(),
                                industry                       : req.body.fieldValue,
                                createdBy                   : req.body.createdBy,
                                createdAt                   : new Date()
                            })
                            industryMaster.save()
                            .then(data=>{
                                res.status(200).json({ created : true, fieldID : data._id });
                            })
                            .catch(err =>{
                                res.status(500).json({ error: err }); 
                                console.log("error---->",err);
                            });
        }                    
     }                 
};

var fetchIndustry = async ()=>{
    return new Promise(function(resolve,reject){ 
    IndustryMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countIndustryMaster = (req, res, next)=>{
    IndustryMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchIndustryMaster = (req, res, next)=>{
    IndustryMaster.find({})
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
exports.fetchSingleIndustryMaster = (req, res, next)=>{
    IndustryMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchIndustryMaster = (req, res, next)=>{
    IndustryMaster.find({ industry: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateIndustryMaster = (req, res, next)=>{
    processData();
    async function processData(){
        var allIndustryChannels = await fetchIndustry()
        var industry = allIndustryChannels.filter((data)=>{
        if (data.industry.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (industry.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            IndustryMaster.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'industry'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    IndustryMaster.updateOne(
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
exports.deleteIndustryMaster = (req, res, next)=>{
    IndustryMaster.deleteOne({_id: req.params.fieldID})
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



