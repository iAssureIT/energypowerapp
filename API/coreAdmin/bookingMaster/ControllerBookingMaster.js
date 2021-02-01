const mongoose          = require("mongoose");
const FailedRecords     = require('../failedRecords/ModelFailedRecords');
const BookingMaster     = require('./ModelBookingMaster');
const PersonMaster      = require('../personMaster/ModelPersonMaster');
const User              = require('../userManagement/ModelUsers.js');
const EntityMaster      = require('../../sta/entityMaster/ModelEntityMaster.js');
var request             = require('request-promise');
var   ObjectId          = require('mongodb').ObjectID;
var moment              = require('moment');

exports.insertBooking = (req,res,next)=>{
    BookingMaster.find({})
    .sort({createdAt: -1})
    .exec()
    .then(data=>{
        if(data && data.length > 0){
          var bookingId = data[0].bookingId + 1;
        }else{
          var bookingId = 1;
        }
        const booking = new BookingMaster({
            _id                         : new mongoose.Types.ObjectId(),
            packageTypeId               : req.body.packageTypeId,
            packageId                   : req.body.packageId,
            contractId                  : req.body.contractId,
            bookingId                   : bookingId,
            tripType                    : req.body.tripType,
            pickupFrom                  : req.body.pickupFrom,
            from                        : req.body.from,
            to                          : req.body.to,
            pickupDate                  : req.body.pickupDate,
            pickupTime                  : req.body.pickupTime,
            returnDate                  : req.body.returnDate,
            returnTime                  : req.body.returnTime,   
            vehicleCategoryId           : req.body.vehicleCategoryId,
            vehicleID                   : req.body.vehicleID,
            employeeId                  : req.body.employeeId,
            employeeUserId              : req.body.employeeUserId,
            departmentId                : req.body.departmentId,
            corporateId                 : req.body.corporateId,
            managerId1                  : req.body.managerId1,
            managerId2                  : req.body.managerId2,
            managerId3                  : req.body.managerId3,
            managerID1                  : req.body.managerID1,
            managerID2                  : req.body.managerID2,
            managerID3                  : req.body.managerID3,
            approver1exist              : req.body.approver1exist,
            approver2exist              : req.body.approver2exist,
            approver3exist              : req.body.approver3exist,
            approvalRequired            : req.body.approvalRequired,
            estimatedCost               : req.body.estimatedCost,
            intermediateStops           : req.body.intermediateStops,
            specialInstruction          : req.body.specialInstruction,
            purposeOfTravel             : req.body.purposeOfTravel,
            purposeOfTravelOther        : req.body.purposeOfTravelOther,
            reasonForSelectingVehicle   : req.body.reasonForSelectingVehicle,
            status                      : req.body.status,
            statusValue                 : req.body.statusValue,
            createdBy                   : req.body.createdBy,
            createdAt                   : new Date()
        })
        booking.save()
        .then(data=>{
            res.status(200).json({ created : true, bookingId : data._id,data:data });
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
    })
    .catch(err =>{
        res.status(500).json({error:err})
    })  
        
       
};

exports.getAllBookings = (req, res, next)=>{
    BookingMaster.find({})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.getAllApprovalReqBookings = (req, res, next)=>{
    BookingMaster.aggregate([{ $match :{$or:
          [
            {"managerId1":ObjectId(req.params.managerId)},
            {"managerId2":ObjectId(req.params.managerId)},
            {"managerId3":ObjectId(req.params.managerId)}
          ]
        }},
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"categorymasters",
            localField: "vehicleCategoryId",
            foreignField: "_id",
            as:"category"
         }
    },
    { $match :{"approvalRequired" : "Yes"}},
    { $match :{"statusValue" :{$in:["New","Manager Approved","Manager Rejected","Cancelled By Vendor","Cancelled By User"]}}}
    ])

    // BookingMaster.find({"approvalRequired" : "Yes","statusValue" :{$in:["New","Approved","Rejected","Cancel By Vendor","Cancel By User"]},"managerId":req.params.managerId})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.getAdminfilterBookings = (req,res,next)=>{
    var selector = {}; 
    selector['$and']=[];

    if(req.body.selector.company_name && req.body.selector.company_name != "All"){
        selector["$and"].push({"corporateId": ObjectId(req.body.selector.company_name) })
    }else{
        selector["$and"].push({"corporateId": {$ne: ""} })
    }

    if(req.body.selector.originatingCity){
        selector["$and"].push({"from.city": req.body.selector.originatingCity })
    }
    if(req.body.selector.destinationCity){
        selector["$and"].push({"to.city": req.body.selector.destinationCity })
    }
    if(req.body.selector.vendor_name && req.body.selector.vendor_name != "All"){
        selector["$and"].push({"status.allocatedToVendor": ObjectId(req.body.selector.vendor_name) })
    }else{
        selector["$and"].push({"status.allocatedToVendor": {$ne: ""} })
    }
    if(req.body.selector.date){
        selector["$and"].push({"pickupDate": {$gte : new Date(req.body.selector.from), $lt : new Date(req.body.selector.to) } })
    }

    BookingMaster.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }}},
        {$match:{'statusValue' : { $in:req.body.status}}},
        {$match:selector},
        {$lookup:
        {
            from:"entitymasters",
            localField: "corporateId",
            foreignField: "_id",
            as:"company"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
        },
        {$lookup:
        {
            from:"departmentmasters",
            localField: "departmentId",
            foreignField: "_id",
            as:"department"
        }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId1",
            foreignField: "_id",
            as:"manager1"
        }
         },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId2",
            foreignField: "_id",
            as:"manager2"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId3",
            foreignField: "_id",
            as:"manager3"
         }
        },
        { "$lookup": {
        "from": "entitymasters",
        localField:"status.allocatedToVendor",
        foreignField:"_id",
        "as": "vendor"
        }}
    ])
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

exports.getcorporatefilterBookings = (req,res,next)=>{
    var selector = {}; 
    selector['$and']=[];

    
    if(req.body.selector.originatingCity){
        selector["$and"].push({"from.city": req.body.selector.originatingCity })
    }
    if(req.body.selector.destinationCity){
        selector["$and"].push({"to.city": req.body.selector.destinationCity })
    }
    if(req.body.selector.vendor_name && req.body.selector.vendor_name != "All"){
        selector["$and"].push({"status.allocatedToVendor": ObjectId(req.body.selector.vendor_name) })
    }else{
        selector["$and"].push({"status.allocatedToVendor": {$ne: ""} })
    }
    if(req.body.selector.date){
        selector["$and"].push({"pickupDate": {$gte : new Date(req.body.selector.from), $lt : new Date(req.body.selector.to) } })
    }

    BookingMaster.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }}},
        {$match:{'statusValue' : { $in:req.body.status}}},
        {$match:{'corporateId':ObjectId(req.body.company_id)}},
        {$match:selector},
        {$lookup:
        {
            from:"entitymasters",
            localField: "corporateId",
            foreignField: "_id",
            as:"company"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
        },
        {$lookup:
        {
            from:"departmentmasters",
            localField: "departmentId",
            foreignField: "_id",
            as:"department"
        }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId1",
            foreignField: "_id",
            as:"manager1"
        }
         },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId2",
            foreignField: "_id",
            as:"manager2"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId3",
            foreignField: "_id",
            as:"manager3"
         }
        },
        { "$lookup": {
        "from": "entitymasters",
        localField:"status.allocatedToVendor",
        foreignField:"_id",
        "as": "vendor"
        }}
    ])
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

exports.getAdminSearchBookings = (req,res,next)=>{
  PersonMaster.aggregate([
        {
            $match:
            {
                $or:
                    [
                        { "firstName": { $regex: req.body.str, $options: "i" } },
                        { middleName: { $regex: req.body.str, $options: "i" } },
                        { lastName: { $regex: req.body.str, $options: "i" } },
                        { employeeId: { $regex: req.body.str, $options: "i" } }
                    ]
            }
        },
    ])
    .exec()
    .then(data => {
        if(data){
            var personid = [];
            for(var i=0; i<data.length; i++){
                personid.push(data[i]._id)
            }//i
            BookingMaster.aggregate([
            {$match:{'createdAt':{$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }}},
            {$match:{'statusValue' : { $in:req.body.status}}},
            {$match:{'employeeId' : { $in:personid}}},
            {$lookup:
            {
                from:"entitymasters",
                localField: "corporateId",
                foreignField: "_id",
                as:"company"
             }
            },
            {$lookup:
            {
                from:"personmasters",
                localField: "employeeId",
                foreignField: "_id",
                as:"person"
             }
            },
            {$lookup:
            {
                from:"departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as:"department"
            }
            },
            {$lookup:
            {
                from:"personmasters",
                localField: "managerId1",
                foreignField: "_id",
                as:"manager1"
            }
             },
            {$lookup:
            {
                from:"personmasters",
                localField: "managerId2",
                foreignField: "_id",
                as:"manager2"
             }
            },
            {$lookup:
            {
                from:"personmasters",
                localField: "managerId3",
                foreignField: "_id",
                as:"manager3"
             }
            },
            { "$lookup": {
            "from": "entitymasters",
            localField:"status.allocatedToVendor",
            foreignField:"_id",
            "as": "vendor"
            }}
        ])
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
        }//data
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
    
};

exports.getcorporateSearchBookings = (req,res,next)=>{
  PersonMaster.aggregate([
        {
            $match:
            {
                $or:
                    [
                        { "firstName": { $regex: req.body.str, $options: "i" } },
                        { middleName: { $regex: req.body.str, $options: "i" } },
                        { lastName: { $regex: req.body.str, $options: "i" } },
                        { employeeId: { $regex: req.body.str, $options: "i" } }
                    ]
            }
        },
    ])
    .exec()
    .then(data => {
        if(data){
            var personid = [];
            for(var i=0; i<data.length; i++){
                personid.push(data[i]._id)
            }//i
            BookingMaster.aggregate([
            {$match:{'createdAt':{$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }}},
            {$match:{'statusValue' : { $in:req.body.status}}},
            {$match:{'corporateId':ObjectId(req.body.company_id)}},
            {$match:{'employeeId' : { $in:personid}}},
            {$lookup:
            {
                from:"entitymasters",
                localField: "corporateId",
                foreignField: "_id",
                as:"company"
             }
            },
            {$lookup:
            {
                from:"personmasters",
                localField: "employeeId",
                foreignField: "_id",
                as:"person"
             }
            },
            {$lookup:
            {
                from:"departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as:"department"
            }
            },
            {$lookup:
            {
                from:"personmasters",
                localField: "managerId1",
                foreignField: "_id",
                as:"manager1"
            }
             },
            {$lookup:
            {
                from:"personmasters",
                localField: "managerId2",
                foreignField: "_id",
                as:"manager2"
             }
            },
            {$lookup:
            {
                from:"personmasters",
                localField: "managerId3",
                foreignField: "_id",
                as:"manager3"
             }
            },
            { "$lookup": {
            "from": "entitymasters",
            localField:"status.allocatedToVendor",
            foreignField:"_id",
            "as": "vendor"
            }}
        ])
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
        }//data
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
    
};


exports.getAdminBookingList = (req,res,next)=>{
    BookingMaster.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }}},
        {$match:{'statusValue' : { $in:req.body.status}}},
        {$lookup:
        {
            from:"entitymasters",
            localField: "corporateId",
            foreignField: "_id",
            as:"company"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
        },
        {$lookup:
        {
            from:"departmentmasters",
            localField: "departmentId",
            foreignField: "_id",
            as:"department"
        }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId1",
            foreignField: "_id",
            as:"manager1"
        }
         },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId2",
            foreignField: "_id",
            as:"manager2"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId3",
            foreignField: "_id",
            as:"manager3"
         }
        },
        { "$lookup": {
        "from": "entitymasters",
        localField:"status.allocatedToVendor",
        foreignField:"_id",
        "as": "vendor"
        }}
    ])
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
},

exports.getcorporateBookingList = (req,res,next)=>{
    BookingMaster.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }}},
        {$match:{'statusValue' : { $in:req.body.status}}},
        {$match:{'corporateId':ObjectId(req.body.company_id)}},
        {$lookup:
        {
            from:"entitymasters",
            localField: "corporateId",
            foreignField: "_id",
            as:"company"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
        },
        {$lookup:
        {
            from:"departmentmasters",
            localField: "departmentId",
            foreignField: "_id",
            as:"department"
        }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId1",
            foreignField: "_id",
            as:"manager1"
        }
         },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId2",
            foreignField: "_id",
            as:"manager2"
         }
        },
        {$lookup:
        {
            from:"personmasters",
            localField: "managerId3",
            foreignField: "_id",
            as:"manager3"
         }
        },
        { "$lookup": {
        "from": "entitymasters",
        localField:"status.allocatedToVendor",
        foreignField:"_id",
        "as": "vendor"
        }}
    ])
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
},

exports.getStatistics = (req,res,next)=>{
   if(req.body.status == "" || req.body.status == "All"){
    BookingMaster.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.body.start), $lt : new Date(req.body.end) }}},
        {$count:"count"}
    ])
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
   }else{
    BookingMaster.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.body.start), $lt : new Date(req.body.end) }}},
        {$match:{"statusValue" :req.body.status}},
        {$count:"count"}
      ])
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
   } 
    
}

exports.getAllBookingsForManager = (req, res, next)=>{
     BookingMaster.aggregate([
        { $match :{$or:
          [
            {"managerId1":ObjectId(req.body.managerId)},
            {"managerId2":ObjectId(req.body.managerId)},
            {"managerId3":ObjectId(req.body.managerId)}
          ]
        }},
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"categorymasters",
            localField: "vehicleCategoryId",
            foreignField: "_id",
            as:"category"
         }
    },
    { $match :{"approvalRequired" : "Yes"}},
    { $match :{"statusValue" :{$in:req.body.status}}},
    ])
    // BookingMaster.find({"approvalRequired" : "Yes","statusValue" :req.body.status,"managerId":req.body.managerId})
        // .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.getAllApprovedBookings = (req, res, next)=>{
     BookingMaster.aggregate([
        { $match :{$or:
          [
            {"managerId1":ObjectId(req.params.managerId)},
            {"managerId2":ObjectId(req.params.managerId)},
            {"managerId3":ObjectId(req.params.managerId)}
          ]
        }},
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"categorymasters",
            localField: "vehicleCategoryId",
            foreignField: "_id",
            as:"category"
         }
    },
    { $match :{"approvalRequired" : "Yes"}},
    { $match :{$or:[{"status.value" :"Manager Approved"},{"status.value" :"Edited Manager Approved"}]}},
    {$sort: { "status.statusAt": -1 }},
    ])
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.getAllBookingsForAdmin = (req, res, next)=>{
     BookingMaster.aggregate([
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"categorymasters",
            localField: "vehicleCategoryId",
            foreignField: "_id",
            as:"category"
         }
    },
    // { $match :{"approvalRequired" : "Yes"}},
    ])
    // BookingMaster.find({"approvalRequired" : "Yes","statusValue" :req.body.status,"managerId":req.body.managerId})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};
exports.getAllBookingsForAdmin_ByStatus = (req, res, next)=>{
     BookingMaster.aggregate([
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"categorymasters",
            localField: "vehicleCategoryId",
            foreignField: "_id",
            as:"category"
         }
    },
    { $match :{"statusValue" :req.params.status}},
    // { $match :{"approvalRequired" : "Yes"}},
    ])
    // BookingMaster.find({"approvalRequired" : "Yes","statusValue" :req.body.status,"managerId":req.body.managerId})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.countBookings = (req,res,next)=>{
    // BookingMaster.find({createdBy: req.params.createdBy}).count()
    BookingMaster.find({ $or: [ { "createdBy": req.params.createdBy }, { "employeeUserId": req.params.createdBy } ] }).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data } );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.countAllBookings = (req,res,next)=>{
    BookingMaster.find({}).count()
        .exec()
        .then(data=>{
            res.status(200).json({ count : data } );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.getBookings_User = (req,res,next)=>{
    // BookingMaster.find({createdBy: req.params.userID})
    BookingMaster.find({ $or: [ { "createdBy": req.params.userID }, { "employeeUserId": req.params.userID } ] })
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.getBookings_User_status = (req,res,next)=>{
    BookingMaster.find({ $or: [ { "createdBy": req.body.userId }, { "employeeUserId": req.body.userId } ] ,statusValue: req.body.status})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};
exports.getBookings_By_status = (req,res,next)=>{
    BookingMaster.find({statusValue: req.params.status})
        .sort({createdAt : -1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.countApprovalReqBookings = (req,res,next)=>{
    BookingMaster.aggregate([
    {$match:
        {$or:
          [
            {"managerId1":ObjectId(req.params.managerId)},
            {"managerId2":ObjectId(req.params.managerId)},
            {"managerId3":ObjectId(req.params.managerId)}
          ]
        }
     },
     {$match:{"approvalRequired" : "Yes"}},
     {$match:{"statusValue" : {$in:["New","Manager Approved","Manager Rejected","Cancelled By Vendor","Cancelled By User"]}}},
     {$count:"count"}
    ])
    // BookingMaster.find({"approvalRequired" : "Yes","statusValue" : {$in:["New","Manager Approved","Manager Rejected","Cancel By Vendor","Cancel By User"]},"managerId1":req.params.managerId}).count()
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.fetchBookings = (req,res,next)=>{
    BookingMaster.aggregate([{
        $lookup:
            {
               from: "packagetypemasters",
               localField: "packageTypeId",
               foreignField: "_id",
               as: "packageType"
            }
        },
        {
        $lookup:
            {
               from: "packagemasters",
               localField: "packageId",
               foreignField: "_id",
               as: "package"
            }
        },
        { "$unwind": "$packageType" },{$addFields: { packageType : "$packageType.packageType"} },
        { "$unwind": "$package" },{$addFields: { packageName : "$package.packageName"} },
        { "$match" : req.body.selector }
        ])
       
        .sort({createdAt : -1})
        .then(data=>{
            res.status(200).json( data );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};



exports.getBookings = (req,res,next)=>{
    var selector = {};
    if(req.params.status === "Trip Allocated To Driver"){
        selector = {
            $and: [
                    {
                        allocatedToDriver : req.params.personId
                    }, 
                    {
                        statusValue:req.params.status
                    },
                ]
            }
    }else if(req.params.status==="Running"){
        selector = {
            $and: [
                    {
                        allocatedToDriver : req.params.personId
                    },
                    {
                        statusValue:{$in:["Driver Accepted","Started From Garage","Reached Pickup Location","Start OTP Verified","Start From Pickup","Intermediate Stop","Reached Destination","End OTP Verified","Reached Drop Location","Reached Garage","Expense Submitted"]}
                    }
                ]
        } 
    }else if(req.params.status==="Ready To Bill" || req.params.status==="Driver Rejected"){
        selector = {status: { $elemMatch: { allocatedToDriver: req.params.personId, value : req.params.status } } } 
    }else if(req.params.status==="Cancelled"){
        selector = {status: { $elemMatch: { allocatedToDriver: req.params.personId,  value: {$in:["Driver Changed By Vendor","Cancelled By Vendor","Rejected By Manager"]}}}}
    }
    BookingMaster.find(selector)
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log("error",err);
        res.status(500).json({ error: err });
    });
};

exports.getBookingByID = (req,res,next)=>{
    BookingMaster.find({_id: req.params.bookingID})
        .exec()
        .then(data=>{
            res.status(200).json({ data : data } );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.matchBookingStatus = (req,res,next)=>{
   
    BookingMaster.aggregate([
        {$match:{"_id":ObjectId(req.params.bookingID)}},
        // {$match:{$or:[{"statusValue":"Manager Rejected"},{"statusValue":"Manager Approved"},{"statusValue":"Edited Manager Rejected"},{"statusValue":"Edited Manager Approved"}]}},
        {$project:{
           status: {$filter:{
               input:'$status',
               as: 'status',
               cond: { $or:[
                   {$eq: ['$$status.value','Manager Approved']},
                   {$eq: ['$$status.value','Manager Rejected']},
                   {$eq: ['$$status.value','Edited Manager Approved']},
                   {$eq: ['$$status.value','Edited Manager Rejected']}
                ]
           }
       },
     }}
     },
     {$unwind : '$status'},
     {$sort: { "status.statusAt": -1 }},
     ])
    // BookingMaster.find({_id: req.params.bookingID, status:{$elemMatch:{value:'Manager Approved'}}})
    .exec()
        .then(data=>{
            res.status(200).json({ data : data } );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
},

exports.getManagerBookingStatus = (req,res,next)=>{
   
    BookingMaster.findOne({"_id":req.params.bookingID})
    .exec()
    .then(bookingList=>{
        main();
        async function main(){
            var k = 0 ;
            var returnData = [];
            if(bookingList.status && bookingList.status.length > 0){
                for(k = 0 ; k < bookingList.status.length ; k++){
                    var elem = bookingList.status[k];
                    var managerDetails = {
                        firstName   : "",
                        middleName  : "",
                        lastName    : "",
                        contactNo   : "",
                    };
                    if(elem.value==="Manager Rejected" || elem.value === 'Manager Approved' || elem.value === 'Edited Manager Rejected' || elem.value==='Edited Manager Approved'){
                        managerDetails = await getManagerDetails(elem.statusBy);
                        returnData.push({
                            manager : managerDetails,
                            date:elem.statusAt,
                            remark:elem.remark,
                            status:elem.value
                        })
                    }
                    
                }
            }
            res.status(200).json(returnData);
        }
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
}

exports.matchCRBookingStatus = (req,res,next)=>{
   
    BookingMaster.aggregate([
        {$match:{"_id":ObjectId(req.params.bookingID)}},
        {$project:{
           status: {$filter:{
               input:'$status',
               as: 'status',
               cond: { $or:[
                   {$eq: ['$$status.value','Change Request']},
                ]
           }
       },
     }}
     },
     {$unwind : '$status'},
     {$sort: { "status.statusAt": -1 }},
     ])
    // BookingMaster.find({_id: req.params.bookingID, status:{$elemMatch:{value:'Manager Approved'}}})
    .exec()
        .then(data=>{
            res.status(200).json({ data : data } );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
},

exports.getBookingByID_empDetails = (req,res,next)=>{
    BookingMaster.aggregate([
        {"$match":{_id: ObjectId(req.params.bookingID)}},
        {
            $lookup:
            {
               from: "personmasters",
               localField: "employeeId",
               foreignField: "_id",
               as: "user"
            }
        }
        ])
        .exec()
        .then(data=>{
            res.status(200).json({ data : data } );
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.singleBookingForDriver = (req, res, next)=>{
    BookingMaster.aggregate([
        { "$match" : {_id: ObjectId(req.params.bookingID)} },
        {
            $lookup:
            {
               from: "personmasters",
               localField: "employeeId",
               foreignField: "_id",
               as: "employee"
            }
        },
        {
            $lookup:
            {
               from: "entitymasters",
               localField: "corporateId",
               foreignField: "_id",
               as: "company"
            }
        },
        {
            $lookup:
            {
               from: "vehiclemasters",
               localField: "vehicleID",
               foreignField: "_id",
               as: "vehicle"
            }
        },
        { "$unwind": "$employee" },
        { "$unwind": "$company" },
        { "$unwind": "$vehicle" },
        {
            $project:
            {
                "_id"                 : 1,
                "bookingId"           : 1,
                "status"              : 1,
                "statusValue"         : 1,
                "from"                : 1,
                "to"                  : 1,
                "pickupDate"          : 1,
                "pickupTime"          : 1,
                "returnDate"          : 1,
                "returnTime"          : 1,
                "intermediateStops"   : 1,
                "specialInstruction"  : 1,
                "tripExpenses"        : 1,
                "employeeUserId"      : 1,
                "corporateId"         : 1,
                "ratingToPassenger"   : 1,
                "firstName"           : "$employee.firstName",
                "middleName"          : "$employee.middleName",
                "lastName"            : "$employee.lastName",
                "employeeID"          : "$employee.employeeId",
                "employeeMobile"      : "$employee.contactNo",
                "vehicleCategory"     : "$vehicle.category",
                "vehicleBrand"        : "$vehicle.brand",
                "vehicleModel"        : "$vehicle.model",
                "vehicleNumber"       : "$vehicle.vehicleNumber",
                "vehicleColor"        : "$vehicle.vehiclecolor",
                "vehicleImage"        : "$vehicle.vehicleImage",
                "companyName"         : "$corporate.companyName"
            }
        },
        ])
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};


exports.updateBooking = (req, res, next)=>{
    BookingMaster.updateOne(
            { _id:req.body.bookingID },  
            {
                $set:   {   "packageTypeId"           : req.body.packageTypeId,
                            "packageId"               : req.body.packageId,
                            "contractId"              : req.body.contractId,
                            "tripType"                : req.body.tripType,
                            "pickupFrom"              : req.body.pickupFrom,
                            "from"                    : req.body.from,
                            "to"                      : req.body.to,
                            "pickupDate"              : req.body.pickupDate,
                            "pickupTime"              : req.body.pickupTime,
                            "returnDate"              : req.body.returnDate,
                            "returnTime"              : req.body.returnTime,   
                            "vehicleCategoryId"       : req.body.vehicleCategoryId,
                            "employeeId"              : req.body.employeeId,
                            "employeeUserId"          : req.body.employeeUserId,
                            "departmentId"            : req.body.departmentId,
                            "corporateId"             : req.body.corporateId,
                            "managerId1"               : req.body.managerId1,
                            "managerId2"               : req.body.managerId2,
                            "managerId3"               : req.body.managerId3,
                            "managerID1"                  : req.body.managerID1,
                            "managerID2"                  : req.body.managerID2,
                            "managerID3"                  : req.body.managerID3,
                            "approver1exist"               : req.body.approver1exist,
                            "approver2exist"               : req.body.approver2exist,
                            "approver3exist"               : req.body.approver3exist,
                            "approvalRequired"              : req.body.approvalRequired,
                            "intermediateStops"       : req.body.intermediateStops,
                            "vehicleID"                   : req.body.vehicleID,
                            "estimatedCost"               : req.body.estimatedCost,
                            "specialInstruction"          : req.body.specialInstruction,
                            "purposeOfTravel"             : req.body.purposeOfTravel,
                            "purposeOfTravelOther"             : req.body.purposeOfTravelOther,
                            "reasonForSelectingVehicle"   : req.body.reasonForSelectingVehicle,
                            "statusValue"                 : req.body.statusValue,
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                BookingMaster.updateOne(
                { _id:req.body.bookingID},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy
                                            }],
                             'status': req.body.status,
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
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.deleteBooking = (req, res, next)=>{
    BookingMaster.deleteOne({_id: req.params.bookingID})
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
exports.filterBookings = (req,res,next)=>{
    var selector = {}; 
    selector['$and']=[];

    if (req.body.userId){
    selector["$and"].push({"createdBy": req.body.userId })
    selector["$and"].push({"employeeUserId": req.body.userId })
    }
    if (req.body.filteredMonth && req.body.filteredMonth != 'All') {
        selector["$and"].push({'createdAt':{$gte : new Date(req.body.monthStart), $lt : new Date(req.body.monthEnd) }})
    }
    if (req.body.filteredYear && (req.body.filteredMonth == "" || req.body.filteredMonth == 'All')) {
        selector["$and"].push({'createdAt':{$gte : new Date(req.body.yearStart), $lt : new Date(req.body.yearEnd) }})
    }
    if (req.body.filteredStatus && req.body.filteredStatus != 'All') {
        selector["$and"].push({ statusValue : req.body.filteredStatus })
    }
    if (req.body.filteredStatus == 'All' && req.body.filteredMonth == 'All'){
        selector["$and"].push({'createdAt':{$gte : new Date(req.body.yearStart), $lt : new Date(req.body.yearEnd) }})
    }
    if (req.body.filteredStatus && req.body.filteredMonth == 'All'){
        selector["$and"].push({'createdAt':{$gte : new Date(req.body.yearStart), $lt : new Date(req.body.yearEnd) }})
    }
    BookingMaster.find(selector)
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

exports.updateStatus = (req,res,next)=>{
     BookingMaster.findOne({_id:req.body.bookingID})
    .then(booking=>{
         var status = req.body.status;
        if(!status.allocatedToDriver){
            var checkDriver = booking.status.slice().reverse().find(e=> e.value === "Trip Allocated To Driver");
            if(checkDriver){
                status.allocatedToDriver = checkDriver.allocatedToDriver;
            }
        }
        if(!status.allocatedToVendor){
            var checkVendor = booking.status.slice().reverse().find(e=> e.value === "Allocated To Vendor");
            if(checkVendor){
                status.allocatedToVendor = checkVendor.allocatedToVendor;
            }
        }
        var updateObj = {
            "statusValue"   : status.value,
        }
        if(req.body.vehicleID){
            updateObj.vehicleID     = req.body.vehicleID;
            updateObj.statusValue   = status.value;
        }
        if(status.allocatedToDriver){
            updateObj.allocatedToDriver = status.allocatedToDriver
        }
        // if(status.value === "Started From Garage"){
        //     var startOTP     = 1234;
        //     var endOTP       = 5678;
        //     status.startOTP = startOTP;
        //     status.endOTP   = endOTP;
        // }
        BookingMaster.updateOne(
            { _id:req.body.bookingID },  
            {
                $push:  {  
                            "status"      : status,
                        },
                $set:  updateObj,
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                BookingMaster.updateOne(
                { _id:req.body.bookingID},
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
            console.log(err);
            res.status(500).json({ error: err });
        });
    })
    .catch(err=>{
        console.log("err",err)
        res.status(500).json({ error: err });
    })     
}

exports.changeDriver = (req,res,next)=>{
    BookingMaster.findOne({_id:req.body.bookingID})
    .then(booking=>{
        var allocatedTo = booking.status.slice().reverse().find(e=> e.value === "Trip Allocated To Driver").allocatedToDriver;
        if(allocatedTo){
            var previousStatus = {
                value             : "Driver Changed By Vendor",
                allocatedToDriver : allocatedTo,
                statusBy          :  req.body.status.statusBy,
                statusAt          : new Date()
            }
            BookingMaster.updateOne(
                { _id:req.body.bookingID },  
                {
                    $push:  {  
                                "status"      : previousStatus,
                            },
                    $set:  {
                                "statusValue"       : previousStatus.value,
                                "allocatedToDriver" : previousStatus.allocatedToDriver,
                            }
                }
            )
            .exec()
            .then(booking=>{
                if(booking.nModified == 1){
                    BookingMaster.updateOne(
                        { _id:req.body.bookingID },  
                        {
                            $push:  {  
                                        "status"      : req.body.status,
                                    },
                            $set:  {
                                        "statusValue" : req.body.status.value,
                                        "allocatedToDriver" : req.body.status.allocatedToDriver,
                                    }
                        }
                    )
                    .exec()
                    .then(booking=>{
                        if(booking.nModified == 1){
                            BookingMaster.updateOne(
                            { _id:req.body.bookingID},
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
                        console.log(err);
                        res.status(500).json({ error: err });
                    });
                }else{
                    res.status(200).json({ updated : false });
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({ error: err });
            });
        }
    })
    .catch(err=>{
        console.log("err",err)
    })     
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


exports.changeVehicle = (req,res,next)=>{
    BookingMaster.updateOne(
        { _id:req.body.bookingID },  
        {
            $set:  {
                        "vehicleID"   : req.body.vehicleID
                    },
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            BookingMaster.updateOne(
            { _id:req.body.bookingID},
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
        res.status(500).json({ error: err });
    });
}

//Get Status
exports.getStatus = (req,res,next)=>{
    BookingMaster.aggregate([
      {
        $match: {
          "_id":ObjectId(req.params.bookingID)
        }
      },
      {
        $project: {
          status: {
            $slice: [ "$status", -1 ]
          }
        }
      }
    ])
    .exec()
    .then(data=>{
      res.status(200).json({data});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({ error: err });
    });
}


exports.insert_trip_expenses = (req,res,next)=>{
    BookingMaster.updateOne(
        { _id:req.body.bookingID },  
        {
            $set:   {  
                        "tripExpenses"                  : req.body.tripExpenses,
                        "statusValue"                   : 'Expense Submitted'
                    },
            $push:  {
                       status:{
                            "value"    : 'Expense Submitted',
                            "statusBy" : req.body.updatedBy,
                            "statusAt" : new Date(),
                       }
                    }        
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            BookingMaster.updateOne(
            { _id:req.body.bookingID},
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
        console.log(err);
        res.status(500).json({ error: err });
    });
}

exports.ratingToPassenger = (req,res,next)=>{
    BookingMaster.updateOne(
        { _id:req.body.bookingID },  
        {
            $set:   {  
                        "ratingToPassenger" : {
                            rating:req.body.rating,
                            remark:req.body.remark
                        }
                    },
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            BookingMaster.updateOne(
            { _id:req.body.bookingID},
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
        console.log(err);
        res.status(500).json({ error: err });
    });
}


exports.update_routeCoordinates = (req,res,next)=>{
    BookingMaster.updateOne(
        { _id:req.body.bookingID},
        {
            $push : {
                "routeCoordinates" : req.body.routeCoordinates,
            },
        })
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

//Billing API

exports.getAllBookingListForGenerateBill = (req,res,next)=>{
    BookingMaster.aggregate([
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"entitymasters",
            localField: "corporateId",
            foreignField: "_id",
            as:"company"
         }
    },
    {$lookup:
        {
            from:"packagemasters",
            localField: "packageId",
            foreignField: "_id",
            as:"package"
         }
    },
    { "$match": { "status.value": "Driver Accepted" } },
   { "$lookup": {
     "from": "personmasters",
     "localField": "status.statusBy",
     "foreignField": "_id",
     "as": "driver"
   }},
    { $match :{"statusValue" :"Ready To Bill"}},
 //    {
 //        $group:{
 //            "_id":"$tripExpenses.ticketPrice"
 //           ,
 //         "Total Price : ":{
 //             $sum:{
 //                 $sum: "$tripExpenses.ticketPrice"
 //             }
 //         }
 //     }
 // },
    ])
    .sort({createdAt : -1})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });  
},

exports.getSingleBookingListForGenerateBill = (req,res,next)=>{
    BookingMaster.aggregate([
     {
        $match: {
          "_id":ObjectId(req.params.id)
        }
      },
    {$lookup:
        {
            from:"personmasters",
            localField: "employeeId",
            foreignField: "_id",
            as:"person"
         }
    },
    {$lookup:
        {
            from:"entitymasters",
            localField: "corporateId",
            foreignField: "_id",
            as:"company"
         }
    },
    {$lookup:
        {
            from:"expensetypemasters",
            localField: "tripExpenses.ticketName",
            foreignField: "type",
            as:"expense"
         }
    },
    { "$match": { "status.value": "Driver Accepted" } },
   { "$lookup": {
     "from": "personmasters",
     "localField": "status.statusBy",
     "foreignField": "_id",
     "as": "driver"
   }},
    { $match :{"statusValue" :"Ready To Bill"}},
 
    ])
    .sort({createdAt : -1})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });  
},


//Vendor App API

exports.getbookingListForVendor = (req,res,next)=>{
    console.log("req.body",req.body);
    BookingMaster.find(
         {$and: [
            {
                'statusValue' : { $in:req.body.status}
            },
            {
                'status'      : { $elemMatch: { allocatedToVendor: req.body.company_Id } }
            },
            {
                'createdAt'   : {$gte : new Date(req.body.startDate), $lt : new Date(req.body.endDate) }
            }
        ]}
    )
   .populate('corporateId')
   .populate('employeeId')
   .populate('vehicleCategoryId')
   .populate('vehicleID')
   .sort({createdAt:1})
   .exec()
   .then(bookingList=>{
        // console.log("bookingList",bookingList);
        main();
        async function main(){
            var k = 0 ;
            var returnData = [];
            for(k = 0 ; k < bookingList.length ; k++){
                if(bookingList[k].corporateId && bookingList[k].employeeId && bookingList[k].vehicleCategoryId){
                    // var driverInfo = bookingList[k].status.find(elem => elem.value === 'Vendor Allocated to Driver');
                    var driverInfo = bookingList[k].status.filter((elem)=>{return elem.value==="Trip Allocated To Driver"});
                    var driverDetails = {
                        firstName   : "",
                        middleName  : "",
                        lastName    : "",
                        contactNo   : "",
                    };
                    if( driverInfo && driverInfo.length > 0){
                        driverDetails = await getDriverDetails(driverInfo[driverInfo.length-1].allocatedToDriver);
                    }
                    var reasonData = bookingList[k].status.filter((elem)=>{return elem.value==="Driver Rejected"});
                    var reamrk = "";
                    if( reasonData && reasonData.length > 0){
                        reamrk = reasonData[reasonData.length-1].remark
                    }
                    returnData.push({
                        "_id"                     : bookingList[k]._id,
                        "bookingId"               : bookingList[k].bookingId,
                        "companyName"             : bookingList[k].corporateId.companyName,
                        "companyId"               : bookingList[k].corporateId.companyId,
                        "company_id"              : bookingList[k].corporateId._id,
                        "employee_id"             : bookingList[k].employeeId._id,
                        "employeeName"            : bookingList[k].employeeId.firstName+" "+bookingList[k].employeeId.middleName+" "+bookingList[k].employeeId.lastName,
                        "employeeMobile"          : bookingList[k].employeeId.contactNo,
                        "vehicleCategory"         : bookingList[k].vehicleCategoryId.category,
                        "vehicle_id"              : bookingList[k].vehicleID ? bookingList[k].vehicleID._id : null,
                        "vehicleBrand"            : bookingList[k].vehicleID ? bookingList[k].vehicleID.brand : null ,
                        "vehicleModel"            : bookingList[k].vehicleID ? bookingList[k].vehicleID.model : null ,
                        "vehicleNumber"           : bookingList[k].vehicleID ? bookingList[k].vehicleID.vehicleNumber : null ,
                        "vehicleColor"            : bookingList[k].vehicleID ? bookingList[k].vehicleID.vehiclecolor : null ,
                        "driverDetails"           : driverDetails,
                        "statusValue"             : bookingList[k].statusValue,
                        "status"                  : bookingList[k].status, 
                        "reamrk"                  : reamrk,
                        "from"                    : bookingList[k].from,
                        "to"                      : bookingList[k].to,
                        "pickupDate"              : bookingList[k].pickupDate,
                        "pickupTime"              : bookingList[k].pickupTime,
                        "returnDate"              : bookingList[k].returnDate,
                        "returnTime"              : bookingList[k].returnTime,
                    })
                }
             }   
            if(k >= bookingList.length){
                res.status(200).json(returnData);
            }
        }    
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};

function getDriverDetails(driver_id){
   return new Promise(function(resolve,reject){
        PersonMaster.findOne({"_id" : driver_id,"status":"Active"},{"firstName":1,middleName:1,lastName:1,contactNo:1})
             .exec()
             .then(driverDetails=>{
                resolve(driverDetails);
             })
            .catch(err =>{
                res.status(500).json({
                    message : "driver not found.",
                    error: err
                   });
            });
    });
}


exports.singleBookingForVendor = (req, res, next)=>{
    BookingMaster.find({_id: ObjectId(req.params.bookingID)})
    .populate('vehicleCategoryId')
    .populate('employeeId')
    .populate('vehicleID')
    .then(data=>{
        main();
        async function main(){
            try{
            var returnData = data[0];
            var driverInfo = returnData.status.filter((elem)=>{return elem.value==="Trip Allocated To Driver"});
            console.log("driverInfo",driverInfo);
            var driverDetails = {
                firstName   : "",
                middleName  : "",
                lastName    : "",
                contactNo   : "",
            };
            var vendor = "";
            var vendorId = ""
            if( driverInfo && driverInfo.length > 0){
                driverDetails = await getDriverDetails(driverInfo[driverInfo.length-1].allocatedToDriver);
                vendor = driverInfo[driverInfo.length-1].statusBy ;
                vendorId = driverInfo[driverInfo.length-1].allocatedToVendor ;
            }

           
            var reasonData = returnData.status.filter((elem)=>{return elem.value==="Driver Rejected"});
            var remark = "";
            if( reasonData && reasonData.length > 0){
                remark = reasonData[reasonData.length-1].remark
            }
            res.status(200).json({
                "_id"                 : returnData._id,
                "bookingId"           : returnData.bookingId,
                "status"              : returnData.status,
                "statusValue"         : returnData.statusValue,
                "tripType"            : returnData.tripType,
                "from"                : returnData.from,
                "to"                  : returnData.to,
                "pickupDate"          : returnData.pickupDate,
                "pickupTime"          : returnData.pickupTime,
                "returnDate"          : returnData.returnDate,
                "returnTime"          : returnData.returnTime,
                "intermediateStops"   : returnData.intermediateStops,
                "specialInstruction"  : returnData.specialInstruction,
                "purposeOfTravel"     : returnData.purposeOfTravel,
                "purposeOfTravelOther": returnData.purposeOfTravelOther,
                "createdAt"           : returnData.createdAt,
                "managerID"           : returnData.managerID1,
                "managerId1"          : returnData.managerId1,
                "tripExpenses"        : returnData.tripExpenses,
                "estimatedCost"       : returnData.estimatedCost,
                "firstName"           : returnData.employeeId.firstName,
                "middleName"          : returnData.employeeId.middleName,
                "lastName"            : returnData.employeeId.lastName,
                "contactNo"           : returnData.employeeId.contactNo,
                "employeeEmail"       : returnData.employeeId.email,
                "employeeID"          : returnData.employeeId.employeeId,
                "companyName"         : returnData.employeeId.companyName,
                "profilePhoto"        : returnData.employeeId.profilePhoto,
                "vehicleCategory"     : returnData.vehicleCategoryId.category,
                "vehicleBrand"        : returnData.vehicleID ? returnData.vehicleID.brand : null ,
                "vehicleModel"        : returnData.vehicleID ? returnData.vehicleID.model : null ,
                "vehicleNumber"       : returnData.vehicleID ? returnData.vehicleID.vehicleNumber : null ,
                "vehicleColor"        : returnData.vehicleID ? returnData.vehicleID.vehiclecolor : null ,
                "vehicle_id"          : returnData.vehicleID ? returnData.vehicleID._id : null ,
                'driverDetails'       : driverDetails,
                'vendor'              : vendor,
                'vendorId'              : vendorId,
                'remark'              : remark,
            });
            }
            catch(err) {
                console.log(err)
              }
         }   
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};


exports.vehicleListForAllocation = (req, res, next)=>{
    BookingMaster.aggregate([
        { "$match" : {_id: ObjectId(req.params.bookingID)}},
        {
            $lookup:
            {
               from: "vehiclemasters",
               localField: "vehicleCategoryId",
               foreignField: "categoryId",
               as: "vehicles"
            }
        },
        { "$unwind": "$vehicles" },
        {
            $project:
            {
                "_id"                 : 1,
                "bookingId"           : 1,
                "pickupDate"          : 1,
                "pickupTime"          : 1,
                "returnDate"          : 1,
                "returnTime"          : 1,
                "vehicles"            : 1,
            }
        },
        
        ])
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};


exports.trip_otp_verification = (req, res, next) => {
    var selector = {}
    if(req.body.startOTP){
       selector = {"startOTP": req.body.startOTP}
    }else if(req.body.endOTP){
       selector = {"endOTP": req.body.endOTP}
    }
    BookingMaster.find({ _id: ObjectId(req.body.booking_id), status:{$elemMatch:selector}})
        .exec()
        .then(data => {
            if (data.length > 0) {
                 res.status(200).json({ message: "SUCCESS"});
            } else {
                res.status(200).json({ message: "FAILED"});
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Failed to find the booking",
                error: err
            });
        });
};

function getManagerDetails(id){
   return new Promise(function(resolve,reject){
        PersonMaster.findOne({"_id" : id},{"firstName":1,employeeId:1,lastName:1,contactNo:1})
             .exec()
             .then(managerDetails=>{
                resolve(managerDetails);
             })
            .catch(err =>{
                res.status(500).json({
                    message : "employee not found.",
                    error: err
                   });
            });
    });
}

exports.managerDetail_ByID = (req, res, next)=>{
    BookingMaster.find({_id: ObjectId(req.params.bookingID)})
    .populate('employeeId')
    .then(data=>{
        main();
        async function main(){
            var returnData = data[0];
            var managerInfo = returnData.status.filter((elem)=>{return elem.value===req.params.status});
            var managerDetails = {
                firstName   : "",
                lastName    : "",
                employeeId  : "",
                contactNo   : "",
            };
            var DateVar = ""
            if( managerInfo && managerInfo.length > 0){
                managerDetails = await getManagerDetails(managerInfo[managerInfo.length-1].statusBy);
                DateVar = (managerInfo[managerInfo.length-1].statusAt);

            }
            res.status(200).json({
                "bookingId"           : returnData.bookingId,
                "from"                : returnData.from.address,
                "to"                  : returnData.to.address,
                "pickupDate"          : returnData.pickupDate,
                "pickupTime"          : returnData.pickupTime,
                "returnDate"          : returnData.returnDate,
                "returnTime"          : returnData.returnTime,
                "intermediateStops"   : returnData.intermediateStops,
                "specialInstruction"  : returnData.specialInstruction,
                "purposeOfTravel"     : returnData.purposeOfTravel,
                "purposeOfTravelOther"  : returnData.purposeOfTravelOther,
                "employeeId"          : returnData.employeeId.employeeId,
                "corporateId"         : returnData.corporateId,
                "firstName"           : returnData.employeeId.firstName,
                "middleName"          : returnData.employeeId.middleName,
                "lastName"            : returnData.employeeId.lastName,
                "employeeID"            : returnData.employeeId.userId,
                "contactNo"           : returnData.employeeId.contactNo,
                'managerDetails'      : managerDetails,
                "Date"                : DateVar
            });
         }   
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};

function getvendorDetails(company){
   return new Promise(function(resolve,reject){
     EntityMaster.findOne({'_id':company})
        .exec()
        .then(result => {
            User
            .findOne({"roles":"vendoradmin","profile.companyID":result.companyID},{"profile.fullName":1,"profile.companyName":1,"profile.mobile":1})
            .exec()
            .then(vendorDetails=>{
                resolve(vendorDetails);
             })
            .catch(err => {
                console.log(err);
                reject({
                    error: err
                });
            });
        })
        .catch(err =>{
            console.log('entityMaster error: ',err)
        })
        
    });
}

exports.getVendorDetail_ByBookingID = (req, res, next)=>{
    BookingMaster.find({_id: ObjectId(req.params.bookingID)})
    .populate('employeeId')
    .then(data=>{
        main();
        async function main(){
            var returnData = data[0];
            var vendorInfo = returnData.status.filter((elem)=>{return elem.value==="Allocated To Vendor"});
            var vendorDetails = {
                fullName   : "",
                companyName    : "",
                mobile  : "",
            };
            if( vendorInfo && vendorInfo.length > 0){
                vendorDetails = await getvendorDetails(vendorInfo[vendorInfo.length-1].allocatedToVendor);
            }
            console.log('vendorDetails: ',vendorDetails)
            res.status(200).json({
                "bookingId"           : returnData.bookingId,
                "from"                : returnData.from.address,
                "to"                  : returnData.to.address,
                "pickupDate"          : returnData.pickupDate,
                "pickupTime"          : returnData.pickupTime,
                "returnDate"          : returnData.returnDate,
                "returnTime"          : returnData.returnTime,
                "intermediateStops"   : returnData.intermediateStops,
                "specialInstruction"  : returnData.specialInstruction,
                "employeeId"          : returnData.employeeId.employeeId,
                "corporateId"         : returnData.corporateId,
                "firstName"           : returnData.employeeId.firstName,
                "middleName"          : returnData.employeeId.middleName,
                "lastName"            : returnData.employeeId.lastName,
                "employeeID"            : returnData.employeeUserId,
                "contactNo"           : returnData.employeeId.contactNo,
                'vendorDetails'      : vendorDetails,
            });
         }   
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};

exports.filedetails = (req, res, next) => {
    var finaldata = {};
    BookingMaster.aggregate([
        {
            $lookup:
            {
                from: "departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        },
        { $match: {fileName: req.params.fileName } }
    ])
        .exec()
        .then(data => {
            //finaldata.push({goodrecords: data})
            finaldata.goodrecords = data;
            FailedRecords.find({ fileName: req.params.fileName })
                .exec()
                .then(badData => {
                    finaldata.failedRecords = badData[0].failedRecords
                    finaldata.totalRecords = badData[0].totalRecords
                    res.status(200).json(finaldata);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
var fetchAllBookingData = async (type) => {
    return new Promise(function (resolve, reject) {
        BookingMaster.find({ type: type })
            .sort({ createdAt: -1 })
            // .skip(req.body.startRange)
            // .limit(req.body.limitRange)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
var fetchPersonMaster = async (companyID,employeeId) => {
    return new Promise(function (resolve, reject) {
        PersonMaster.find({companyID:companyID,employeeId:employeeId})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
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



exports.bulkUploadBooking = (req, res, next) => {
     var bookingdata    = req.body.data;
   // var bookingdata=[{employeeID:"11"},{CompanyID:"1"}]
   console.log("bookingdata---",bookingdata);

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

        var personData = await fetchPersonMaster();
        // console.log("personData---",personData);
       
          for(var k = 0 ; k < bookingdata.length ; k++){
           
           if (bookingdata[k].tripType == '-') {
                remark += "tripType not found, ";
            }
            if (bookingdata[k].fromaddress == '-') {
                remark += "fromaddress not found, ";
            }
            if (bookingdata[k].fromarea == '-') {
                remark += "fromarea not found, ";
            }
            if (bookingdata[k].fromcity == '-') {
                remark += "fromcity not found, ";
            }
            if (bookingdata[k].fromstate == '-') {
                remark += "fromstate not found, ";
            }
            if (bookingdata[k].fromcountry == '-') {
                remark += "fromcountry not found, ";
            }
            if (bookingdata[k].frompincode == '-') {
                remark += "frompincode not found, ";
            }
            if (bookingdata[k].toaddress == '-') {
                remark += "toaddress not found, ";
            }
            if (bookingdata[k].toarea == '-') {
                remark += "toarea not found, ";
            }
            if (bookingdata[k].tocity == '-') {
                remark += "tocity not found, ";
            }
            if (bookingdata[k].tostate == '-') {
                remark += "tostate not found, ";
            }
            if (bookingdata[k].tocountry == '-') {
                remark += "tocountry not found, ";
            }
            if (bookingdata[k].topincode == '-') {
                remark += "topincode not found, ";
            }
             if (bookingdata[k].pickupDate == '-') {
                remark += "pickupDate not found, ";
            } 
            if (bookingdata[k].pickupTime == '-') {
                remark += "pickupTime not found, ";
            }
             if (bookingdata[k].returnDate == '-') {
                remark += "returnDate not found, ";
            }
            if (bookingdata[k].returnTime == '-') {
                remark += "returnTime not found, ";
            }
            if (bookingdata[k].specialInstruction == '-') {
                remark += "specialInstruction not found, ";
            }
            if (bookingdata[k].purposeOfTravel == '-') {
                remark += "purposeOfTravel not found, ";
            }
            if (bookingdata[k].vehicleCategory == '-') {
                remark += "vehicleCategory not found, ";
            }
            if (bookingdata[k].vehicle == '-') {
                remark += "vehicle not found, ";
            }
            /*if (bookingdata[k].intermediateStops == '-') {
                remark += "intermediateStops not found, ";
            }*/
            console.log("remark", remark)
            
            if (remark == '') {
                // var personMasterData=[];
                /*var personMasterData = personData.filter((data)=>{
                    console.log("data.companyID",data.companyID);
                    if ((data.companyID) == (bookingdata[0].companyID) && (data.employeeId) == (bookingdata[0].employeeId)) {
                        return data;
                    }
                })*/
                var companyID = bookingdata[k].companyID
                var employeeId = bookingdata[k].employeeId
                var personData = await fetchPersonMaster(companyID,employeeId);

                if (personData.length>0) {
                        validObjects = bookingdata[k]; 
                        validObjects.companyID           = companyID;
                        validObjects.employeeId          = employeeId;      
                        validObjects.fileName            = req.body.fileName;
                        validObjects.createdAt           = new Date();
                        validData.push(validObjects); 
                    
                }else{
                    invalidObjects = bookingdata[k];
                    invalidObjects.failedRemark = "Employee not found";
                    invalidData.push(invalidObjects);   
                }
                
            }else{
                //console.log('2. annualPlans',annualPlans[k])
                invalidObjects = bookingdata[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }

        //console.log("validData",validData);

        BookingMaster.insertMany(validData)
        .then(data=>{
            //console.log("data",data);
        })
        .catch(err =>{
            console.log(err);
        });
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords, req.body.updateBadData);
        
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
            });
    }

   
};

exports.start_trip = (req,res,next)=>{ 
    console.log("req.body",req.body);
    var returnDate = req.body.returnDate;
        BookingMaster.find(
             {$and: [
                {
                    _id: { $nin: req.body.booking_id }
                },
                {
                    status: { $elemMatch: { allocatedToDriver: req.body.personId}}
                },
                {
                    pickupDate: { $gte: new Date()}
                },
                {
                    returnDate: { $lte: new Date(returnDate)}
                }
            ]}
        )
        .exec()
        .then(booking => {
            console.log("booking",booking)
            if(booking.length > 0){
                res.status(200).json({startTrip:false});
            }else{
                res.status(200).json({startTrip:true});
            }
        })
        .catch(err => {
            console.log("err",err);
            res.status(500).json({ error: err });
        });
};



