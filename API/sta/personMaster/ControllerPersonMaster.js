const mongoose = require("mongoose");

const PersonMaster = require('./ModelPersonMaster');
const VehicleDriverMapping = require('../../coreAdmin/vehicleDriverMapping/ModelVehicleDriverMapping.js');
var request = require('request-promise');
const NodeGeocoder = require('node-geocoder');//const gloabalVariable = require('./../../../nodemon');
var ObjectID = require('mongodb').ObjectID;
const FailedRecords = require('../../coreAdmin/failedRecords/ModelFailedRecords');
const DesignationMaster = require('../../coreAdmin/designationMaster/ModelDesignationMaster.js');
const DepartmentMaster = require('../../coreAdmin/departmentMaster/ModelDepartmentMaster.js');
const moment = require('moment');
const BookingMaster = require('../../coreAdmin/bookingMaster/ModelBookingMaster.js');
const EntityMaster = require('../entityMaster/ModelEntityMaster.js');
const SocialMediaMaster    = require('../socialMediaMaster/Model.js');
const FuelReibursement    = require('../fuelReimbursement/Model.js');
const VehicleMaster    = require('../vehicleMaster/Model.js');
// const VehicleMaster    = require('./Model.js');
const Users = require('../../coreAdmin/userManagement/ModelUsers.js');
const ProjectSetting    = require('../../coreAdmin/projectSettings/ModelProjectSettings.js');
const axios = require('axios');
const globalVariable= require("../../nodemon.js");
const bcrypt = require("bcrypt");

exports.insertPerson = (req, res, next) => {
    console.log("req.body",req.body);
    PersonMaster.find(
        {"firstName":req.body.firstName, "lastName": req.body.lastName,"email":req.body.email,"dob":req.body.dob})
        .exec()
        .then(async(data)=>{
            if(data.length > 0)
            {
            res.status(200).json({ duplicated : true });

            }else
            {
            const person = new PersonMaster({
            _id: new mongoose.Types.ObjectId(),
            company_Id: req.body.company_Id,
            companyID: req.body.companyID,
            workLocationId: req.body.workLocationId,
            workLocationLatLng : req.body.workLocationLatLng,
            companyName: req.body.companyName,
            type: req.body.type,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            DOB: req.body.DOB,
            gender: req.body.gender,
            contactNo: req.body.contactNo,
            altContactNo: req.body.altContactNo,
            profilePhoto: req.body.profilePhoto,
            email: req.body.email,
            whatsappNo: req.body.whatsappNo,
            designationId: req.body.designationId,
            departmentId: req.body.departmentId,
            employeeId: req.body.employeeId,
            loginCredential: req.body.loginCredential,
            workLocation: req.body.workLocation,
            branchCode: req.body.branchCode,
            badgeNumber: req.body.badgeNumber,
            address: req.body.address,
            vehicle:req.body.vehicle,
            workImages:req.body.workImages,
            socialMediaArray:req.body.socialMediaArray,
            fuelreimbursement_id:req.body.fuelreimbursement_id,
            home_office_distance: req.body.workLocationLatLng ? await getDistance(req.body.address,req.body.workLocationLatLng) : 0,
            // drivingLicense              : req.body.drivingLicense,
            // aadhar                      : req.body.aadhar,
            // identityProof               : req.body.identityProof,
            Documentarray: req.body.Documentarray,
            verification: req.body.verification,
            //voterID                     : req.body.voterID,
            //passport                    : req.body.passport,
            corporateId: req.body.corporateId,
            userId: req.body.userId,
            createdBy: req.body.createdBy,
            createdAt: new Date(),
            status: req.body.status,
        })
        person.save()
            .then(data => {
                res.status(200).json({ created: true, PersonId: data._id });
            })

            .catch(err => {
                console.log(err)
                res.status(500).json({ error: err });
            });

        }
        })
        .catch(err =>{
            console.log("err",err);
        });
    
};

function getDistance(home_address,workLocationLatLng){
    console.log("home_address",home_address);
    return new Promise((resolve,reject)=>{
        var origin       = home_address.latitude+","+home_address.longitude;
        var destination  = workLocationLatLng;
        ProjectSetting.findOne({type:'GOOGLE'},{googleapikey:1,_id:0})
        .then(res => {
            var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+origin+'&destinations='+destination+'&key='+res.googleapikey;
            axios.get(url)
            .then(result=>{
                console.log("ggogleapi=>",result.data.rows[0])
                if(result.data.rows.length > 0){
                    resolve(result.data.rows[0].elements[0]);
                }else{
                    resolve([]);
                }
            })
            .catch(error=>{
              console.log("error",error)
            })
        })
        .catch((error) =>{
            console.log("err",error)
        })
    })
}


function fetchPersonData(firstName,lastName,email,dob){
    return new Promise((resolve,reject)=>{
        PersonMaster.find(
        {"firstName":firstName, "lastName":lastName,"email":email,"dob":dob})
        .exec()
        .then(data=>{
            resolve(data)
        })
        .catch(err =>{
            reject(0)
        });
    })
}



exports.countPersons = (req, res, next) => {
    PersonMaster.find({ type: req.params.type }).count()
        .exec()
        .then(data => {
            res.status(200).json({ count: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.listPersons = (req, res, next) => {
    console.log("req.body",req.body);
    PersonMaster.aggregate([
        {
            $lookup:
            {
                from: "departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        },
        {
            $lookup:
            {
                from: "designationmasters",
                localField: "designationId",
                foreignField: "_id",
                as: "designation"
            }
        },
        { $match: { type: req.body.type, company_Id: ObjectID(req.body.company_Id) } }
    ])
        .sort({ createdAt: -1 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.singlePerson = (req, res, next) => {
    PersonMaster.findOne({ _id: req.params.personID })
    PersonMaster.aggregate([
        {
            $lookup:
            {
                from: "departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        },
        {
            $lookup:
            {
                from: "designationmasters",
                localField: "designationId",
                foreignField: "_id",
                as: "designation"
            }
        },
        
        { $match: { "_id": ObjectID(req.params.personID) } }
    ])
        .exec()
        .then(data => {
            res.status(200).json(data[0]);
        })
        .catch(err => {
            console.log("err",err);
            res.status(500).json({ error: err });
        });
};

exports.singlePersonByUserId = (req, res, next) => {
    // PersonMaster.findOne({ _id: req.params.personID })
    PersonMaster.aggregate([
        {
            $lookup:
            {
                from: "departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        },
        {
            $lookup:
            {
                from: "designationmasters",
                localField: "designationId",
                foreignField: "_id",
                as: "designation"
            }
        },
        {
            $lookup:
            {
                from: "entitymasters",
                localField: "company_Id",
                foreignField: "_id",
                as: "entity"
            }
        },
        { $match: { "userId": ObjectID(req.params.userID) } }
    ])
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};
exports.updatePersonStatus = (req, res, next) => {
    PersonMaster.updateOne(
        { _id: req.body.personID },
        {
            $set: {
                'status': req.body.status
            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                PersonMaster.updateOne(
                    { _id: req.body.personID },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.updatePerson = async(req, res, next) => {
    PersonMaster.updateOne(
        { _id: req.body.personID },
        {
            $set: {
                'company_Id': req.body.company_Id,
                'companyID': req.body.companyID,
                'workLocationId': req.body.workLocationId,
                'branchCode': req.body.branchCode,
                'companyName': req.body.companyName,
                'firstName': req.body.firstName,
                'middleName': req.body.middleName,
                'lastName': req.body.lastName,
                'workImages':req.body.workImages,
                'DOB': req.body.DOB,
                'gender': req.body.gender,
                'contactNo': req.body.contactNo,
                'altContactNo': req.body.altContactNo,
                'profilePhoto': req.body.profilePhoto,
                'email' : req.body.email,
                'whatsappNo': req.body.whatsappNo,
                'designationId': req.body.designationId,
                'departmentId': req.body.departmentId,
                'home_office_distance':await getDistance(req.body.address,req.body.workLocationLatLng),
                'employeeId': req.body.employeeId,
                'vehicle':req.body.vehicle,
                'fuelreimbursement_id':req.body.fuelreimbursement_id,
                'loginCredential': req.body.loginCredential,
                'workLocation': req.body.workLocation,
                "workLocationLatLng" : req.body.workLocationLatLng,
                'address': req.body.address,
                "Documentarray": req.body.Documentarray,
                "socialMediaArray":req.body.socialMediaArray,
            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                PersonMaster.updateOne(
                    { _id: req.body.packageID },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.deletePerson = (req, res, next) => {
    PersonMaster.deleteOne({ _id: req.params.personID })
        .exec()
        .then(data => {
            if (data.deletedCount === 1) {
                res.status(200).json({ deleted: true });
            } else {
                res.status(200).json({ deleted: false });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.deletePersonUsingUserID = (req, res, next) => {
    PersonMaster.deleteOne({ userId: req.params.user_id })
        .exec()
        .then(data => {
            if (data.deletedCount === 1) {
                res.status(200).json({ deleted: true });
            } else {
                res.status(200).json({ deleted: false });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.person_update_delete_status = (req, res, next) => {
    PersonMaster.findOne({ _id: req.body.personID_tobedeleted })
        .exec()
        .then(user => {
            if (user) {
                console.log("req.user==>",user);
                var newstatus = "";
                if (user.status === 'Active' || 'active') {
                    newstatus = 'deleted-Active';
                }
                if (user.status === 'Inactive' || 'blocked') {
                    newstatus = 'deleted-Inactive';
                }
                PersonMaster.updateOne(
                    { _id: req.body.personID_tobedeleted },
                    {
                        $set: {
                            status: newstatus,
                        },
                    }
                )
                    .exec()
                    .then(data => {
                        if (data.nModified == 1) {
                            PersonMaster.updateOne(
                                { _id: req.body.personID_tobedeleted },
                                {
                                    $push: {
                                        'statusLog': [{
                                            status: newstatus,
                                            updatedAt: new Date(),
                                            updatedBy: req.body.updatedBy,
                                        }]
                                    }
                                })
                                .exec()
                                .then(data => {
                                    res.status(200).json("USER_SOFT_DELETED");
                                })
                        } else {
                            res.status(200).json("USER_NOT_DELETED")
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
                res.status(200).json("User Not Found");
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.person_update_recover_status = (req, res, next) => {
    PersonMaster.findOne({ _id: req.body.personID_toberecover })
        .exec()
        .then(user => {
            if (user) {
                var newstatus = "";
                if (user.status === 'deleted-Active' || "deleted-active") {
                    newstatus = 'Active';
                }
                if (user.status === 'deleted-Inactive' || "deleted-blocked") {
                    newstatus = 'Inactive';
                }
                PersonMaster.updateOne(
                    { _id: req.body.personID_toberecover },
                    {
                        $set: {
                            status: newstatus,
                        },
                    }
                )
                    .exec()
                    .then(data => {
                        res.status(200).json(data);
                        if (data.nModified == 1) {
                            PersonMaster.updateOne(
                                { _id: req.body.personID_toberecover },
                                {
                                    $push: {
                                        'statusLog': [{
                                            status: newstatus,
                                            updatedAt: new Date(),
                                            updatedBy: req.body.updatedBy,
                                        }]
                                    }
                                })
                                .exec()
                                .then(data => {
                                    res.status(200).json(data);
                                    // res.status(200).json("USER_SOFT_DELETED");
                                })
                        } else {
                            res.status(200).json("USER_NOT_DELETED")
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
                res.status(200).json("User Not Found");
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
exports.filterPersons = (req, res, next) => {
    var selector = {};
    main();
    async function main(){
        for (var key in req.body) {
            if (key == 'departments' && req.body.departments.length > 0) {
               let objectIdArray = req.body.departments.map(s => mongoose.Types.ObjectId(s));
               selector.departmentId = {$in:objectIdArray};
            }
            if (key == 'designations' && req.body.designations.length > 0) {
                let objectIdArray = req.body.designations.map(s => mongoose.Types.ObjectId(s));
               selector.designationId = {$in:objectIdArray};
            }
            if (req.body.initial && req.body.initial != 'All') {
                selector.firstName = { $regex: "^" + req.body.initial, $options: "i" }
            }
            if (key == 'company_Id') {
                selector.company_Id = ObjectID(req.body.company_Id)
            }
        }
        console.log("selector",selector);
        selector.type = { $regex: req.body.type, $options: "i" }
        // PersonMaster.find(selector)
        PersonMaster.aggregate([
            {
                $lookup:
                {
                    from: "departmentmasters",
                    localField: "departmentId",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $lookup:
                {
                    from: "designationmasters",
                    localField: "designationId",
                    foreignField: "_id",
                    as: "designation"
                }
            },
            { $match: selector}
        ])
            .sort({ createdAt: -1 })
            .exec()
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};

exports.searchPerson = (req, res, next) => {
    var selector = {};
    selector["$and"] = [];
    selector["$and"].push({ type: { $regex: req.params.type, $options: "i" } })
    if (req.params.company_Id !== "All") {
        selector["$and"].push({ "company_Id": req.params.company_Id })
    }
    selector['$or'] = [];

    selector["$or"].push({ firstName: { $regex: req.params.str, $options: "i" } })
    selector["$or"].push({ middleName: { $regex: req.params.str, $options: "i" } })
    selector["$or"].push({ lastName: { $regex: req.params.str, $options: "i" } })
    selector["$or"].push({ gender: { $regex: req.params.str, $options: "i" } })
    selector["$or"].push({ designation: { $regex: req.params.str, $options: "i" } })
    selector["$or"].push({ department: { $regex: req.params.str, $options: "i" } })
    selector["$or"].push({ employeeId: { $regex: req.params.str, $options: "i" } })
    PersonMaster.find(selector)
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

var fetchEntities = async (companyID) => {
    return new Promise(function (resolve, reject) {
        EntityMaster.find({ companyID: companyID })
            .exec()
            .then(data => {
                console.log("data in person entity---",data);
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

var createLoginUser = async (userDetails) => {
    return new Promise(function (resolve, reject) {
        var username = "EMAIL";
        var mobNumber = userDetails.mobNumber;

        if(userDetails.username){
            if(userDetails.username === "EMAIL"){
                username = "EMAIL";
            }else if(userDetails.username === "MOBILE"){
                username = "MOBILE";
            }
        }
        if( username =="EMAIL"){
            Users.find({ "username": userDetails.email.toLowerCase() })
            .exec()
            .then(user => {
                console.log("User",user);

                if (user.length > 0) {
                    resolve('duplicate');
                } else {
                    bcrypt.hash(userDetails.pwd, 10, (err, hash) => {
                        if (err) {
                            reject(err);
                        } else {
                            const user = new Users({
                                _id: new mongoose.Types.ObjectId(),
                                createdAt: new Date,
                                services: {
                                    password: {
                                        bcrypt: hash

                                    },
                                },
                                username: userDetails.email.toLowerCase(),
                                profile: {
                                    firstname: userDetails.firstname,
                                    lastname: userDetails.lastname,
                                    fullName: userDetails.firstname + ' ' + userDetails.lastname,
                                    email: userDetails.email.toLowerCase(),
                                    mobile: userDetails.mobNumber,
                                    companyID: userDetails.companyID,
                                    workLocation: userDetails.workLocation ? userDetails.workLocation:"",
                                    passwordreset: false,
                                    companyName: userDetails.companyName,
                                    department  : userDetails.department ? userDetails.department :"",
                                    designation : userDetails.designation ? userDetails.designation:"",
                                    city: userDetails.cityName ? userDetails.cityName : "",
                                    states: userDetails.states ? userDetails.states :"",
                                    status: userDetails.status ? userDetails.status : "Block",
                                    createdBy: userDetails.createdBy,
                                    createdAt: new Date(),
                                },
                                roles: userDetails.role,
                            });
                             console.log("roles==>",user.roles);  
                            if (!userDetails.firstname) {
                                user.profile.fullName = userDetails.fullName;
                            }
                            user.save()
                            .then(result => {
                                resolve(result._id);
                            })
                            .catch(err => {
                                reject(err);
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed which finding the User",
                    error: err
                });
            });
        }else{
             Users.find({ "username": mobNumber })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    // return res.status(200).json({
                    //     message: 'Mobile number already exists.'
                    // });
                     resolve('duplicate');

                } else {
                    bcrypt.hash(userDetails.pwd, 10, (err, hash) => {
                        if (err) {
                            // return res.status(500).json({
                            //     message: "Failed to match the password",
                            //     error: err
                            // });
                            reject(err)
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                createdAt: new Date,
                                services: {
                                    password: {
                                        bcrypt: hash

                                    },
                                },
                                username: mobNumber,
                                profile:
                                {
                                    firstname: userDetails.firstname,
                                    lastname: userDetails.lastname,
                                    fullName: userDetails.firstname + ' ' + userDetails.lastname,
                                    workLocation: userDetails.workLocation ? userDetails.workLocation:"",
                                    email: userDetails.email ? userDetails.email :"",
                                    mobile: mobNumber,
                                    passwordreset: false,
                                    companyID: userDetails.companyID,
                                    companyName:userDetails.companyName,
                                    createdAt: new Date(),
                                    status: userDetails.status ? userDetails.status : "Block",
                                    createdBy: userDetails.createdBy,
                                },
                                roles: userDetails.role
                            });
                            if (!userDetails.firstname) {
                                user.profile.fullName = userDetails.fullName;
                            }
                            user.save()
                            .then(result => {
                                resolve(result._id)
                            })
                            .catch(err => {
                                reject(err)
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                reject(err)
            });
            
        }
    });
};

function getNextSequence() {
    return new Promise((resolve,reject)=>{
    PersonMaster.findOne().sort({companyID:-1})       
        .exec()
        .then(data=>{
            if (data) { 
                var seq = data.companyID;
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
        console.log("geocoder",geocoder);

        geocoder.geocode('address', function(err, res) {
          resolve(res)
        });

    })
    .catch((error)=>{})
    })
                // const res = await geocoder.geocode('29 champs elysée paris');
}

exports.bulkUploadEmployee = (req, res, next) => {
    var employees = req.body.data;
    var validData = [];
    var companyData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = '';
    var completeAddress = '';
    var workLocationIdFile = '';
    var workLocationValue = '';
    var getcompanyID  = '';
    var UMuserID = '';
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    processData();
    async function processData() {

        var departments   = await fetchDepartments();
        var designations  = await fetchDesignations();
        var vehicles      = await fetchVehicles();
       
        console.log("SocialMediaData----",SocialMediaData);

        for (var k = 0; k < employees.length; k++) {
            if (employees[k].firstName == '-') {
                remark += "firstName not found, ";
            }
            if (employees[k].lastName == '-') {
                remark += "lastName not found, ";
            }
            if (employees[k].DOB == '-') {
                remark += "DOB not found, ";
            }
            if (employees[k].gender == '-') {
                remark += "gender not found, ";
            }
            if (employees[k].contactNo == '-') {
                remark += "contactNo not found, ";
            }
            if (employees[k].workLocation == '-') {
                remark += "workLocation not found, ";
            }
            //--------- Employee Specific-----------
            if (employees[k].department == '-') {
                remark += "department not found, ";
            }
            if (employees[k].designation == '-') {
                remark += "designation not found, ";
            }
            if (employees[k].employeeId == '-') {
                remark += "employeeId not found, ";
            }
            if (employees[k].email == '-') {
                remark += "email not found, ";
            }
            //-------------------------------//
            if (employees[k].companyID == '-') {
                remark += "companyID not found, ";
            }
            if (employees[k].companyName == '-') {
                remark += "companyName not found, ";
            }
            if (employees[k].loginCredential == '-') {
                remark += "LoginCredential not found, ";
            }
            if (employees[k].vehicle == '-') {
                remark += "Vehicle not found, ";
            }
             console.log("employees[k].companyID",employees[k].companyID);
             if(employees[k].companyID){
                getcompanyID = employees[k].companyID;
            }else{
                getcompanyID = req.body.reqdata.companyID;
            }
            companyData  = await fetchEntities(getcompanyID);
            console.log("companyData--------------",companyData);
            if(companyData[0]){
                if(companyData[0].locations){
                    for(j=0;j<companyData[0].locations.length;j++)
                         // console.log("companyData[0].locations[j].pincode",companyData[0].locations[j].pincode);
                    {
                        if(companyData[0].locations[j].pincode == employees[k].workLocationPincode )
                        {
                            workLocationValue = employees[k].workLocation; 
                            workLocationIdFile = companyData[0].locations[j]._id;
                            workLocation =companyData[0].locations[j].locationType + "-" + companyData[0].locations[j].city + "-" + companyData[0].locations[j].stateCode + "-" + companyData[0].locations[j].countryCode;

                            console.log("workLocation>>>>>>>>>>>>>>>",workLocation);
                            break;
                        }else{
                            workLocationValue = "NOT_FOUND";
                            break;
                        }
                    }
                    if(workLocationValue === "NOT_FOUND")
                    {
                        remark += "workLocation does not exist";
                        invalidObjects = employees[k];
                        invalidObjects.failedRemark = remark;
                        invalidData.push(invalidObjects);
                        console.log("invalidData",invalidData);
                    }
                }
                 
                var createLogin = employees[k].loginCredential && employees[k].loginCredential == "-" ?"No" :employees[k].loginCredential;
                if(createLogin == "Yes"){
                    if(req.body.reqdata.type == "employee" && employees[k].email)
                    {
                        var userDetails = {
                            firstname     : employees[k].firstName,
                            lastname      : employees[k].lastName,
                            mobNumber     : employees[k].contactNo,
                            email         : employees[k].email,
                            companyID     : validData.companyID,
                            companyName   : companyData[0].companyName,
                            designation   : employees[k].designation,
                            department    : employees[k].department,
                            pwd           : "welcome123",
                            role          : [req.body.reqdata.type],
                            status        : 'blocked',
                            username      : "EMAIL",
                            createdBy        : req.body.reqdata.createdBy,
                            "emailSubject"    : "Email Verification",
                            "emailContent"    : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
                        }
                    }else if(req.body.reqdata.type == "driver"){
                        var userDetails = {
                            firstname     : employees[k].firstName,
                            lastname      : employees[k].lastName,
                            mobNumber     : employees[k].contactNo,
                            email         : employees[k].email,
                            companyID     : validData.companyID,
                            companyName   : companyData[0].companyName,
                            pwd           : "welcome123",
                            role          : [req.body.reqdata.type],
                            username      : "MOBILE",
                            status        : 'blocked',
                            createdBy        : req.body.reqdata.createdBy,
                            "emailSubject"    : "Email Verification",
                            "emailContent"    : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
                        }

                    }
                    UMuserID = await createLoginUser(userDetails);
                    console.log("UMuserID>>>>>",UMuserID);

                    if(UMuserID === "duplicate")
                    {
                        remark += "Employee already exists in User Management.";
                        invalidObjects = employees[k];
                        invalidObjects.failedRemark = remark;
                        invalidData.push(invalidObjects);
                    }
                    else{
                        var userID =UMuserID;
                    }

                }


                if (remark == '') {
                       var departmentId,designationId,socialMediId,vehicleId,vehicleType;
                         var departmentExists = departments.filter((data) => {
                            if (data.department == employees[k].department) {
                                return data;
                            }
                           
                        })
                        if (departmentExists.length > 0) {
                            departmentId = departmentExists[0]._id;
                            
                        } else {
                            if(employees[k].department != '-'){
                            departmentId = await insertDepartment(employees[k].department,req.body.reqdata.createdBy);
                           }
                          }

                      var vehicleExists = vehicles.filter((data) => {
                            if (data.vehicle == employees[k].vehicle) {
                                return data;
                            }
                           
                        })
                      console.log("vehicleExists------",vehicleExists);
                        if (vehicleExists.length > 0) {
                            vehicleId = vehicleExists[0]._id;
                            vehicleType = vehicleExists[0].vehicleType;
                            
                        } else {
                            if(employees[k].vehicle != '-'){
                            vehicleType = await insertVehicle(employees[k].vehicle,req.body.reqdata.createdBy);
                           }
                          }

                          console.log("vehicleId---------",vehicleId);


                        var designationExists = designations.filter((data) => {
                            if (data.designation == employees[k].designation) {
                                return data;
                            }
                           
                        })

                        if (designationExists.length > 0) {
                            designationId = designationExists[0]._id;
                            
                        } else {
                            if(employees[k].designation != '-'){
                            designationId = await insertDesignation(employees[k].designation,req.body.reqdata.createdBy);
                           }
                          }
                         var SocialMediaData = await fetchSocialMediaData(employees[k].socialMediaName);
                         var socialMeadiaExists = SocialMediaData.filter((data) => {
                            if (data.socialMedia == employees[k].socialMediaName) {
                                return data;
                            }
                           
                        })
                        if (socialMeadiaExists.length > 0) {
                            socialMediId = socialMeadiaExists[0]._id;
                            socialMediaName = socialMeadiaExists[0].socialMedia;
                            socialMediaicon = socialMeadiaExists[0].iconUrl;
                            socialMediaurl = socialMeadiaExists[0].iconUrl;
                            console.log("socialMediId====",socialMediId);
                            
                        var socialMediaArray={
                            social_id:socialMediId,
                            name:socialMediaName,
                            url :employees[k].SocialMediaURL,
                            icon :socialMediaurl,
                        }

                    var allEmployees = await fetchAllEmployees(employees[k].email);
                    var employeeExists = allEmployees.filter((data) => {
                        if ( data.email == employees[k].email) {
                            return data;
                        }
                    })
                    if (employeeExists.length == 0) {
                        var DOB;
                        if (typeof employees[k].DOB == 'number') {
                            DOB = moment(new Date(Math.round((employees[k].DOB - 25569) * 86400 * 1000))).format("YYYY-MM-DD");
                        } else {
                            DOB = moment(new Date(employees[k].DOB)).format("YYYY-MM-DD")
                        }
                            var latlong = await getLatLong(employees[k].addressLine1); 
                            var lat=latlong[0].latitude;
                            var lng=latlong[0].longitude;
                            var address = [

                               {
                                     addressLine1 : employees[k].addressLine1,
                                     addressLine2 : "",
                                     landmark     : "",
                                     pincode      : employees[k].pincode,
                                     city         : employees[k].city,
                                     state        : employees[k].state,
                                     district     : employees[k].district,
                                     latitude     : lat,
                                     longitude    : lng
                                }
                            ]

                        console.log("UMuserID before person---",UMuserID); 
                        const person = new PersonMaster({

                            _id            :  new mongoose.Types.ObjectId(),
                            type           : req.body.reqdata.type,
                            entityType     : req.body.reqdata.entityType,
                            DOB            : DOB,
                            company_Id     : companyData[0]._id,
                            companyName    : companyData[0].companyName,
                            departmentId   : departmentId,
                            designationId  : designationId,
                            vehicle        : vehicleType,
                            gender         :employees[k].gender,
                            workLocationId : workLocationIdFile,
                            workLocation   : workLocation,
                            profileStatus  : "New",
                            status         : "Active",
                            userId         : UMuserID,
                            loginCredential: createLogin,
                            companyID      : companyData[0].companyID,
                            address        : address,
                            contactNo      : 91  + "" + employees[k].contactNo,
                            email          : employees[k].email,
                            firstName      : employees[k].firstName,
                            lastName       : employees[k].lastName,
                            middleName       : employees[k].middleName,
                            socialMediaArray :socialMediaArray,
                            fileName         :req.body.fileName,
                            whatsappNo       : 91  + "" + employees[k].whatsappNo,
                            employeeId       :employees[k].employeeId,
                            createdBy        :req.body.reqdata.createdBy,
                            createdAt        :new Date(),
                            
                                    
                            })
                         console.log("person data>>>>>>>>>>>",person.vehicle);

                         person.save()
                            .then(data => {
                                console.log("person data",data);
                                // res.status(200).json({ created: true, PersonId: data._id });
                            })

                            .catch(err => {
                                console.log(err)
                                res.status(500).json({ error: err });
                            });

                    } else {

                        remark += "Employee already exists.";
                       // console.log("remark-->",remark);
                        invalidObjects = employees[k];
                        invalidObjects.failedRemark = remark;
                        console.log("line 1070>>>>>>>>>>>>>>>>>",invalidObjects)
                        invalidData.push(invalidObjects);
                    }
                    } else {
                           
                        remark += "Social Media Does NOt exists.";
                       // console.log("remark-->",remark);
                        invalidObjects = employees[k];
                        invalidObjects.failedRemark = remark;
                        // console.log("line 1070>>>>>>>>>>>>>>>>>",invalidObjects)
                        invalidData.push(invalidObjects);

                    }

                } else {

                   /* var DOB;
                    if (employees[k].DOB == '-') {
                        employees[k].DOB = '-';
                    } else {
                        if (typeof employees[k].DOB == 'number') {
                            DOB = moment(new Date(Math.round((employees[k].DOB - 25569) * 86400 * 1000))).format("YYYY-MM-DD");
                        } else {
                            DOB = moment(new Date(employees[k].DOB)).format("YYYY-MM-DD")
                        }
                        employees[k].DOB = DOB;
                    }
                    invalidObjects = employees[k];
                    invalidObjects.failedRemark = remark;
                      console.log("line 1091>>>>>>>>>>>>>>>>>",invalidObjects);
                      console.log("invalidData before>>>>>>>>>>>>>>>>",invalidData);
                    invalidData.push(invalidObjects);
                    console.log("invalidData after>>>>>>>>>>>>>>>>",invalidData);*/

                }
                remark = '';
            }else{
                remark = "Company ID not found.";
                invalidObjects = employees[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
        }
       
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
var fetchVehicles = async () => {
    return new Promise(function (resolve, reject) {
        FuelReibursement.find({})
            .exec()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
var fetchAllEmployees = async (email) => {
    return new Promise(function (resolve, reject) {
        PersonMaster.find({email:email })
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
var fetchSocialMediaData = async (socialMedia) => {
    return new Promise(function (resolve, reject) {
        SocialMediaMaster.find({ socialMedia: socialMedia })
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
function insertDepartment(department, createdBy) {
    return new Promise(function (resolve, reject) {
        const departmentMaster = new DepartmentMaster({
            _id: new mongoose.Types.ObjectId(),
            department: department,
            companyID: 1,
            createdBy: createdBy,
            createdAt: new Date()
        })
        departmentMaster.save()
            .then(data => {
                resolve(data.department);
            })
            .catch(err => {
                reject(err);
            });
    });
}
function insertVehicle(vehicle, createdBy) {
    return new Promise(function (resolve, reject) {
        const vehicleMaster = new VehicleMaster({
            _id: new mongoose.Types.ObjectId(),
            vehicleType: vehicle,
            createdBy: createdBy,
            createdAt: new Date()
        })
        vehicleMaster.save()
            .then(data => {
                resolve(data.vehicleType);
            })
            .catch(err => {
                reject(err);
            });
    });
}
function insertDesignation(designation, createdBy) {
    return new Promise(function (resolve, reject) {
        const designationMaster = new DesignationMaster({
            _id: new mongoose.Types.ObjectId(),
            designation: designation,
             companyID: 1,
            createdBy: createdBy,
            createdAt: new Date()
        })
        designationMaster.save()
            .then(data => {
                resolve(data.designation);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function insertSocialMedia(socialMedia, createdBy) {
    return new Promise(function (resolve, reject) {
        const socialMediaMaster = new SocialMediaMaster({
            _id: new mongoose.Types.ObjectId(),
            socialMedia: socialMedia,
            createdBy: createdBy,
            createdAt: new Date()
        })
        designationMaster.save()
            .then(data => {
                resolve(data._id);
            })
            .catch(err => {
                reject(err);
            });
    });
}


var insertFailedRecords = async (invalidData, updateBadData) => {
    console.log('invalidData  person',invalidData);
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
                             console.log("inside line 1232");
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
                         console.log("inside line 1248");
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
//Mobile Driver API

//For Driver Basic Info
exports.updatePersonBasicInfo = (req, res, next) => {
    PersonMaster.updateOne(
    { _id:req.body.person_id },   
    {
        $set:   {   
                    'firstName'                   : req.body.firstName,
                    'middleName'                  : req.body.middleName,
                    'lastName'                    : req.body.lastName,
                    'DOB'                         : req.body.DOB,
                    'gender'                      : req.body.gender,
                    'contactNo'                   : req.body.contactNo,
                    'altContactNo'                : req.body.altContactNo,
                    'email'                       : req.body.email,
                    'whatsappNo'                  : req.body.whatsappNo,
                    'workLocationId'              : req.body.workLocationId,
                    'workLocation'                : req.body.workLocation,
            }  
    })
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            PersonMaster.updateOne(
            { userId:req.body.person_id},
            {
                $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                            updatedBy      : req.body.updatedBy 
                                        }] 

                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
//End


//For Driver Address Info
exports.updatePersonAddressInfo = (req, res, next) => {
    PersonMaster.updateOne(
        { _id: req.body.person_id },
        {
            $set: {

                'address': [{
                    addressLine1: req.body.addressLine1,
                    addressLine2: req.body.addressLine2,
                    landmark: req.body.landmark,
                    area: req.body.area,
                    city: req.body.city,
                    district: req.body.district,
                    // stateCode: req.body.stateCode,
                    state: req.body.state,
                    // countryCode: req.body.countryCode,
                    country: req.body.country,
                    pincode: req.body.pincode,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    // addressProof: req.body.addressProof
                }],

            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                PersonMaster.updateOne(
                    { _id: req.body.person_id },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};


//For Driver Work Images Info
exports.updateWorkImages = (req, res, next) => {
    PersonMaster.updateOne(
        { _id: req.body.person_id },
        {
            $set: {
                'workImages': req.body.workImages,
                "socialMediaArray" : req.body.socialMediaArray
            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                PersonMaster.updateOne(
                    { _id: req.body.person_id },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};
//End

//For Person Document Info
exports.updatePersonDocumentsProof = (req, res, next) => {
    PersonMaster.updateOne(
        { _id: req.body.person_id },
        {
            $set:   {   
                         Documentarray  : req.body.documentArray, 
                         badgeNumber    : req.body.badgeNumber,                                   
                    }   

        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                PersonMaster.updateOne(
                    { _id: req.body.person_id },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.personProfilePhoto = (req, res, next) => {
    PersonMaster.updateOne(
        { _id: req.body.person_id },
        {
            $set: {
                "profilePhoto": req.body.profilePhoto,
            },
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                PersonMaster.updateOne(
                    { _id: req.body.person_id },
                    {
                        $push: {
                            'updateLog': [{
                                updatedAt: new Date(),
                                updatedBy: req.body.updatedBy
                            }]
                        }
                    })
                    .exec()
                    .then(data => {
                        res.status(200).json({ updated: true });
                    })
            } else {
                res.status(200).json({ updated: false });
            }
        })
        .catch(err => {
            console.log('user error ', err);
            res.status(500).json({
                error: err
            });
        });
};


exports.getPersonProfilePhoto = (req, res, next) => {
    PersonMaster.findOne({ userId: req.params.userId }, { profilePhoto: 1, firstName: 1, lastName: 1, contactNo: 1, _id: 0 })
        .then(data => {
            console.log(data)
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(200).json({ message: "NOT_FOUND" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};



exports.filedetails = (req, res, next) => {
    var finaldata = {};
    PersonMaster.aggregate([
        {
            $lookup:
            {
                from: "departmentmasters",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        },
        {
            $lookup:
            {
                from: "designationmasters",
                localField: "designationId",
                foreignField: "_id",
                as: "designation"
            }
        },
        { $match: { type: req.params.type, fileName: req.params.fileName } }
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



exports.fetch_file = (req, res, next) => {
    PersonMaster.aggregate([
        { $match: { "type": req.body.type } },
        { $group: { _id: "$fileName", count: { $sum: 1 } } }
    ])
        .exec()
        .then(data => {
            res.status(200).json(data.slice(req.body.startRange, req.body.limitRange));
            //res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.fetch_file_count = (req, res, next) => {
    //PersonMaster.find({"type" : req.params.type})
    PersonMaster.aggregate([
        { $match: { "type": req.params.type } },
        { $group: { _id: "$fileName", count: { $sum: 1 } } }
    ])
        .exec()
        .then(data => {

            res.status(200).json(data.length);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_file = (req, res, next) => {

    //console.log("type",req.params.type)
    //console.log("fileName",req.params.fileName)
    PersonMaster.deleteMany({ "fileName": req.params.fileName, "type": req.params.type })
        .exec()
        .then(data => {
            res.status(200).json({
                "message": "Records of file " + req.params.fileName + " deleted successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.getUserByEmpID = (req, res, next) => {
    PersonMaster.find({ employeeId: req.params.employeeId, company_Id: req.params.corporateId })
        .exec()
        .then(data => {
            res.status(200).json({ data: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getGuestByEmail = (req, res, next) => {
    PersonMaster.find({type:'guest', email: req.params.email, company_Id: req.params.corporateId })
        .exec()
        .then(data => {
            res.status(200).json({ data: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getEmpByEmpID = (req, res, next) => {
    PersonMaster.find({ employeeId: req.params.employeeId })
        .exec()
        .then(data => {
            res.status(200).json({ data: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getUserByID = (req, res, next) => {
    PersonMaster.find({ _id: req.params.userId })
        .exec()
        .then(data => {
            res.status(200).json({ data: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getUserByEmail = (req, res, next) => {
    PersonMaster.find({ email: req.params.emailId })
        .exec()
        .then(data => {
            res.status(200).json({ data: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};
exports.getUserByUserId = (req, res, next) => {
    PersonMaster.find({ userId: req.params.userId })
        .exec()
        .then(data => {
            res.status(200).json({ data: data });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.driverListMapping = (req, res, next) => {
    PersonMaster.find({ company_Id: req.params.company_Id, type: "driver", status: 'Active' }, { firstName: 1, middleName: 1, lastName: 1, contactNo: 1, profilePhoto: 1, email: 1, type: 1 })
        .sort({ createdAt: -1 })
        .then(driverList => {
            if (driverList) {
                for (var k = 0; k < driverList.length; k++) {
                    driverList[k] = { ...driverList[k]._doc, matched: false };
                }

                if (req.params.company_Id && driverList.length > 0) {
                    VehicleDriverMapping.find({ company_Id: req.params.company_Id }, { driverID: 1, status: 1 })
                        .then(mappingList => {
                            if (mappingList.length > 0) {
                                for (var i = 0; i < mappingList.length; i++) {
                                    for (let j = 0; j < driverList.length; j++) {
                                        if (mappingList[i].driverID.equals(driverList[j]._id) && mappingList[i].status === "Active") {
                                            driverList[j] = { ...driverList[j], matched: true };
                                            break;
                                        }
                                    }

                                }
                                if (i >= mappingList.length) {
                                    const resDriverList = driverList.filter(list => list.matched === false);
                                    res.status(200).json(resDriverList);
                                }
                            } else {
                                res.status(200).json(driverList);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                } else {
                    res.status(200).json(driverList);
                }
            } else {
                res.status(404).json('Vehicle Details not found');
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getPersonList = (req,res,next)=>{ 
    var selector = {};
    for (var key in req.body) {
        if(key=='company_Id' && req.body.company_Id!=='All') {
            selector.company_Id = req.body.company_Id 
        }
        if(key=='type') {
            selector.type =  req.body.type  
        }
        if(key=='status') {
            selector.status =  { $in: req.body.status } 
        }
    }
    PersonMaster.find(selector,{ firstName: 1, middleName:1, lastName: 1,contactNo:1,profilePhoto:1,email:1,type:1,status:1,statusLog:1,companyID:1,companyName:1})
    .sort({createdAt : -1})
    .then(data=>{
        res.status(200).json( data );
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    }); 
};


exports.getDriverListForVendor = (req, res, next) => {
    PersonMaster.find({ company_Id: req.params.company_Id, type: "driver" }, { firstName: 1, middleName: 1, lastName: 1, contactNo: 1, profilePhoto: 1, email: 1, type: 1, status: 1, statusLog: 1 })
        .sort({ createdAt: -1 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};




exports.getDriverListForAllocation = (req, res, next) => {

    var desiredFromDate = req.body.fromDate;
    var desiredToDate = req.body.toDate;
    PersonMaster.find({ company_Id: req.body.company_Id, type: 'driver', status: 'Active' })
        .then(validDrivers => {
            let driverIDArray = validDrivers.map(drivers => drivers._id);
            if(validDrivers && validDrivers.length > 0) {
                for(var i = 0; i < validDrivers.length; i++) {
                    var documentArray = validDrivers[i].Documentarray.filter((elem)=>{return elem.documentName==="License"})
                    if(documentArray.length > 0 && documentArray[0].documentName == "License" && new Date(documentArray[0].documentValidTo) <= new Date(desiredToDate)) {
                        validDrivers[i] = {
                            ...validDrivers[i]._doc,
                            availabilityStatus: 'Not Ready',
                        };
                    }else{
                        validDrivers[i] = {
                            ...validDrivers[i]._doc,
                            availabilityStatus: 'Available',
                        };
                    }
                }
                console.log("validDrivers",validDrivers);
                BookingMaster.find({
                    status: { $elemMatch: { allocatedToDriver: { $in: driverIDArray } } },
                    statusValue: { $nin: ["Cancel By User", "Cancel By Vendor", "Cancel By Admin"] },
                    $or: [
                        {
                            $and: [
                                { pickupDate: { $lte: new Date(desiredFromDate) } },
                                { returnDate: { $gte: new Date(desiredToDate) } },
                            ]
                        },
                        {
                            $and: [
                                { pickupDate: { $gte: new Date(desiredFromDate) } },
                                { pickupDate: { $lte: new Date(desiredToDate) } },
                            ]
                        },
                        {
                            $and: [
                                { returnDate: { $gte: new Date(desiredFromDate) } },
                                { returnDate: { $lte: new Date(desiredToDate) } },
                            ]
                        }
                    ]
                })
                    .then(bookedDrivers => {
                        console.log("bookedDrivers", bookedDrivers);
                        var availabilityStatus = '';
                        if (bookedDrivers && bookedDrivers.length > 0) {
                            for (var i = 0; i < bookedDrivers.length; i++) {
                                var status = bookedDrivers[i].status.filter((elem) => { return elem.value === "Trip Allocated To Driver" });;
                                console.log("status", status);
                                for (let k = 0; k < validDrivers.length; k++) {
                                    if (status[status.length - 1].allocatedToDriver.equals(validDrivers[k]._id)) {
                                        validDrivers[k] = { ...validDrivers[k], availabilityStatus: 'Booked' };
                                        break;
                                    }
                                }
                            }
                            if (i >= bookedDrivers.length) {
                                res.status(200).json(validDrivers);
                            }
                        } else {
                            res.status(200).json(validDrivers);
                        }

                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    })

            } else {
                //if valid vehicle not found
                res.status(200).json(validDrivers);
            }

        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.driver_update_recover_status = (req, res, next) => {
    PersonMaster.findOne({ _id: req.body.driverID })
        .exec()
        .then(user => {
            if (user) {
                var newstatus = "";
                if (user.status === 'deleted-Active') {
                    newstatus = 'Active';
                }
                if (user.status === 'deleted-Inactive') {
                    newstatus = 'Inactive';
                }
                PersonMaster.updateOne(
                    { _id: req.body.driverID },
                    {
                        $set: {
                            "status": newstatus,
                        },
                    }
                )
                    .exec()
                    .then(data => {
                        if (data.nModified == 1) {
                            PersonMaster.updateOne(
                                { _id: req.body.driverID },
                                {
                                    $push: {
                                        'statusLog': [{
                                            status: newstatus,
                                            updatedAt: new Date(),
                                            updatedBy: req.body.updatedBy,
                                        }]
                                    }
                                })
                                .exec()
                                .then(data => {
                                    res.status(200).json({message:"USER_IS_RESTORED",user_id:user.userId});
                                })
                        } else {
                            res.status(200).json({message:"USER_IS_NOT_RESTORED",user_id:user.userId})
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
                res.status(200).json("User Not Found");
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
exports.tempDeleteDriver = (req, res, next) => {
    PersonMaster.findOne({ _id: req.body.driverID })
        .exec()
        .then(driver => {
            if (driver) {
                VehicleDriverMapping.findOne(
                    {
                        driverID: req.body.driverID,
                        status: "active"
                    },
                )
                    .exec()
                    .then(mapping => {
                        console.log("mapping", mapping);
                        if (mapping) {
                            BookingMaster.findOne(
                                { driverID: req.body.driverID },
                            )
                                .exec()
                                .then(booking => {
                                    console.log("mappif_booking", booking);
                                    if (booking) {

                                    } else {
                                        // console.log("req.driver==>",driver);
                                        var newstatus = "";
                                        if (driver.status === 'Active') {
                                            newstatus = 'deleted-Active';
                                        }
                                        if (driver.status === 'Inactive') {
                                            newstatus = 'deleted-Inactive';
                                        }
                                        PersonMaster.updateOne(
                                            { _id: req.body.driverID },
                                            {
                                                $set: {
                                                    "status": newstatus,
                                                },
                                            }
                                        )
                                            .exec()
                                            .then(data => {
                                                if (data.nModified == 1) {
                                                    PersonMaster.updateOne(
                                                        { _id: req.body.driverID },
                                                        {
                                                            $push: {
                                                                'statusLog': [{
                                                                    status: newstatus,
                                                                    updatedAt: new Date(),
                                                                    updatedBy: req.body.updatedBy,
                                                                }]
                                                            }
                                                        })
                                                        .exec()
                                                        .then(details => {
                                                            console.log("details", details);
                                                            if (details.nModified === 1) {
                                                                VehicleDriverMapping.updateOne(
                                                                    { _id: mapping._id },
                                                                    {
                                                                        $set: {
                                                                            'unmapDate': new Date(),
                                                                            'status': 'inactive',
                                                                        },
                                                                        $push: {
                                                                            'updateLog': [{
                                                                                updatedAt: new Date(),
                                                                                updatedBy: req.body.updatedBy
                                                                            }],
                                                                        }
                                                                    }
                                                                )
                                                                    .exec()
                                                                    .then(mapping => {
                                                                        console.log("unmapping", mapping)
                                                                        console.log("mappingif deleted")
                                                                        res.status(200).json({ deleted: true });
                                                                    })
                                                                    .catch(err => {
                                                                        console.log("err", err);
                                                                        res.status(500).json({ error: err });
                                                                    });
                                                            } else {
                                                                res.status(200).json({ deleted: false });
                                                            }
                                                            // res.status(200).json("USER_SOFT_DELETED");
                                                        })
                                                        .catch(err => {
                                                            console.log("err", err);
                                                            res.status(500).json({
                                                                error: err
                                                            });
                                                        });
                                                } else {
                                                    res.status(200).json("USER_NOT_DELETED")
                                                }
                                            })
                                            .catch(err => {
                                                res.status(500).json({
                                                    error: err
                                                });
                                            });
                                    }
                                })
                                .catch(err => {
                                    console.log("err", err);
                                    res.status(500).json({ error: err });
                                });
                        } else {
                            BookingMaster.findOne(
                                { driverID: req.body.driverID },
                            )
                                .exec()
                                .then(booking => {
                                    console.log("mappelse_booking", booking);
                                    if (booking) {




                                    } else {
                                        // console.log("req.driver==>",driver);
                                        var newstatus = "";
                                        if (driver.status === 'Active') {
                                            newstatus = 'deleted-Active';
                                        }
                                        if (driver.status === 'Inactive') {
                                            newstatus = 'deleted-Inactive';
                                        }
                                        PersonMaster.updateOne(
                                            { _id: req.body.driverID },
                                            {
                                                $set: {
                                                    "status": newstatus,
                                                },
                                            }
                                        )
                                            .exec()
                                            .then(data => {
                                                console.log("RESPONSE.data==>", data);
                                                if (data.nModified == 1) {
                                                    PersonMaster.updateOne(
                                                        { _id: req.body.driverID },
                                                        {
                                                            $push: {
                                                                'statusLog': [{
                                                                    status: newstatus,
                                                                    updatedAt: new Date(),
                                                                    updatedBy: req.body.updatedBy,
                                                                }]
                                                            }
                                                        })
                                                        .exec()
                                                        .then(details => {
                                                            console.log("details", details);
                                                            if (details.nModified === 1) {
                                                                res.status(200).json({ deleted: true });
                                                            } else {
                                                                res.status(200).json({ deleted: false });
                                                            }
                                                            // res.status(200).json("USER_SOFT_DELETED");
                                                        })
                                                        .catch(err => {
                                                            console.log("err", err);
                                                            res.status(500).json({
                                                                error: err
                                                            });
                                                        });
                                                } else {
                                                    res.status(200).json("USER_NOT_DELETED")
                                                }
                                            })
                                            .catch(err => {
                                                res.status(500).json({
                                                    error: err
                                                });
                                            });
                                    }
                                })
                                .catch(err => {
                                    console.log("err", err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    })
                    .catch(err => {
                        console.log("err", err);
                        res.status(500).json({ error: err });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

// End

exports.searchPersonByID_Name = (req, res, next) => {
    PersonMaster.aggregate([
        { $match: { "company_Id": ObjectID(req.params.companyID) } },
        {
            $match:
            {
                $or:
                    [
                        { "firstName": { $regex: req.params.str, $options: "i" } },
                        { middleName: { $regex: req.params.str, $options: "i" } },
                        { lastName: { $regex: req.params.str, $options: "i" } },
                        { employeeId: { $regex: req.params.str, $options: "i" } }
                    ]
            }
        },
    ])
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};


exports.searchTechnicianByName = (req, res, next) => {
    PersonMaster.aggregate([
        { $match: { "type": 'technician' } },
        {
            $match:
            {
                $or:
                    [
                        { "firstName": { $regex: req.params.str, $options: "i" } },
                        { middleName: { $regex: req.params.str, $options: "i" } },
                        { lastName: { $regex: req.params.str, $options: "i" } },
                    ]
            }
        },
    ])
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.personlist = (req, res, next) => {
    Users.find({roles:req.params.role,"profile.status":"active"},{_id:1})
    .then(users => {
        var usersId = users.map(a=>a._id);
        PersonMaster.find({ userId: {$in:usersId},status:"Active"})
        .sort({ createdAt: -1 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });

};