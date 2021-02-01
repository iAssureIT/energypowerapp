const mongoose	        = require("mongoose");
const Maxchannelsmaster = require('./Model.js');


exports.insertmaxchannels = (req,res,next)=>{
    processData();
    async function processData(){
        var allMaxChannels = await fetchMaxChannels()
        var maxchannels = allMaxChannels.filter((data)=>{
        if (data.maxchannels == req.body.fieldValue) {
            return data;
        }
        })
        if (maxchannels.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const maxChannelsMaster = new Maxchannelsmaster({
                                _id                         : new mongoose.Types.ObjectId(),
                                maxchannels                 : req.body.fieldValue,
                                createdBy                   : req.body.createdBy,
                                createdAt                   : new Date()
                            })
                            maxChannelsMaster.save()
                            .then(data=>{
                                res.status(200).json({ created : true, fieldID : data._id });
                            })
                            .catch(err =>{
                                res.status(500).json({ error: err }); 
                            });
        }                    
     }                   
};

var fetchMaxChannels = async ()=>{
    return new Promise(function(resolve,reject){ 
    Maxchannelsmaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countmaxchannels = (req, res, next)=>{
    Maxchannelsmaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchmaxchannels = (req, res, next)=>{
    Maxchannelsmaster.find({})
        /*.sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)*/
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchSinglemaxchannels = (req, res, next)=>{
    Maxchannelsmaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchmaxchannels = (req, res, next)=>{
    Maxchannelsmaster.find({ fuelType: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updatemaxchannels = (req, res, next)=>{
    processData();
    async function processData(){
        var allMaxChannels = await fetchMaxChannels()
        var maxchannels = allMaxChannels.filter((data)=>{
        if (data.maxchannels == req.body.fieldValue) {
            return data;
        }
        })
        if (maxchannels.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            Maxchannelsmaster.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'maxchannels'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    Maxchannelsmaster.updateOne(
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
exports.deletemaxchannels = (req, res, next)=>{
    Maxchannelsmaster.deleteOne({_id: req.params.fieldID})
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



