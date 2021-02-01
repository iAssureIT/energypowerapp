const mongoose	        = require("mongoose");
const BrandsMaster      = require('./Model.js');


exports.insertBrandsMaster = (req,res,next)=>{
    processData();
    async function processData(){
        var allBrandChannels = await fetchBrands()
        var brand = allBrandChannels.filter((data)=>{
        if (data.brand.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (brand.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
                const brandsMaster = new BrandsMaster({
                                _id                         : new mongoose.Types.ObjectId(),
                                brand                       : req.body.fieldValue,
                                createdBy                   : req.body.createdBy,
                                createdAt                   : new Date()
                            })
                            brandsMaster.save()
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

var fetchBrands = async ()=>{
    return new Promise(function(resolve,reject){ 
    BrandsMaster.find({})
        .exec()
        .then(data=>{
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};

exports.countBrandsMaster = (req, res, next)=>{
    BrandsMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchBrandsMaster = (req, res, next)=>{
    BrandsMaster.find({})
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
exports.fetchSingleBrandsMaster = (req, res, next)=>{
    BrandsMaster.findOne({ _id: req.params.fieldID })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.searchBrandsMaster = (req, res, next)=>{
    BrandsMaster.find({ brand: { $regex : req.params.str ,$options: "i" }  })
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.updateBrandsMaster = (req, res, next)=>{
    processData();
    async function processData(){
        var allBrandChannels = await fetchBrands()
        var brand = allBrandChannels.filter((data)=>{
        if (data.brand.trim().toLowerCase() == req.body.fieldValue.trim().toLowerCase()) {
            return data;
        }
        })
        if (brand.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            BrandsMaster.updateOne(
                { _id:req.body.fieldID },  
                {
                    $set:   {  'brand'       : req.body.fieldValue  }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    BrandsMaster.updateOne(
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
exports.deleteBrandsMaster = (req, res, next)=>{
    BrandsMaster.deleteOne({_id: req.params.fieldID})
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



