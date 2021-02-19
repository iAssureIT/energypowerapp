const mongoose  = require("mongoose");
const DesignationMaster = require('../../coreAdmin/designationMaster/ModelDesignationMaster.js');
const DepartmentMaster = require('../../coreAdmin/departmentMaster/ModelDepartmentMaster.js');
const EntityMaster = require('./ModelEntityMaster');
const PersonMaster = require('../personMaster/ModelPersonMaster.js');
const FailedRecords     = require('../../coreAdmin/failedRecords/ModelFailedRecords');
var   request = require('request-promise');
const gloabalVariable = require('../../nodemon.js');
var   ObjectID          = require('mongodb').ObjectID;
const User = require('../../coreAdmin/userManagement/ModelUsers.js');
const globalVariable= require("../../nodemon.js");
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');


exports.insertEntity = (req,res,next)=>{
    insertEntityFun();
    async function insertEntityFun(){
        var getnext = await getNextSequence(req.body.entityType,req.body.companyName)
        if(req.body.entityType == 'client')
            {
                var str = getnext;
            }else
            {
                var str = 1
            }

        EntityMaster.findOne({  
                            companyName               : req.body.companyName,
                            groupName                 : req.body.groupName,
                            companyEmail              : req.body.companyEmail, 
                            companyPhone              : req.body.companyPhone,
                            website                   : req.body.website   
                            })
        .exec()
        .then(data=>{
            if (data) {
                res.status(200).json({ duplicated : true });
            }else{
                const entity = new EntityMaster({
                    _id                       : new mongoose.Types.ObjectId(),
                    supplierOf                : req.body.supplierOf,
                    entityType                : req.body.entityType,
                    profileStatus             : req.body.profileStatus,
                    companyNo                 : getnext ? getnext : 1,
                    companyID                 : str ? str : 1, 
                    companyName               : req.body.companyName,
                    groupName                 : req.body.groupName,
                    CIN                       : req.body.CIN,   
                    COI                       : req.body.COI,
                    TAN                       : req.body.TAN,
                    companyLogo               : req.body.companyLogo,
                    website                   : req.body.website,
                    companyPhone              : req.body.companyPhone,
                    companyEmail              : req.body.companyEmail,
                    userID                    : req.body.userID,  
                    createdBy                 : req.body.createdBy,
                    createdAt                 : new Date()
                })
                entity.save()
                .then(data=>{
                    res.status(200).json({ created : true, entityID : data._id ,companyID : data.companyID});
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err }); 
        });
        
    }
    
};
function getNextSequence(entityType) {
    console.log("inside getNextSequence");
    return new Promise((resolve,reject)=>{
    EntityMaster.findOne({entityType:entityType})    
        .sort({companyNo : -1})   
        .exec()
        .then(data=>{
            console.log("data in sequence",data)
            if (data) { 
                var seq = data.companyNo;
                seq = seq+1;
                resolve(seq) 
            }else{
               resolve(1)
            }
            
        })
        .catch(err =>{
            reject(0)
        });
    });
}

exports.listEntity = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType}).sort({createdAt : -1})    
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.listSupplier = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType,supplierOf:req.params.company_id}).sort({createdAt : -1})    
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.countEntity = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType}).count()       
        .exec()
        .then(data=>{
            res.status(200).json({count: data});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.singleEntity = (req,res,next)=>{
    console.log("req.params.entityID==>",req.params.entityID);
    EntityMaster.findOne({_id : req.params.entityID})
    .exec()
    .then(data=>{
        main();
        async function main(){
            var k = 0 ;
            var returnData = [];
            if(data){
            if(data.contactPersons && data.contactPersons.length > 0){
                var contactData = [];
                for(k = 0 ; k < data.contactPersons.length ; k++){
                    contactData.push({
                        "_id"                    : data.contactPersons[k]._id,
                        branchCode               : data.contactPersons[k].branchCode,
                        branchName               : data.contactPersons[k].branchName,
                        firstName                : data.contactPersons[k].firstName,
                        workLocationId           : data.contactPersons[k].workLocationId,
                        addEmployee              : data.contactPersons[k].addEmployee,
                        personID                 : data.contactPersons[k].personID,
                        lastName                 : data.contactPersons[k].lastName,
                        departmentName           : data.contactPersons[k].departmentName,
                        designationName          : data.contactPersons[k].designationName,
                        phone                    : data.contactPersons[k].phone,
                        email                    : data.contactPersons[k].email,
                        employeeID               : data.contactPersons[k].employeeID,
                        role                     : data.contactPersons[k].role,
                        profilePhoto             : data.contactPersons[k].profilePhoto,
                        middleName               : data.contactPersons[k].middleName,
                        DOB                      : data.contactPersons[k].DOB,
                        altPhone                 : data.contactPersons[k].altPhone,
                        gender                   : data.contactPersons[k].gender,
                        whatsappNo               : data.contactPersons[k].whatsappNo,
                        department               : data.contactPersons[k].department,
                        empCategory              : data.contactPersons[k].empCategory,
                        empPriority              : data.contactPersons[k].empPriority,
                        designation              : data.contactPersons[k].designation,
                        address                  : data.contactPersons[k].address,
                        createUser               : data.contactPersons[k].createUser,

                    })
                }
                    
            }
            returnData.push({
                        "_id"                   : data._id,
                        departments             : data.departments,
                        supplierOf              : data.supplierOf,
                        companyID               : data.companyID,
                        companyName             : data.companyName,
                        companyPhone            : data.companyPhone,
                        companyEmail            : data.companyEmail,
                        locations               : data.locations,
                        entityType              : data.entityType,
                        profileStatus           : data.profileStatus,
                        groupName               : data.groupName,
                        CIN                     : data.CIN,   
                        COI                     : data.COI,
                        TAN                     : data.TAN,
                        companyLogo             : data.companyLogo,
                        website                 : data.website,
                        userID                  : data.userID,  
                        contactData             : contactData
                    })
            }//data
            res.status(200).json(returnData);
            
        }
        
        
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

function getManagerDetails(ID,companyID){
    // console.log('----------------------------ID,companyID-----------',ID,companyID)
   return new Promise(function(resolve,reject){
        PersonMaster.findOne({"employeeId" : ID,"companyID":companyID},{"firstName":1,middleName:1,lastName:1,contactNo:1,designation:1,department:1,employeeId:1})
             .populate('designationId')
             .populate('departmentId')
             .exec()
             .then(managerDetails=>{
                resolve(managerDetails);
             })
            .catch(err =>{
                res.status(500).json({
                    message : "manager not found.",
                    error: err
                   });
            });
    });
}
exports.getCompany = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.params.companyID})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.entityDetails = (req,res,next)=>{
    EntityMaster.findOne({"contactPersons.userID" : req.params.userID})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.fetchLocationEntities = (req, res, next)=>{
    EntityMaster.findOne({_id : req.body.entityID})
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
exports.fetchContactEntities = (req, res, next)=>{
    EntityMaster.findOne({_id : req.body.entityID})
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

exports.getWorkLocation = (req, res, next)=>{
    // console.log("body=>",req.body)
    var selector = {};
    if(req.body.company_id){
        selector = {'_id':ObjectID(req.body.company_id)}
    }else{
        selector = {"entityType":req.body.entityType} 
    }
    console.log("selector",selector);
    EntityMaster.aggregate([
        { $match :selector},
        { $unwind: "$locations" }
        ])
        .exec()
        .then(data=>{
            var locations = data.map((a, i)=>{
                return a.locations
             })   
            res.status(200).json({locations});
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.companyName = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.params.companyID},{companyName:1,companyLogo:1,groupName:1})
    .exec()
    .then(data=>{
        if(data){
            res.status(200).json(data);
        }else{
            res.status(200).json({message:"COMPANY_NOT_FOUND"})
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.companyNameType = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.params.companyID,entityType : req.params.type},{companyID:1,companyName:1})
    .exec()
    .then(data=>{
        if(data){
            res.status(200).json(data);
        }else{
            res.status(200).json({message:"COMPANY_NOT_FOUND"})
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.branchCodeLocation = (req,res,next)=>{
    EntityMaster.findOne({_id : req.params.entityID, 'locations.branchCode' : req.params.branchCode})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};
exports.updateEntity = (req,res,next)=>{
    EntityMaster.updateOne(
            { _id:req.body.entityID},  
            {
                $set:   { 
                            'companyName'               : req.body.companyName,
                            'groupName'                 : req.body.groupName,
                            'CIN'                       : req.body.CIN,   
                            'COI'                       : req.body.COI,
                            'TAN'                       : req.body.TAN,
                            'companyLogo'               : req.body.companyLogo,
                            'website'                   : req.body.website,
                            'companyPhone'              : req.body.companyPhone
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                EntityMaster.updateOne(
                { _id:req.body.entityID},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy 
                                            }] 
                            }
                } )
                .exec()
                .then(data=>{
                    res.status(200).json({ updated : true });
                })
            }else{
                res.status(200).json({ updated : false });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.updateProfileStatus = (req,res,next)=>{
    EntityMaster.updateOne(
            { _id:req.body.entityID},  
            {
                $set:   { 
                            'profileStatus':req.body.status
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                EntityMaster.updateOne(
                { _id:req.body.entityID},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy 
                                            }] 
                            }
                } )
                .exec()
                .then(data=>{
                    res.status(200).json({ updated : true });
                })
            }else{
                res.status(200).json({ updated : false });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.addLocation = (req,res,next)=>{
    var locationdetails = req.body.locationDetails;
    
    insertLocationdetails();
    async function insertLocationdetails() {
        // var data = await updateDocInLoc(req.body.entityID,locationdetails)
        // console.log('data====>',data)
         var getData = await fetchLocData(req.body.entityID,locationdetails);
        if (getData.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            if(locationdetails.GSTIN || locationdetails.PAN){
                var compare = await updateSameStateDocuments(req.body.entityID,locationdetails)
            }
            var getnext = await getNextBranchCode(req.body.entityID)
            locationdetails.branchCode = getnext;
            EntityMaster.updateOne(
                    { _id: ObjectID(req.body.entityID) },  
                    {
                        $push:  { 'locations' : locationdetails }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        res.status(200).json({ created : true });
                    }else{
                        res.status(401).json({ created : false });
                    }
                })
                .catch(err =>{
                    res.status(500).json({ error: err });
                });
        }
    }
};

function fetchLocData(entityID,locationdetails){
    return new Promise((resolve,reject)=>{
        EntityMaster.find(
        {_id: entityID,"locations.locationType":locationdetails.locationType, "locations.addressLine1": locationdetails.addressLine1},{ 'locations.$': 1 })
        .exec()
        .then(data=>{
            resolve(data)
        })
        .catch(err =>{
            reject(0)
        });
    })
}

function getNextBranchCode(entityID) {
    return new Promise((resolve,reject)=>{
    EntityMaster.findOne({"_id" : entityID }).sort({"locations.branchCode":-1})       
        .exec()
        .then(data=>{
            if (data.locations.length > 0 ) { 
                var seq = data.locations[data.locations.length - 1].branchCode;
                seq = seq+1;
                resolve(seq) 
            }else{
               resolve(1)
            }
            
        })
        .catch(err =>{
            reject(0)
        });
    });
}

function updateSameStateDocuments(entityID,locationdetails){
    return new Promise((resolve,reject)=>{
        EntityMaster.updateMany({"_id":entityID, "locations.state":locationdetails.state},
            {
                $set:   { 
                          'locations.$[].GSTIN'        : locationdetails.GSTIN,
                          'locations.$[].GSTDocument'  : locationdetails.GSTDocument,
                          'locations.$[].PAN'          : locationdetails.PAN,
                          'locations.$[].PANDocument'  : locationdetails.PANDocument
                        }
            },{ multi: true }
        )
        .exec()
        .then(data=>{
            resolve(data)
        })
        .catch(err =>{
            reject(0)
        });
    })
}

exports.updateDocInLoc= (req,res,next)=>{
    EntityMaster.find({"_id":req.body.entityID, "locations.state":req.body.state},{_id: 0, 'locations.$': 1})
    .exec()
    .then(data=>{
         console.log('results====>',JSON.stringify(data[0].locations[0].GSTIN)) 
         // EntityMaster.updateOne({"_id":entityID, "locations._id":})
//              const category = await Category.findOne({ _id:req.params.categoryId });
// const lastIndex: number = category.items.length - 1;

// console.log(category.items[lastIndex]);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}

exports.singleLocation = (req,res,next)=>{
    EntityMaster.find({"_id" : req.body.entityID, "locations._id":req.body.locationID },
        {"locations.$" : 1})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};
exports.updateSingleLocation = (req,res,next)=>{
    // console.log("req.body",req.body);
    var locationdetails = req.body.locationDetails;
    insertLocationdetails();
    async function insertLocationdetails() {
    // var getData = await fetchLocData(req.body.entityID,locationdetails);
    //     if (getData.length > 0) {
    //         res.status(200).json({ duplicated : true });
    //     }else{
            if(locationdetails.GSTIN || locationdetails.PAN){
                var compare = await updateSameStateDocuments(req.body.entityID,locationdetails)
            }
    
           EntityMaster.updateOne(
                { "_id":req.body.entityID, "locations._id": req.body.locationID},  
                {
                    $set:   { 'locations.$.locationType' : locationdetails.locationType,
                              'locations.$.branchCode'   : locationdetails.branchCode,
                              'locations.$.department'   : locationdetails.department,
                              'locations.$.addressLine1' : locationdetails.addressLine1,
                              'locations.$.addressLine2' : locationdetails.addressLine2,
                              'locations.$.countryCode'  : locationdetails.countryCode,
                              'locations.$.country'      : locationdetails.country,
                              'locations.$.stateCode'    : locationdetails.stateCode,
                              'locations.$.state'        : locationdetails.state,
                              'locations.$.district'     : locationdetails.district,
                              'locations.$.city'         : locationdetails.city,
                              'locations.$.area'         : locationdetails.area,
                              'locations.$.pincode'      : locationdetails.pincode,
                              'locations.$.latitude'     : locationdetails.latitude,
                              'locations.$.longitude'    : locationdetails.longitude,
                              'locations.$.GSTIN'        : locationdetails.GSTIN,
                              'locations.$.GSTDocument'  : locationdetails.GSTDocument,
                              'locations.$.PAN'          : locationdetails.PAN,
                              'locations.$.PANDocument'  : locationdetails.PANDocument
                            }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({ updated : true });
                }else{
                    res.status(200).json({ updated : false });
                }
            })
            .catch(err =>{
                console.log("err",err);
                res.status(500).json({ error: err });
            });
        // }
    }
};

exports.addContact = (req,res,next)=>{
    var contactdetails = req.body.contactDetails;
    EntityMaster.find({"contactPersons.email": contactdetails.email,"contactPersons._id" : {$ne : req.body.entityID}})
    .then((datas)=>{
        if(datas.length > 0){
            res.status(200).json({ duplicated : true });
        }else{
            EntityMaster.updateOne(
                { _id:req.body.entityID},  
                {
                    $push:  { 'contactPersons' : contactdetails }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({ created : true });
                }else{
                    res.status(200).json({ created : false });
                }
            })
            .catch(err =>{
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            error: err
        });
    })
    
};
exports.singleContact = (req,res,next)=>{
    EntityMaster.findOne({"_id" : req.body.entityID, "contactPersons._id":req.body.contactID,"contactPersons.employeeID" : {$ne : req.body.employeeID}  },
        {"contactPersons.$" : 1})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

function camelCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

exports.getAllVendors = (req,res,next)=>{
    var city = req.params.city;
    var city1 = camelCase(city);
    var city2 = city.toUpperCase();
    var city3 = city.toLowerCase();
    EntityMaster.find({"entityType":"vendor","locations.city":{$in:
          [city,city1,city2,city3]}})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.getAdminCompany = (req,res,next)=>{
    EntityMaster.find({"entityType":"appCompany"})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.getAllEntities = (req,res,next)=>{
    EntityMaster.find({})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};


exports.updateSingleContact = (req,res,next)=>{
    var contactdetails = req.body.contactDetails;
    console.log('contactdetails', contactdetails, contactdetails.createUser);
    EntityMaster.find({"contactPersons.email": contactdetails.email, _id: { $ne: req.body.entityID}, "contactPersons._id" : {$ne : req.body.contactID},"contactPersons.employeeID" : {$ne : req.body.employeeID} })
    .then((datas)=>{
        if(datas.length > 0){
            res.status(200).json({ duplicated : true });
        }else{
            EntityMaster.updateOne(
            { "_id":req.body.entityID, "contactPersons._id": req.body.contactID},  
            {
                $set:   { 'contactPersons.$.branchCode'         : contactdetails.branchCode,
                          'contactPersons.$.branchName'         : contactdetails.branchName,
                          'contactPersons.$.profilePhoto'       : contactdetails.profilePhoto,
                          'contactPersons.$.firstName'          : contactdetails.firstName,
                          'contactPersons.$.middleName'         : contactdetails.middleName,
                          'contactPersons.$.lastName'           : contactdetails.lastName,
                          'contactPersons.$.DOB'                : contactdetails.DOB,
                          'contactPersons.$.employeeID'         : contactdetails.employeeID,
                          'contactPersons.$.phone'              : contactdetails.phone,
                          'contactPersons.$.altPhone'           : contactdetails.altPhone,
                          'contactPersons.$.whatsappNo'         : contactdetails.whatsappNo,
                          'contactPersons.$.email'              : contactdetails.email,
                          'contactPersons.$.gender'             : contactdetails.gender,
                          'contactPersons.$.department'         : contactdetails.department,
                          'contactPersons.$.empCategory'        : contactdetails.empCategory,
                          'contactPersons.$.empPriority'        : contactdetails.empPriority,
                          'contactPersons.$.designationName'    : contactdetails.designationName,
                          'contactPersons.$.designation'        : contactdetails.designation,
                          'contactPersons.$.departmentName'     : contactdetails.departmentName,
                          'contactPersons.$.address'            : contactdetails.address,
                          'contactPersons.$.role'               : contactdetails.role,
                          'contactPersons.$.createUser'         : contactdetails.createUser,

                        }
            }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({ updated : true });
                }else{
                    res.status(200).json({ updated : false });
                }
            })
            .catch(err =>{
                res.status(500).json({ error: err });
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            error: err
        });
    })
};

exports.deleteEntity = (req,res,next)=>{
    EntityMaster.deleteOne({_id:req.params.entityID})
    .exec()
    .then(data=>{
        res.status(200).json({ deleted : true });
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};


exports.deleteLocation = (req,res,next)=>{   
    EntityMaster.updateOne(
            { "locations._id":req.params.locationID},  
            {
                $pull: { 'locations' : {_id:req.params.locationID}}
            }
        )
        .exec()
        .then(data=>{
            console.log("data",data);
            if(data.nModified === 1){
                res.status(200).json({ deleted : true });
            }else{
                res.status(401).json({ deleted : false });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.deleteContact = (req,res,next)=>{   
    EntityMaster.updateOne(
            { "contactPersons._id":req.params.contactID},  
            {
                $pull: { 'contactPersons' : {_id:req.params.contactID}}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({ deleted : true });
            }else{
                res.status(200).json({ deleted : false });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.filterEntities = (req,res,next)=>{
    // var selector = {
    //         "locations":{ $elemMatch: { stateCode : "MH" }}, 
    //         "locations":{ $elemMatch: { district : "Pune" }},
    //         "companyName" :  {$regex : "^i",$options: "i"} 
    //     };


    var selector = {}; 
    selector['$and']=[];

    selector["$and"].push({ entityType : { $regex : req.body.entityType,$options: "i"} })
    //selector.entityType = {$regex : req.body.entityType,$options: "i"}  
    if (req.body.stateCode) {
        selector["$and"].push({ locations : { $elemMatch: { stateCode : req.body.stateCode } }  })
        //selector.locations = { $elemMatch: { stateCode : req.body.stateCode } }     
    }
    if (req.body.district) {
        selector["$and"].push({ locations : { $elemMatch: { district : { $regex : req.body.district, $options: "i"} } }  })
    }
    if (req.body.initial && req.body.initial != 'All') {
        //selector.companyName = {$regex : "^"+req.body.initial,$options: "i"} 
        selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
    }
    if (req.body.searchStr && req.body.searchStr != '') {
        selector['$or']=[];
        if (req.body.initial && req.body.initial != 'All') {
            selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
        }
        
        selector["$or"].push({ companyName : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ groupName   : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ locations   : { $elemMatch: { addressLine1 : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { area : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { district : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { stateCode : { $regex : req.body.searchStr, $options: "i"} } }  })
    }

    EntityMaster.find(selector)
    .sort({createdAt : -1})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};
exports.filterEntities_grid = (req,res,next)=>{
    
    var selector = {}; 
    selector['$and']=[];

    selector["$and"].push({ entityType : { $regex : req.body.entityType,$options: "i"} })
    if (req.body.stateCode) {
        selector["$and"].push({ locations : { $elemMatch: { stateCode : req.body.stateCode } }  })
    }
    if (req.body.district) {
        selector["$and"].push({ locations : { $elemMatch: { district : { $regex : req.body.district, $options: "i"} } }  })
    }
    if (req.body.initial && req.body.initial != 'All') {
        selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
    }
    if (req.body.searchStr && req.body.searchStr != '') {
        selector['$or']=[];
        if (req.body.initial && req.body.initial != 'All') {
            selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
        }
        
        selector["$or"].push({ companyName : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ groupName   : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ locations   : { $elemMatch: { addressLine1 : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { area : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { district : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { stateCode : { $regex : req.body.searchStr, $options: "i"} } }  })
    }

    EntityMaster.find(selector)
    .sort({createdAt : -1})
    .skip(req.body.startRange)
    .limit(req.body.limitRange)
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.fetchEntities = (req, res, next)=>{
    EntityMaster.find({entityType:req.body.type})
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
exports.CompanyfromEntities = (req, res, next)=>{
    EntityMaster.find({})
        .sort({createdAt : -1})
        .select("companyName")
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};


exports.addDepartment = (req,res,next)=>{
    console.log("req.body",req.body);
    var {departmentName,projectName}= req.body.departmentDetails
    EntityMaster.findOne({_id:req.body.entityID,"departments":{$elemMatch: { departmentName :departmentName,projectName:projectName} }})
    .then(department=>{
        if(department){
            res.status(200).json({ duplicate : true });
        }else{
            EntityMaster.updateOne(
                { _id:req.body.entityID},  
                {
                    $push:  { 'departments' : req.body.departmentDetails }
                })
                .exec()
                .then(data=>{
                    console.log("data",data);
                    if(data.nModified == 1){
                        res.status(200).json({ created : true });
                    }else{
                        res.status(200).json({ created : false });
                    }
                })
            .catch(err =>{
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch(err =>{
        console.log("err",err)
        res.status(500).json({
            error: err
        });
    });
};

exports.deleteDepartmentDetails = (req,res,next)=>{   
    EntityMaster.updateOne(
        {"departments._id":req.params.department_id},  
            {
                $pull: { 'departments' : {_id:req.params.department_id}}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({ deleted : true });
            }else{
                res.status(401).json({ deleted : false });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};
exports.updateDepartmentDetails = (req,res,next)=>{ 
    console.log("req.body",req.body)  
    EntityMaster.updateOne(
        {"departments._id":req.body.department_id},  
        {
            "$set": { 
                'departments.$.departmentName':req.body.departmentName,
                'departments.$.projectName':req.body.projectName
            }
        })
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({ updated : true });
            }else{
                res.status(401).json({ updated : false });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.countContacts = (req,res,next)=>{
    EntityMaster.aggregate([
        { "$match": { entityType:req.params.entityType } },
        {
          $group: {
            _id: "$entityType",
            total: { $sum: { $size: "$contactPersons"} }
          }
        }
    ])
    .exec()
    .then(data=>{
        if(data[0]){
            var count = data[0].total
        }else{
            var count = 0
        }

            res.status(200).json({count:count});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.countProjects = (req,res,next)=>{
    EntityMaster.aggregate([
        { "$match": { entityType:req.params.entityType } },
        {
          $group: {
            _id: "$entityType",
            total: { $sum: { $size: "$departments"} }
          }
        }
    ])
    .exec()
    .then(data=>{
        if(data[0]){
            var count = data[0].total
        }else{
            var count = 0
        }

            res.status(200).json({count:count});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.filedetails = (req,res,next)=>{
    // console.log('req------',req,'res',res);
    var finaldata = {};
    console.log(req.params.fileName)
    EntityMaster.find({ fileName:req.params.fileName  }
    )
    .exec()
    .then(data=>{
        console.log("file data",data);
        // finaldata.push({goodrecords: data})
        finaldata.goodrecords = data;
        FailedRecords.find({fileName:req.params.fileName})  
            .exec()
            .then(badData=>{
                finaldata.failedRecords = badData[0].failedRecords
                finaldata.totalRecords = badData[0].totalRecords
                res.status(200).json(finaldata);
            })
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


function insertDepartment(department, createdBy) {
    console.log("department in insert",department);
    return new Promise(function (resolve, reject) {
        /*if(department != null){*/

        const departmentMaster = new DepartmentMaster({
            _id: new mongoose.Types.ObjectId(),
            department: department,
            companyID: 1,
            createdBy: createdBy,
            createdAt: new Date()
        })

        departmentMaster.save()
            .then(data => {
                console.log("data to save",data);
                resolve(data.department);
            })

            .catch(err => {
                reject(err);
            });
        /* }   
*/    });

}
function insertDesignation(designation, createdBy) {
     console.log("designation in insert",designation);
    return new Promise(function (resolve, reject) {
        const designationMaster = new DesignationMaster({
            _id: new mongoose.Types.ObjectId(),
            designation: designation,
            companyID : 1,
            createdBy: createdBy,
            createdAt: new Date()
        })
        designationMaster.save()
            .then(data => {
                 console.log("data to save",data);
                resolve(data.designation);
            })
            .catch(err => {
                reject(err);
            });
    });
}

var fetchAllEntities = async (type) => {
    return new Promise(function (resolve, reject) {
        EntityMaster.find({entityType:type})
            .sort({ createdAt: -1 })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
var fetchAllEntities1 = async (projectName,departmentName) => {
    return new Promise(function (resolve, reject) {
        EntityMaster.find({departmentName:departmentName,projectName:projectName})
            .sort({ createdAt: -1 })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
var fetchDepartments = async () => {
    return new Promise(function (resolve, reject) {
        DepartmentMaster.find({})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
var fetchDesignations = async () => {
    return new Promise(function (resolve, reject) {
        DesignationMaster.find({})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
function createUser(userDetails){
       console.log("userDetails in create user",userDetails);
        return new Promise(function(resolve, reject){
            console.log("userDetails---",userDetails);
            axios.post('http://localhost:'+globalVariable.port+'/api/auth/post/signup/user', userDetails)
            .then((response)=>{    
            console.log("user response",response.data);         
                resolve(response.data.ID);
                if(response.data.message === 'USER_CREATED'){
                    //swal(response.data.message);
                }else{
                    swal(response.data.message);
                }
                
            })
            .catch((error)=>{})
        })
    }
  function  savePerson (userID,userDetails,personDetails,entityTypeP,worklocation){
        console.log("userID",userID);
        console.log("userDetails in person",userDetails,);
        // console.log("personDetails in saveperson",personDetails);
        if(userID){
           var formvalues = {
                type                    : entityTypeP,
                companyID               : userDetails.companyID,
                profileStatus           : "New",
                companyName             : userDetails.companyName,
                firstName               : userDetails.firstname,
                lastName                : userDetails.lastname,
                contactNo               : userDetails.mobNumber,
                altContactNo            : personDetails.altPhone,
                email                   : personDetails.email,
                entityType              : entityTypeP,
                employeeId              : personDetails.employeeID,
                workLocation            : worklocation,
                userId                  : userID,
                status                  : "Active",
            }
             if(personDetails.department)
            {
                userDetails.department  = personDetails.department;
                userDetails.designation = personDetails.designation;
            

            }
            console.log("formvalues---",formvalues);
          return new Promise(function(resolve, reject){
             axios.post('http://localhost:'+globalVariable.port+'/api/personmaster/post',formvalues)
            .then((response) => {
                resolve(response.data.PersonId);
            })
            .catch((error) => {})
          })
        }
    }  

  function getLatLong(address){
       return new Promise(function(resolve, reject){
            var type='GOOGLE';         
            axios.get('http://localhost:'+globalVariable.port+'/api/projectsettings/get/'+type)
            .then((response)=>{        
             const options = {

                    provider: 'google',
                    httpAdapter: 'https', // Default
                    apiKey:response.data.googleapikey, // for Mapquest, OpenCage, Google Premier
                    formatter: null     
                 
                };
                const geocoder = NodeGeocoder(options);
                // console.log("geocoder",geocoder);

                geocoder.geocode('address', function(err, res) {
                  resolve(res)
                });
                

            })
            .catch((error)=>{})
        })
                // const res = await geocoder.geocode('29 champs elysée paris');
                 
         
    }   

function fetchDeptAndProject(DeptAndProject){
      return new Promise(function(resolve, reject){
            console.log("DeptAndProject---",DeptAndProject);
            axios.patch('http://localhost:'+globalVariable.port+'/patch/addDepartment', DeptAndProject)
            .then((response)=>{    
            console.log("user response",response.data);         
                resolve(response.data.ID);
                if(response.data.message === 'DEPARTMENT_ADDED'){
                    //swal(response.data.message);
                }else{
                    swal(response.data.message);
                }
                
            })
            .catch((error)=>{})
        })
};
var fetchAllUsers = async (email) => {
    return new Promise(function (resolve, reject) {
        User.findOne({username:email})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
var fetchAllPersons = async (email) => {
    return new Promise(function (resolve, reject) {
        PersonMaster.findOne({username:email})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};



/*exports.bulkUploadEntity = (req, res, next) => {
    var entity = req.body.data;
     // console.log("entity new",entity);
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = '';
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    processData();
    async function processData() {
        var departments  = await fetchDepartments();
        var designations = await fetchDesignations(entity[k].designation);

         for (var k = 0; k < entity.length; k++) {
             if (entity[k].entityType == '-') {
                remark += "entityType not found, ";
            }
            if (entity[k].companyName == '-') {
                remark += "companyName not found, ";
            }
            if (entity[k].groupName == '-') {
                remark += "groupName not found, ";
            }
            if (entity[k].companyEmail == '-') {
                remark += "companyEmail not found, ";
            }
            if (entity[k].departmentName == '-') {
                remark += "departmentName not found, ";
            }
            if (entity[k].projectName == '-') {
                remark += "projectName not found, ";
            }

         }

    }

}*/


exports.bulkUploadEntity = (req, res, next) => {
    var entity = req.body.data;
    console.log("entity...",entity);
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = '';
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    processData();
    async function processData() {

        var departments = await fetchDepartments();
        // console.log("departments",departments);
        var designations = await fetchDesignations();

      for (var k = 0; k < entity.length; k++) {

        if (entity[k].entityType == '-') {
            remark += "entityType not found, ";
        }
        if (entity[k].companyName == '-') {
            remark += "companyName not found, ";
        }
        if (entity[k].groupName == '-') {
            remark += "groupName not found, ";
        }
        if (entity[k].companyEmail == '-') {
            remark += "companyEmail not found, ";
        }
        if (entity[k].departmentName == '-') {
            remark += "departmentName not found, ";
        }
        if (entity[k].projectName == '-') {
            remark += "projectName not found, ";
        }
        if (entity[k].countryCode == '-') {
            remark += "CountryCode not found, ";
        }

         EntityMaster.findOne({  
                        companyName               : entity[k].companyName,
                        groupName                 : entity[k].groupName,
                        companyEmail              : entity[k].companyEmail, 
                        companyPhone              : entity[k].companyPhone,
                        website                   : entity[k].website   
                        })

                  .exec()
            .then(data=>{
                 if (data) {
                    remark += "Client Already Exists"
                 }

            })
             .catch(err =>{
                res.status(500).json({ error: err }); 
            });

    if (remark == '') {
        var departmentId,designationId;
         var departmentExists = departments.filter((data) => {
            if (data.department == entity[k].department) {
                return data;
            }
           
        })
        if (departmentExists.length > 0) {
            departmentId = departmentExists[0].department;
            
        } else {
            if(entity[k].department != '-'){
            departmentId = await insertDepartment(entity[k].department,req.body.reqdata.createdBy);
           }
          }

         // console.log("departmentId------>>>",departmentId); 
        
        var designationExists = designations.filter((data) => {
            if (data.designation == entity[k].designation) {
                return data;
            }
           
        })
        if (designationExists.length > 0) {
            designationId = designationExists[0].designation;
            
        } else {
            if(entity[k].designation != '-'){
            designationId = await insertDesignation(entity[k].designation,req.body.reqdata.createdBy);
           }
          }
        
         var alldeptProjects = await fetchAllEntities1(entity[k].departmentName,entity[k].projectName);
           if(!alldeptProjects){
            var DeptAndProject={
                departmentName:entity[k].departmentName,
                projectName:entity[k].projectName,

            }
             if (DeptAndProject.departmentName!== null)
                 {
                  var insertUser1=await fetchDeptAndProject (DeptAndProject);
                 }
           }


        var allEntities = await fetchAllEntities(entity[k].entityType);
        var employeeExists = allEntities.filter((data) => {
            if (data.entityType == entity[k].entityType
                && data.companyName == entity[k].companyName
                && data.companyEmail == entity[k].companyEmail) {
                return data;
            }
        })
        validObjects.fileName       = req.body.fileName;
        if (employeeExists.length == 0) {   
         
             var latlong = await getLatLong(entity[k].address1Line1); 
             var lat=latlong[0].latitude;
             var lng=latlong[0].longitude;


             var latlong1 = await getLatLong(entity[k].address2Line1); 
             var lat1=latlong1[0].latitude;
             var lng1=latlong1[0].longitude;

             var latlong2 = await getLatLong(entity[k].address3Line1); 
             var lat2=latlong2[0].latitude;
             var lng2=latlong2[0].longitude;



             var dept_project=entity[k].departmentName+" - "+entity[k].projectName; 
                         
             var entityDept=
                        [
                             {
                               departmentName:entity[k].departmentName,
                               projectName:entity[k].projectName,
                                
                             }
                        ]

             var  locations =[

                       {
                            locationType        : entity[k].Location1Type,
                            addressLine1        : entity[k].address1Line1,
                            addressLine2        : entity[k].address1Line2 + "," + entity[k].district1 + "," + entity[k].state1 + "," + entity[k].country1 ,
                            department          : dept_project,
                            countryCode         : entity[k].countryCode,
                            country             : entity[k].country1,
                            // stateCode           : entity[k].countryCod,
                            state               : entity[k].state1,
                            district            : entity[k].district1,
                            city                : entity[k].city1,
                            area                : entity[k].area1,
                            pincode             : entity[k].pincode1,
                            latitude            : lat,
                            longitude           : lng,
                            
                         },

                        {
                                locationType        : entity[k].Location2Type != '-'  ?  entity[k].Location2Type : 'null',
                                addressLine1        : entity[k].address2Line1 != '-'  ?  entity[k].address2Line1 : 'null',
                                addressLine2        : entity[k].address2Line2 != '-'  ?  entity[k].address2Line2 : 'null',
                                department          : dept_project,
                                state               : entity[k].state1,
                                district            : entity[k].district2,
                                city                : entity[k].city2,
                                area                : entity[k].area2,
                                pincode             : entity[k].pincode2,
                                latitude            : lat1,
                                longitude           : lng1,
                                
                        },
                        {
                                locationType        : entity[k].Location3Type != '-'  ? entity[k].Location3Type : 'null',
                                addressLine1        : entity[k].address3Line1 != '-'  ? entity[k].address3Line1 : 'null',
                                addressLine2        : entity[k].address3Line2 != '-'  ? entity[k].address3Line2 : 'null',
                                department          : dept_project,
                                state               : entity[k].state2,
                                district            : entity[k].district2,
                                city                : entity[k].city2,
                                area                : entity[k].area2,
                                pincode             : entity[k].pincode2,
                                latitude            : lat2,
                                longitude           : lng2,
                                
                       }
                     ]
                 let locationdetails = [];
                    for( var a=0; a<locations.length; a++){
                        if((locations[a].locationType != 'null' || locations[a].addressLine1 != 'null' || locations[a].addressLine2 != 'null' ))
                          {
                           
                            locationdetails.push(locations[a]);
                                
                            }
                        }  
                     
                       
                        var getnext = await getNextSequence(entity[k].entityType,entity[k].companyName);
                        if(entity[k].entityType == 'client')
                            {
                                var str = getnext;
                            }else
                            {
                                var str = 1
                            }

                       var validDcompanyNo  = getnext ? getnext : 1;
                       var validDcompanyID  = str ? str : 1;
               
                 var createLogin1 = entity[k].loginCredential;
                 // console.log("createLogin1>>>>>>>>>",createLogin1);
                 if(createLogin1 == 'No'){
                    createLogin1=false;
                 }else{
                     createLogin1=true;
                 }  
                          
                     
               var contactPersons      =[

                                            {                                         

                                                branchName                : entity[k].address1Line1,
                                                firstName                 : entity[k].firstName,
                                                lastName                  : entity[k].lastName,
                                                phone                     : entity[k].countryCode + "" + entity[k].phone,
                                                altPhone                  : entity[k].countryCode + "" + entity[k].altPhone,
                                                email                     : entity[k].email,
                                                departmentName            : departmentId,
                                                designationName           : designationId,
                                                employeeID                : entity[k].employeeID,
                                                role                      : entity[k].role,
                                                branchCode                : validDcompanyID,
                                                createUser                : createLogin1,
               
                                            }
                                          
                                       ]
                                                     
            let contactdetails = [];
                for( var a=0; a<contactPersons.length; a++){
                    if((contactPersons[a].branchName != null || contactPersons[a].firstName != null || 
                       contactPersons[a].phone != null || contactPersons[a].altPhone != null || contactPersons[a].email != null ||
                         contactPersons[a].department != null || contactPersons[a].designation != null || contactPersons[a].employeeID != null ))
                        
                        {

                     

                        contactdetails.push(contactPersons[a]);
                     
                         // console.log("contactdetails----s",contactdetails);
                            
                        }
                    } 


                  
         var users1 = await fetchAllUsers(entity[k].email);
         // console.log("users1----",users1);
         
          if(!users1 )
          {
             var userDetails = {

                firstname               : entity[k].firstName != '-'  ? entity[k].firstName : null,
                lastname                : entity[k].lastName != '-'   ? entity[k].lastName : null,
                mobNumber               : entity[k].phone != '-'      ? entity[k].phone : null,
                email                   : entity[k].email != '-'      ? entity[k].email : null,
                companyID               : validData.companyID,
                companyName             : entity[k].companyName != '-' ? entity[k].companyName : null,
                designation             : entity[k].designation != '-' ? entity[k].designation : null,
                department              : entity[k].department != '-'  ? entity[k].department1 : null,
                pwd                     : "welcome123",
                role                    : [  entity[k].role != '-'  ? entity[k].role : null],
                status                  : 'blocked',
                "emailSubject"          : "Email Verification",
                "emailContent"          : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
            }
             if( (userDetails.firstName!== null))
                 {
                  var insertUser1=await createUser(userDetails);
                 }
                  var userID1=await createUser(userDetails);;
                  let Personcontactdetails = [];
                  var person1 = await fetchAllPersons(entity[k].email);
                   if (!person1){
                   var personDetails= {

                            branchName                : entity[k].address1Line1,
                            firstName                 : entity[k].firstName,
                            lastName                  : entity[k].lastName,
                            phone                     : entity[k].phone,
                            altPhone                  : entity[k].altPhone,
                            email                     : entity[k].email,
                            department                : entity[k].department,
                            designation               : entity[k].designation,
                            employeeID                : entity[k].employeeID,
                            role                      : entity[k].role,
                            createUser                : createLogin1,

                          }
                        } 

                        console.log("personDetails>>>>",personDetails);

                          var worklocation=entity[k].address1Line1;
                          var entityTypeP=entity[k].entityType;
                          var personData=await savePerson(userID1,userDetails,personDetails,entityTypeP,);
          
               
                        }
                      
                        validObjects = {

                            fileName                  : req.body.fileName,   
                            entityType                : entity[k].entityType,
                            companyName               : entity[k].companyName,
                            groupName                 : entity[k].groupName,
                            CIN                       : entity[k].CIN,   
                            COI                       : entity[k].COI,
                            TAN                       : entity[k].TAN,
                            website                   : entity[k].website,
                            companyPhone              : entity[k].companyPhone,
                            companyEmail              : entity[k].companyEmail,
                            country                   : entity[k].country,
                            locations                 : locationdetails,
                            contactPersons            : contactdetails,
                            departments               : entityDept,
                            companyNo                 : getnext ? getnext : 1,
                            companyID                 : str ? str : 1,   
                           
                       }

                      validData.push(validObjects);
                       const entity1 = new EntityMaster({
                                          _id                     : new mongoose.Types.ObjectId(),
                                        fileName                  : req.body.fileName,   
                                        entityType                : entity[k].entityType,
                                        companyName               : entity[k].companyName,
                                        groupName                 : entity[k].groupName,
                                        CIN                       : entity[k].CIN,   
                                        COI                       : entity[k].COI,
                                        companyPhone              : entity[k].countryCode + "" + entity[k].companyPhone,
                                        TAN                       : entity[k].TAN,
                                        website                   : entity[k].website,
                                        // companyPhone              : entity[k].companyPhone,
                                        companyEmail              : entity[k].companyEmail,
                                        country                   : entity[k].country,
                                        locations                 : locationdetails,
                                        contactPersons            : contactdetails,
                                        departments               : entityDept,
                                        companyNo                 : getnext ? getnext : 1,
                                        companyID                 : str ? str : 1,   


                                     })
                       // console.log("entity1entity1",entity1.companyPhone);
                                      entity1.save()
                                        .then(data=>{
                                            console.log("data to save",data)
                                                // res.status(200).json({ created : true, entityID : data._id ,companyID : data.companyID});
                                            })
                                        .catch(err => {
                                            console.log(err);
                                        });
                     


                            } else {

                                    remark += "data already exists.";

                                    invalidObjects = entity[k];
                                    invalidObjects.failedRemark = remark;
                                    invalidData.push(invalidObjects);
                                }

                            } else {

                              
                                invalidObjects = entity[k];
                                invalidObjects.failedRemark = remark;
                                invalidData.push(invalidObjects);
                            }
                            remark = '';
                        }


            /* EntityMaster.insertMany(validData)
                .then(data => {

                })
                .catch(err => {
                    console.log(err);
                });
            */
            failedRecords.FailedRecords = invalidData;
            failedRecords.fileName = req.body.fileName;
            failedRecords.totalRecords = req.body.totalRecords;

            await insertFailedRecords(failedRecords, req.body.updateBadData);

            res.status(200).json({
                "message": "Bulk upload process is completed successfully!",
                "completed": true
            });
         }
};

var insertFailedRecords = async (invalidData, updateBadData) => {
    //console.log('invalidData',invalidData);
    return new Promise(function (resolve, reject) {
        FailedRecords.find({ fileName: invalidData.fileName })
            .exec()
            .then(data => {
                if (data.length > 0) {
                    //console.log('data',data[0].failedRecords.length)   
                    if (data[0].failedRecords.length > 0) {
                        if (updateBadData) {
                            FailedRecords.updateOne({ fileName: invalidData.fileName },
                                { $set: { 'failedRecords': [] } })
                                .then(data => {
                                    if (data.nModified == 1) {
                                        FailedRecords.updateOne({ fileName: invalidData.fileName },
                                            {
                                                $set: { 'totalRecords': invalidData.totalRecords },
                                                $push: { 'failedRecords': invalidData.FailedRecords }
                                            })
                                            .then(data => {
                                                if (data.nModified == 1) {
                                                    resolve(data);
                                                } else {
                                                    resolve(data);
                                                }
                                            })
                                            .catch(err => { reject(err); });
                                    } else {
                                        resolve(0);
                                    }
                                })
                                .catch(err => { reject(err); });
                        } else {
                            FailedRecords.updateOne({ fileName: invalidData.fileName },
                                {
                                    $set: { 'totalRecords': invalidData.totalRecords },
                                    $push: { 'failedRecords': invalidData.FailedRecords }
                                })
                                .then(data => {
                                    if (data.nModified == 1) {
                                        resolve(data);
                                    } else {
                                        resolve(data);
                                    }
                                })
                                .catch(err => { reject(err); });
                        }

                    } else {
                        FailedRecords.updateOne({ fileName: invalidData.fileName },
                            {
                                $set: { 'totalRecords': invalidData.totalRecords },
                                $push: { 'failedRecords': invalidData.FailedRecords }
                            })
                            .then(data => {
                                if (data.nModified == 1) {
                                    resolve(data);
                                } else {
                                    resolve(data);
                                }
                            })
                            .catch(err => { reject(err); });
                    }
                } else {
                    const failedRecords = new FailedRecords({
                        _id: new mongoose.Types.ObjectId(),
                        failedRecords: invalidData.FailedRecords,
                        fileName: invalidData.fileName,
                        totalRecords: invalidData.totalRecords,
                        createdAt: new Date()
                    });

                    failedRecords
                        .save()
                        .then(data => {
                            resolve(data._id);
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        });
                }
            })

    })
}

