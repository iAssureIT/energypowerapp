const mongoose             = require("mongoose");
const  _                = require('underscore');
var   ObjectID             = require('mongodb').ObjectID;
const Tickets              = require('./Model.js');
// const PersonMaster      = require('../../coreadmin/personMaster/ModelPersonMaster');
let PersonMaster = mongoose.model('personmasters');
let Attendance =  require('../attendance/Model');

let Users = mongoose.model('users');
const moment = require('moment');
exports.create_Ticket = (req, res, next) => {
    console.log(" req.body", req.body);
    Tickets.find({})
    .sort({createdAt: -1})
    .exec()
    .then(data=>{
        var date = new Date();
        var year = date.getYear().toString().substr(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var ticketId = year.concat(month).concat('001')
        if(data && data.length > 0){
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            if(date.toDateString() !== firstDay.toDateString()){
                ticketId = parseInt(data[0].ticketId) + 1;
            }
        }
        console.log("year=>",year);
        console.log("month=>",month);
        console.log("ticketId=>",ticketId);
        const tickets  = new Tickets({
            _id                    :    new mongoose.Types.ObjectId(),
            ticketId               :    parseInt(ticketId),
            clientName             :    req.body.clientName,
            client_id              :    req.body.client_id,
            contactPerson          :    req.body.contactPerson,
            contactPerson_id       :    req.body.contactPerson_id,
            projectLocationName  :    req.body.projectLocationName,
            projectLocation_id   :    req.body.projectLocation_id,
            equipmentLocationName     :    req.body.equipmentLocationName,
            equipmentLocation_id      :    req.body.equipmentLocation_id ? req.body.equipmentLocation_id : null,
            department             :    req.body.department,
            project                :    req.body.project,
            site                   :    req.body.site,
            is_type                :    "New",
            typeOfIssue            :    req.body.typeOfIssue,
            description            :    req.body.description,
            images                 :    req.body.images,
            videos                 :    req.body.videos,
            createdAt              :    new Date(),
            createdAtStr           :    moment(new Date()).format("YYYY-MM-DD"),
            createdBy              :    req.body.createdBy,
            statusValue            :    req.body.status.value,  
            status                 :    req.body.status,  
        });
        tickets.save()
        .then(data=>{
            res.status(200).json({
                    message  : "Ticket details inserted successfully",
                    _id      : data._id,
                    ticketId : data.ticketId
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }); 
    })
    .catch(err =>{
        console.log("err",err);
        res.status(500).json({error:err})
    })                                    
}; 

exports.list_Tickets = (req,res,next)=>{
    console.log("req body=>",req.body);
    var selector = [];
    var { pageNumber, nPerPage, ticketId, client_id, issue, status, technician_id, searchText,date,serviceRequest } = req.body;
    if(client_id !== ""){
        selector.push({"client_id" : client_id }) ;
    }
    if(searchText !== ""){
        var searchArray = [];
        searchArray.push({"ticketId"                : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"department"              : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"project"                 : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"site"                    : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"projectLocationName"   : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"equipmentLocationName"      : {"$regex": searchText, $options: "i"}});      
        selector.push({$or : searchArray });
    }
    if(status &&  status.length > 0 ){
        selector.push({'statusValue':{$in:status}})
    }
    if(serviceRequest &&  serviceRequest.length > 0 ){
        selector.push({'serviceRequest':{$in:serviceRequest}})
    }
    if(issue !== ''){
        selector.push({'typeOfIssue':issue})
    }
    if(ticketId !== ''){
        selector.push({'ticketId':ticketId})
    }
    if(date !== ''){
        selector.push({'createdAtStr':date})
    }
    if(technician_id !== ''){
        selector.push({ status: { $elemMatch: { allocatedTo: technician_id} }})
    }
    Tickets.find({ $and : selector})
        .populate('client_id')
        .sort({createdAt : -1})
        .skip( pageNumber > 0 ? (pageNumber * nPerPage ) : 0 )
        .limit( nPerPage )
        .exec()
        .then(data=>{
            main();
            async function main(){
            var i =0; 
            var returnData = [];
                for(i = 0 ; i < data.length ; i++){
                    var technicianInfo = data[i].status.filter((elem)=>{return elem.value==="Allocated"});
                    var unique_technician_details = [ ...new Map(technicianInfo.map(item => [String(item.allocatedTo), item])).values()];
                    var technicianDetails = [];
                    if( unique_technician_details && unique_technician_details.length > 0){
                        for(var j = 0 ; j < unique_technician_details.length ; j++){
                            if(await getTechnicianDetails(unique_technician_details[j].allocatedTo)){
                                technicianDetails.push(await getTechnicianDetails(unique_technician_details[j].allocatedTo));
                            }
                        }    
                    }
                    if(data[i].client_id){
                        await returnData.push({
                            "_id"                     : data[i]._id,
                            "ticketId"                : data[i].ticketId,
                            "equipmentLocationName"      : data[i].equipmentLocationName,
                            "projectLocationName"   : data[i].projectLocationName,
                            "clientName"              : data[i].client_id.companyName,
                            "client_id"               : data[i].client_id._id,
                            "contactPerson"           : data[i].contactPerson,
                            "contactPerson_id"        : data[i].contactPerson_id,
                            "department"              : data[i].department,
                            "project"                 : data[i].project,
                            "companyID"               : data[i].client_id.companyID,
                            "typeOfIssue"             : data[i].typeOfIssue,
                            "department"              : data[i].department,
                            "project"                 : data[i].project,
                            "site"                    : data[i].site,
                            "is_type"                 : data[i].is_type,
                            "statusValue"             : data[i].statusValue,
                            "cost"                    : data[i].cost,
                            "serviceRequest"          : data[i].serviceRequest,
                            "createdAt"               : data[i].createdAt,
                            "technicianDetails"       : technicianDetails,
                        })
                    }   
                 }   
                if(i >= data.length){
                    res.status(200).json(returnData);
                }
            }    
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 

function getTechnicianDetails(technician_id){
   return new Promise(function(resolve,reject){
        PersonMaster.findOne({"_id" : technician_id,"status":"Active"},{"firstName":1,middleName:1,lastName:1,contactNo:1,_id:1})
             .exec()
             .then(details=>{
                resolve(details);
             })
            .catch(err =>{
                res.status(500).json({
                    message : "technian not found.",
                    error: err
                   });
            });
    });
}

exports.client_tickets_list = (req,res,next)=>{
    var selector = {client_id:req.params.client_id};
    if(req.params.status === "Pending"){
        selector.statusValue = {$in : ['New','Acknowledged','Reopen','Paid Service Request','Paid Service Rejected','Paid Service Approved','Allocated','Assignee Accepted','Assignee Rejected','Work Started','Work In Progress','Resolved']}
    }else if(req.params.status === "Closed"){
        selector.statusValue = "Closed"
    }
    console.log("selector",selector);
    Tickets.find(selector)
        .populate('projectLocation_id')
        .populate('equipmentLocation_id')
        .populate('contactPerson_id')
        .populate({ path: 'status.statusBy', model: 'users', select: {'profile.fullName':1,'profile.mobile':1} })
        .sort({createdAt: -1})
        .exec()
        .then(tickets=>{
            res.status(200).json(tickets);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 

// exports.technician_tickets_list = (req,res,next)=>{
//     var status = req.params.status;
//     var selector = [];
//     var myStatus = [];
//     if(status === 'Work In Progress'){
//         myStatus = ['Work Started','Work In Progress'];
//     }else if(status === "Resolved"){
//         myStatus = ['Resolved','Closed'];
//         selector.push({ status: { $elemMatch: { allocatedTo: req.params.technician_id,value:{$in:['Resolved','Closed']}}} })
//     }else if(status === "Allocated"){
//         myStatus = ['Allocated','Assignee Accepted','Reopen'];
//     }else{
//         myStatus = [status];
//         selector.push({ status: { $elemMatch: { allocatedTo: req.params.technician_id,value:status}}})
//     }
//     Tickets.aggregate([
//             {
//                  $match: {"status.value": {$in:myStatus},"status.allocatedTo": ObjectID(req.params.technician_id)}
//             },
//             {
//                 $sort: {
//                     "status.statusAt": -1
//                 }
//             },
//         ])
//         .sort({createdAt: -1})
//         .exec()
//         .then(data=>{
//             // Tickets
//             // .populate(data, [
//             //     { path: 'contactPerson_id', model: 'personmasters'},
//             //     { path: 'projectLocation_id', model: 'projectlocation'},
//             //     { path: 'equipmentLocation_id', model: 'equipmentlocation'},
//             //     { path: 'status.statusBy', model: 'users', select: {'profile.fullName':1,'profile.mobile':1} }
//             // ])
//             // .then(tickets=>{
//                 res.status(200).json(data);
//             // })
//             // .catch(err =>{
//             //     console.log(err);
//             //     res.status(500).json({
//             //         error: err
//             //     });
//             // });
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// }; 


// exports.technician_tickets_list = (req,res,next)=>{
//     var status = req.params.status;
//     var selector = [];
//     var myStatus = [];
//     if(status === 'Work In Progress'){
//         myStatus = ['Work Started','Work In Progress'];
//     }else if(status === "Resolved"){
//         myStatus = ['Resolved','Closed'];
//         selector.push({ status: { $elemMatch: { allocatedTo: req.params.technician_id,value:{$in:['Resolved','Closed']}}} })
//     }else if(status === "Allocated"){
//         myStatus = ['Allocated','Assignee Accepted','Reopen'];
//     }else{
//         myStatus = [status];
//     }
//     Tickets.find({ status: { $elemMatch: { allocatedTo: req.params.technician_id }}})
//         .populate('projectLocation_id')
//         .populate('equipmentLocation_id')
//         .populate('contactPerson_id')
//         .populate({ path: 'status.statusBy', model: 'users', select: {'profile.fullName':1,'profile.mobile':1} })
//         .sort({createdAt: -1})
//         .exec()
//         .then(tickets=>{
//             if(status === "All"){
//                 res.status(200).json(tickets);
//              }else{ 
//                 var returnArray = [];
//                 for (var i = tickets.length - 1; i >= 0; i--) {
//                     console.log("Inside for");
//                     if((tickets[i].statusValue === "Resolved" || tickets[i].statusValue === "Closed") && status=== "Allocated"){
//                        console.log("Not add");
//                     }else if((tickets[i].statusValue === "Reopen") && status=== "Allocated"){
//                         returnArray.push(tickets[i]);
//                     }else if((tickets[i].statusValue === "Resolved" || tickets[i].statusValue === "Closed") && status=== "Resolved"){
//                         returnArray.push(tickets[i]);
//                     }else{
//                         var myStatusArray = [];
//                         for (var j = tickets[i].status.length - 1; j >= 0; j--) {
//                             if(String(tickets[i].status[j].allocatedTo) === String(req.params.technician_id)){
//                                 myStatusArray.push(tickets[i].status[j]);
//                             }   
//                         }
//                         for (var k = myStatus.length - 1; k >= 0; k--) {
//                             if(myStatus[k] === myStatusArray[0].value){
//                                 console.log("Inside else");
//                                 returnArray.push(tickets[i]);
//                             }
//                         }
//                     }
//                 }
//                 if(i < tickets.length){
//                     res.status(200).json(returnArray);
//                 }
//             }    
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };


exports.technician_tickets_list = (req,res,next)=>{
    var status = req.params.status;
    var selector = [];
    var myStatus = [];
    if(status === 'Work In Progress'){
        myStatus = ['Work Started','Work In Progress'];
    }else if(status === "Resolved"){
        myStatus = ['Resolved','Closed'];
        selector.push({ status: { $elemMatch: { allocatedTo: req.params.technician_id,value:{$in:['Resolved','Closed']}}} })
    }else if(status === "Allocated"){
        myStatus = ['Allocated','Assignee Accepted','Reopen'];
    }else{
        myStatus = [status];
    }
    Tickets.find({ status: { $elemMatch: { allocatedTo: req.params.technician_id }},"statusValue":{ "$not": {"$regex": "Deleted", $options: "i"}}})
        .populate('projectLocation_id')
        .populate('equipmentLocation_id')
        .populate('contactPerson_id')
        .populate({ path: 'status.statusBy', model: 'users', select: {'profile.fullName':1,'profile.mobile':1} })
        .sort({createdAt: -1})
        .exec()
        .then(tickets=>{
            if(status === "All"){
                res.status(200).json(tickets);
             }else{ 
                var returnArray = [];
                for (var i = tickets.length - 1; i >= 0; i--) {
                    var ticketStatus = tickets[i].status.slice().reverse().find((elem)=>{return String(elem.allocatedTo) === String(req.params.technician_id)})
                    if((tickets[i].statusValue === "Resolved" || tickets[i].statusValue === "Closed") && status=== "Allocated"){
                        console.log("Don't Push");
                    }else if((tickets[i].statusValue === "Reopen") && status=== "Allocated" && ticketStatus.value!=="Assignee Rejected"){
                         returnArray.push(tickets[i]);
                    }else if((tickets[i].statusValue === "Resolved" || tickets[i].statusValue === "Closed") && status=== "Resolved" && ticketStatus.value!=="Assignee Rejected"){
                        returnArray.push(tickets[i]);
                    }else if(tickets[i].statusValue === "Reopen" && status==="Resolved"){
                        console.log("Don't Push");
                    }else{
                        if(myStatus.includes(ticketStatus.value)){
                            returnArray.push(tickets[i]);
                        }
                    }  
                }
                if(i < tickets.length){
                    res.status(200).json(returnArray);
                }
            }    
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 

exports.technician_dashboard_count = (req,res,next)=>{
    Tickets.find({status: { $elemMatch: { allocatedTo: req.params.technician_id}},"statusValue":{ "$not": {"$regex": "Deleted", $options: "i"}}},{status:1,statusValue:1})
        .exec()
        .then(tickets=>{
             if(tickets){
                main();
                async function main(){
                    var totalCount = tickets.length;
                    var completedCount = await getCount(tickets, req.params.technician_id,['Resolved','Closed'],"Resolved");
                    var newCount = await getCount(tickets, req.params.technician_id,['Allocated','Assignee Accepted','Reopen'],'Allocated');
                    var rejectedCount = await getCount(tickets, req.params.technician_id,["Assignee Rejected"],'Assignee Rejected');
                    var wipCount = await getCount(tickets, req.params.technician_id,['Work Started','Work In Progress'],'Work In Progress');
                    res.status(200).json({newCount,wipCount,completedCount,rejectedCount,totalCount});
                }      
            }else{
                res.status(404).json({message:'Ticket Details not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 



function getCount(tickets,technician_id,myStatus,status){
   return new Promise(function(resolve,reject){
        var returnArray = [];
        for (var i = tickets.length - 1; i >= 0; i--) {
            var ticketStatus = tickets[i].status.slice().reverse().find((elem)=>{return String(elem.allocatedTo) === String(technician_id)})
            if((tickets[i].statusValue === "Resolved" || tickets[i].statusValue === "Closed") && status=== "Allocated"){
                console.log("Don't Push");
            }else if((tickets[i].statusValue === "Resolved" || tickets[i].statusValue === "Closed") && status=== "Resolved" && ticketStatus.value!=="Assignee Rejected"){
                returnArray.push(tickets[i]);
            }else if((tickets[i].statusValue === "Reopen") && status=== "Allocated" && ticketStatus.value!=="Assignee Rejected"){
                    returnArray.push(tickets[i]);
            }else if(tickets[i].statusValue === "Reopen" && status==="Resolved"){
                console.log("Don't Push");
            }else{
                if(myStatus.includes(ticketStatus.value)){
                    returnArray.push(tickets[i]);
                }
            }  
        }
        if(i < tickets.length){
            console.log("returnArray",returnArray);
            resolve(returnArray.length);
        }
    });
}

exports.client_dashboard_count = (req,res,next)=>{
    Tickets.find({client_id : req.params.client_id,statusValue:"Closed"},{status:1})
        .countDocuments()
        .exec()
        .then(closedCount=>{
            Tickets.find({client_id :req.params.client_id,statusValue:{$in:['New','Acknowledged','Reopen','Paid Service Request','Paid Service Rejected','Paid Service Approved','Allocated','Assignee Accepted','Assignee Rejected','Work Started','Work In Progress','Resolved']}},{status:1})
            .countDocuments()
            .exec()
            .then(pendingCount=>{
                res.status(200).json({closedCount,pendingCount});
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });     
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 

exports.fetch_one = (req,res,next)=>{
    Tickets.findOne({"_id":req.params.ticket_id})
        .populate('projectLocation_id')
        .populate('equipmentLocation_id')
        .populate({ path: 'status.statusBy', model: 'users', select: {'profile.fullName':1} })
        .populate({ path: 'status.allocatedTo', model: 'personmasters', select: {'firstName':1,lastName:1,type:1,contactNo:1}})
        .exec()
        .then(tickets=>{
             res.status(200).json(tickets);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.update_Ticket = (req,res,next)=>{
    Tickets.updateOne(
        { "_id":req.params.ticket_id},    
        {
        $set:{
                clientName             :    req.body.clientName,
                client_id              :    req.body.client_id,
                contactPerson          :    req.body.contactPerson,
                contactPerson_id       :    req.body.contactPerson_id,
                projectLocationName  :    req.body.projectLocationName,
                projectLocation_id   :    req.body.projectLocation_id,
                equipmentLocationName     :    req.body.equipmentLocationName,
                equipmentLocation_id      :    req.body.equipmentLocation_id,
                department             :    req.body.department,
                project                :    req.body.project,
                site                   :    req.body.site,
                typeOfIssue            :    req.body.typeOfIssue,
                description            :    req.body.description,
                images                 :    req.body.images,
                videos                 :    req.body.videos,
             }
            }
        )
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json("TICKET_DETAILS_UPDATED");
            }else{
                res.status(401).json("TICKET_DETAILS_NOT_UPDATED");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 

exports.temp_delete_Ticket = (req,res,next)=>{
    Tickets.findOne({"_id":req.params.ticket_id})
        .exec()
        .then(data=>{
             Tickets.updateOne(
                {"_id":req.params.ticket_id},
                {
                    $set: {statusValue:"Deleted-"+data.statusValue}
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified === 1){
                    res.status(200).json("TICKET_DELETED");
                }else{
                    res.status(200).json("TICKET_NOT_DELETED");
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_deleted_tickets = (req,res,next)=>{
    Tickets.find({"statusValue":{"$regex": "Deleted", $options: "i"}})
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

exports.permanent_delete_Ticket = (req,res,next)=>{
    Tickets.deleteOne({"_id":req.params.ticket_id})
        .exec()
        .then(data=>{
            if(data.deletedCount === 1){
                res.status(200).json("TICKET_DELETED");
            }else{
                res.status(200).json("TICKETq_NOT_DELETED");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.restore_delete_Ticket = (req,res,next)=>{
    Tickets.findOne({"_id":req.params.ticket_id})
    .exec()
    .then(data=>{
         var status = data.statusValue.split("-")[1];
         Tickets.updateOne(
            {"_id":req.params.ticket_id},
            {
                $set: {statusValue:status}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified === 1){
                res.status(200).json("TICKET_RESTORE");
            }else{
                res.status(200).json("TICKET_NOT_RESTORE");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
     });
};



exports.updateStatus = (req,res,next)=>{
    console.log("req.body",req.body)
    Tickets.findOne({_id:req.body.ticket_id})
    .exec()
    .then(ticket=>{
        var statusArray = ticket.status;
        var status = req.body.status.value; // User send from mobile app
        var reopenIndex =statusArray.map(el => el.value).lastIndexOf("Reopen");
        if(reopenIndex > 0){
            var afterReopenArray = [];
            for (var index = reopenIndex+1; index < statusArray.length; index++) {
                afterReopenArray.push(statusArray[index])
            }
            if(index >=  statusArray.length){
                var foundArray = afterReopenArray.filter(a=>a.value === status);
                var afterReopenAccepted = afterReopenArray.filter(a=>a.value === "Assignee Accepted");
                if(status === "Assignee Accepted" || status === "Assignee Rejected"){
                    var foundAlreadyArray = afterReopenArray.filter(a=> a.value === "Work Started"|| a.value === "Work In Progress" || a.value === "Resolved");
                    if(foundAlreadyArray.length > 0){
                        status = ticket.statusValue
                    }
                }else if(status === "Work Started" && foundArray.length > 0){
                    status = ticket.statusValue
                }else if(status=== "Work In Progress" && foundArray.length > 0){
                    status = ticket.statusValue
                }else if(status === "Resolved" && foundArray.length + 1  !== afterReopenAccepted.length){
                        status = ticket.statusValue;
                }
            }   
        }else{
            var foundArray = statusArray.filter(a=>a.value === status);
            var accepted = statusArray.filter(a=>a.value === "Assignee Accepted");
             if(status === "Assignee Accepted" || status === "Assignee Rejected"){
                var foundAlreadyArray = statusArray.filter(a=> a.value === "Work Started"|| a.value === "Work In Progress" || a.value === "Resolved");
                if(foundAlreadyArray.length > 0){
                    status = ticket.statusValue
                }
            }else if(status === "Work Started" && foundArray.length > 0){
                status = ticket.statusValue
            }else if(status=== "Work In Progress" && foundArray.length > 0){
                status = ticket.statusValue
            }else if(status === "Resolved" && foundArray.length + 1  !== accepted.length){
                    status = ticket.statusValue;
            }
        }
        var selector = {
            'statusValue' : status
        }
        if(req.body.cost){
            selector.cost = req.body.cost;
        }
        console.log("selector",selector);
        Tickets.updateOne(
            { _id:req.body.ticket_id },  
            {
                $push:  {  
                            "status"   : req.body.status,
                        },
                $set:  selector
            }
        )
        .exec()
        .then(data=>{
            console.log("data",data);
            if(data.nModified == 1){
                Tickets.updateOne(
                { _id:req.body.ticket_id},
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
        console.log("err",err);
    })
}

exports.reopenTicket = (req,res,next)=>{
    console.log("req.body",req.body)
    var {ticket_id,status} =req.body;
    Tickets.findOne({_id:ticket_id})
    .exec()
    .then(ticket=>{
        var statusArray = ticket.status;
        var accepted = statusArray.filter(a=>a.value === "Assignee Accepted");
        var uniqueAccepted = [ ...new Map(accepted.map(item => [String(item.allocatedTo), item])).values()];
        console.log("uniqueAccepted",uniqueAccepted);
        console.log("Accepted",accepted);
        // console.log("uniqueAccepted",uniqueAccepted);
        var techStatusArray = [];
        for (var i = 0; i < uniqueAccepted.length; i++) {
           techStatusArray.push({
                value    : status.value,
                statusBy : status.statusBy,
                remark   : status.remark,
                statusAt : status.statusAt,
                images   : status.images,
                allocatedTo : uniqueAccepted[i].allocatedTo
             });
        }
        console.log("techStatusArray",techStatusArray);
        if(i>=uniqueAccepted.length){
            Tickets.updateOne(
                { _id:ticket_id },  
                {
                    $push:  {  
                                "status"   : techStatusArray,
                            },
                    $set:  {
                                statusValue:req.body.status.value,
                                is_type:"Reopen"
                            }
                }
            )
            .exec()
            .then(data=>{
                console.log("data",data);
                if(data.nModified == 1){
                    Tickets.updateOne(
                    { _id:req.body.ticket_id},
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
    })
    .catch(err=>{
        console.log("err",err);
    })
}


exports.updateComment = (req,res,next)=>{
        Tickets.updateOne(
            { _id:ticket_id },  
            {
                $push:  {  
                            "commentArray"   : comment,
                        }
            }
        )
        .exec()
        .then(data=>{
            console.log("data",data);
            if(data.nModified == 1){
                Tickets.updateOne(
                { _id:req.body.ticket_id},
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

// exports.updateStatus = (req,res,next)=>{
//     console.log("req.body",req.body)
//     Tickets.updateOne(
//         { _id:req.body.ticket_id },  
//         {
//             $push:  {  
//                         "status"   : req.body.status,
//                     },
//             $set:  {
//                         'statusValue' : req.body.status.value,
//                     },
//         }
//     )
//     .exec()
//     .then(data=>{
//         console.log("data",data);
//         if(data.nModified == 1){
//             Tickets.updateOne(
//             { _id:req.body.ticket_id},
//             {
//                 $push:  { 'updateLog' : [{  updatedAt      : new Date(),
//                                             updatedBy      : req.body.updatedBy
//                                         }]
//                         }
//             } )
//             .exec()
//             .then(data=>{
//                 res.status(200).json({ updated : true });
//             })
//         }else{
//             res.status(200).json({ updated : false });
//         }
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({ error: err });
//     });
// }



exports.serviceRequest = (req,res,next)=>{
    console.log("req.body",req.body)
    Tickets.updateOne(
        { _id:req.body.ticket_id },  
        {
            $set:  {
                        'serviceRequest' : req.body.serviceRequest,
                    },
        }
    )
    .exec()
    .then(data=>{
        console.log("data",data);
        if(data.nModified == 1){
            Tickets.updateOne(
            { _id:req.body.ticket_id},
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

exports.ticket_allocation = (req,res,next)=>{
    // Tickets.findOne({'_id':req.body.tickets_id,status:{'$elemMatch':{allocatedTo:{'$in':req.body.status.allocatedTo}}}})
    // .then(ticket=>{
    //     if(ticket){
    //         res.status(200).json({ updated : false, message:"Already Assigned" });
    //     }else{
            Tickets.findOne({'_id':req.body.tickets_id})
            .then(ticket=>{
                var allocated = ticket.status.filter(a=> a.allocatedTo);
                var myStatusArray = allocated.filter(a=> String(a.allocatedTo._id) === String(req.body.status.allocatedTo));
                console.log("myStatusArray",myStatusArray);
                if(myStatusArray && myStatusArray.length > 0){
                    var myStatus = myStatusArray[myStatusArray.length-1].value; 
                    if(myStatus!=="Assignee Rejected"){
                        res.status(200).json({ updated : false, message:"Already Assigned" });
                    }
                }
                var statusArray = ticket.status;
                var status = req.body.status.value;
                var foundArray = ticket.status.filter(a=>a.value === status);
                if(status === "Work Started" && foundArray.length > 0){
                    status = ticket.statusValue
                }else if(status=== "Work In Progress" && foundArray.length > 0){
                    status = ticket.statusValue
                }else if(status === "Resolved" && foundArray.length + 1  !== accepted.length){
                     status = ticket.statusValue;
                }else if(status === "Allocated" || status === "Assignee Accepted" || status === "Assignee Rejected"){
                    foundArray = statusArray.filter(a=> a.value === "Work Started"|| a.value === "Work In Progress" || a.value === "Resolved");
                    if(foundArray.length > 0){
                       status = ticket.statusValue
                    }
                }
                var selector = {
                    'statusValue' : status
                }  
                console.log("selector",selector) 
                Tickets.update(
                    { _id: { $in: req.body.tickets_id } },  
                    {
                        $push:  {  
                                    "status"      : req.body.status,
                                },
                        $set:  selector,
                    },
                    {multi: true}
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        Tickets.updateOne(
                        { _id:req.body.ticket_id},
                        {
                            $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                        updatedBy      : req.body.updatedBy
                                                    }]
                                    }
                        } )
                        .exec()
                        .then(data=>{
                            res.status(200).json({ updated : true, message: "Ticket assigned to technician successfully!" });
                        })
                    }else{
                        res.status(200).json({ updated : false, message:"Not Assigned" });
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({ error: err });
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({ error: err });
            });   
        // }
    // })
    // .catch(err =>{
    //     console.log(err);
    //     res.status(500).json({ error: err });
    // });
   
}





exports.pagination_count = (req,res,next)=>{
    var selector = [];
    console.log("req.body",req.body);
    var { startRange, limitRange, ticketId, client_id, issue, status, technician_id, searchText,date } = req.body;
    if(client_id !== ""){
        selector.push({"client_id" : client_id }) ;
    }
    if(searchText !== ""){
        var searchArray = [];
        searchArray.push({"ticketId"                : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"department"              : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"project"                 : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"site"                    : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"projectLocationName"   : {"$regex": searchText, $options: "i"}});      
        searchArray.push({"equipmentLocationName"      : {"$regex": searchText, $options: "i"}});      
        selector.push({$or : searchArray });
    }
    if(status && status.length > 0){
        selector.push({'statusValue':{$in:status}})
    }
    if(issue !== ''){
        selector.push({'typeOfIssue':issue})
    }
    if(ticketId !== ''){
        selector.push({'ticketId':ticketId})
    }
    if(date !== ''){
        selector.push({'createdAtStr':date})
    }
    if(technician_id !== ''){
        selector.push({ status: { $elemMatch: { allocatedTo: technician_id} }})
    }
    Tickets.find({ $and : selector})
        .countDocuments()
        .exec()
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

exports.total_count = (req,res,next)=>{
    Tickets.find({statusValue:{$not:{"$regex": "Deleted", $options: "i"}}})
        .countDocuments()
        .exec()
        .then(totalcount=>{
            Tickets.find({statusValue:"Closed"})
                .countDocuments()
                .exec()
                .then(closecount=>{
                    var opencount = totalcount - closecount;
                    res.status(200).json({totalcount,opencount,closecount}); 
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 

exports.get_count = (req,res,next)=>{
    var selector ={};
    if(req.params.status === "open"){
        selector ={statusValue:{$nin:"Closed"}}
    }
    console.log("selector count=>",selector);
    Tickets.find(selector)
        .countDocuments()
        .exec()
        .then(count=>{
            console.log("count",count);
           res.status(200).json({count:count}); 
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 


exports.tickets_status_wise = (req,res,next) => {
    Tickets.find({},{statusValue:1,_id:0})
    .exec()
    .then(data=>{
        var statusArray = _.uniq(data,x=>x.statusValue).map(a=>{return({name:a.statusValue,totalTickets:0})});
        for (var i = 0; i < statusArray.length; i++) {
            statusArray[i].totalTickets = 0;
            for (var j = 0; j < data.length; j++) {
                if(statusArray[i].name === data[j].statusValue){
                    statusArray[i].totalTickets+=1;
                }
            }
        }
        if(i >= statusArray.length){
            res.status(200).json(statusArray); 
        }
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
}

exports.client_wise_tickets = (req,res,next) => {
    Tickets.find({},{clientName:1})
    .exec()
    .then(data=>{
        var clientArray = _.uniq(data,x=>x.clientName).map(a=>{return({name:a.clientName,totalTickets:0})});
        for (var i = 0; i < clientArray.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if(clientArray[i].name === data[j].clientName){
                    clientArray[i].totalTickets+=1;
                }
            }
        }
        if(i >= clientArray.length){
            console.log("clientArray",clientArray);
            res.status(200).json(clientArray); 
        }
    })
    .catch(err =>{
        console.log("err",err)
        res.status(500).json({ error: err });
    });
}

exports.month_wise_tickets = (req,res,next)=>{
    Tickets.aggregate([
        {$match:{'createdAt':{$gte : new Date(req.params.startDate), $lt : new Date(req.params.endDate) }}},
        {$group: {
            _id: {$month: "$createdAt"}, 
            numberoftickets: {$sum: 1} 
        }}
    ])
    .exec()
    .then(ticketDetails=>{
        console.log("ticketDetails",ticketDetails);
        var returnData = []
        var totalTickets = "" ;
        var dataArray = {};
        var month = "";
        var allMonths = [{"name":"Jan"}, 
                         {"name":"Feb"},
                         {"name":"Mar"},
                         {"name":"Apr"},
                         {"name":"May"},
                         {"name":"Jun"},
                         {"name":"Jul"},
                         {"name":"Aug"},
                         {"name":"Sep"},
                         {"name":"Oct"},
                         {"name":"Nov"},
                         {"name":"Dec"}];
        for(var i=0 ; i<ticketDetails.length ; i++){
            month = moment(ticketDetails[i]._id, 'M').format('MMM');
            totalTickets = ticketDetails[i].numberoftickets;
            dataArray={
                name : month,
                totalTickets : totalTickets,
            }
            returnData.push(dataArray)
            allMonths.map(function(data,index){
              if(data.name == month){
                  allMonths[index].totalTickets = totalTickets;
              }
            });   
        }//i

        res.status(200).json(allMonths);
    })
    .catch(err =>{
        console.log("err",err);
        res.status(500).json({ error: err });
    });
}


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