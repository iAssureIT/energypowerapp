const mongoose	        = require("mongoose");
const SocialMediaMaster    = require('./ModelSocialMediaMaster.js');
 

exports.insertSocialMedia = (req,res,next)=>{
    processData();
    async function processData(){
    var allSocialMedia = await fetchSocialMedia();
    var socialMedia = allSocialMedia.filter((data)=>{
        if (data.socialMedia.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (socialMedia.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            const socialMediaMaster = new SocialMediaMaster({
                            _id                         : new mongoose.Types.ObjectId(),
                            socialMedia                 : req.body.fieldValue,
                            iconUrl                     : req.body.iconUrl,    
                            createdBy                   : req.body.createdBy,
                            createdAt                   : new Date()
                        })
                        socialMediaMaster.save()
                        .then(data=>{
                            res.status(200).json({ created : true, fieldID : data._id });
                        })
                        .catch(err =>{
                            res.status(500).json({ error: err }); 
                        });
        }
    }
};
var fetchSocialMedia = async ()=>{
    return new Promise(function(resolve,reject){ 
    SocialMediaMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};
exports.countSocialMedia = (req, res, next)=>{
    SocialMediaMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchSocialMedia = (req, res, next)=>{
    SocialMediaMaster.find({})
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
exports.getSocialMedia = (req, res, next)=>{
    SocialMediaMaster.find({})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchSingleSocialMedia = (req, res, next)=>{
    SocialMediaMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
           res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchSocialMedia = (req, res, next)=>{
    SocialMediaMaster.find({ socialMedia: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
           res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateSocialMedia = (req, res, next)=>{
    SocialMediaMaster.updateOne(
            { _id:req.body.fieldID },  
            {
                $set:   {  'socialMedia'       : req.body.fieldValue,
                           'iconUrl'        : req.body.iconUrl
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                SocialMediaMaster.updateOne(
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
            res.status(500).json({ error: err });
        });
};
exports.deleteSocialMedia = (req, res, next)=>{
    SocialMediaMaster.deleteOne({_id: req.params.fieldID})
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



