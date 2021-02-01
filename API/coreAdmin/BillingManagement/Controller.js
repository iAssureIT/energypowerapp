const mongoose          = require("mongoose");
const BillingManagement = require('./Model');
const BookingMaster     = require('../bookingMaster/ModelBookingMaster');
const InvoiceNumber     = require('../InvoiceNumbers/Model');
const Contracts         = require('../contract/ModelContract');
var   ObjectId          = require('mongodb').ObjectID;
var moment              = require('moment');

exports.generateBill = (req,res,next)=>{
    BookingMaster.find({ _id : ObjectId(req.body.bookingID) })
    .sort({createdAt: -1})
    .exec()
    .then(data=>{
        if(data && data.length > 0){
            processData();
            async function processData() { 
                var createdBy = req.body.createdBy;

                /*=========== ContractData ===========*/
                var contractId = data[0].contractId;
                var contractDetails = await getContractDetails(contractId);

                /*=========== Applied Package ===========*/
                var appliedPackageId = data[0].packageId;
                var appliedPackagesData = await getAppliedPackagesData(appliedPackageId, contractId);
                console.log("appliedPackagesData = ",appliedPackagesData);
                
                /*=========== FixCharges ===========*/
                var fixCharges = appliedPackagesData.fixCharges;
                console.log("fixCharges = ",fixCharges);
                
                /*=========== Total Kms ===========*/
                var totalKms = data[0].routeCoordinates[0].distanceTravelled;
                var extraKmCharges = appliedPackagesData.extraKms;
                var minKms = appliedPackagesData.maxKm;
                if(totalKms > minKms){
                    var chargesForExtraKms = await getExtraKmCharges(totalKms, minKms, extraKmCharges)
                }else{
                    var chargesForExtraKms = 0;
                }
                console.log("totalKms = ",totalKms);
                console.log("chargesForExtraKms = ",chargesForExtraKms);

                /*=========== Total Hrs ===========*/
                var totalHrs = await getTotalHrs(data[0].pickupTime, data[0].returnTime);
                var extraHrCharges = appliedPackagesData.extraHr;
                var minHrs = appliedPackagesData.maxHours;
                if(totalHrs > minHrs){
                    var chargesForExtraHrs = await getExtraHrCharges(totalHrs, minHrs, extraHrCharges)
                }else{
                    var chargesForExtraHrs = 0;
                }
                console.log("totalHrs = ", totalHrs);
                console.log("chargesForExtraHrs = ",chargesForExtraHrs);

                /*=========== Driver Allowance ===========*/
                if(totalHrs > 12){
                    var driverAllowance = appliedPackagesData.driverAllowance;
                }else{
                    var driverAllowance = 0;
                }
                console.log("driverAllowance = ",driverAllowance);

                /*=========== Night Halt Charges ===========*/
                var nightHaltCharges = await getNightHaltCharges(data[0].pickupTime, data[0].returnTime, appliedPackagesData.nightHaltCharges);
                console.log("nightHaltCharges = ",nightHaltCharges);

                /*=========== Early Morning Charges ===========*/
                var earlyMorningChargesFromTime = contractDetails.earlyMorningChargesFromTime;
                var earlyMorningChargesToTime = contractDetails.earlyMorningChargesToTime;
                var earlyMorningCharges = await getEarlyMorningCharges(data[0].pickupTime, data[0].returnTime, earlyMorningChargesFromTime, earlyMorningChargesToTime, appliedPackagesData.morningCharges);                
                console.log("earlyMorningCharges = ",earlyMorningCharges);

                /*=========== Night Charges ===========*/
                var nightChargesFromTime = contractDetails.nightChargesFromTime;
                var nightChargesToTime = contractDetails.nightChargesToTime;
                var nightCharges = await getNightCharges(data[0].pickupTime, data[0].returnTime, nightChargesFromTime, nightChargesToTime, appliedPackagesData.nightCharges);                
                console.log("nightCharges = ",nightCharges);

                /*=========== Total Days ===========*/
                var totalDays = await getTotalDays(data[0].pickupDate, data[0].returnDate);
                console.log("totalDays = ",totalDays);

                /*=========== Invoice Number ===========*/
                var invoiceNumberData = await getInvoiceNumber(createdBy);
                if(invoiceNumberData){
                    var nextYear = parseInt(invoiceNumberData.finantialYear) + 1;
                    var invoiceNumber = "FY" + invoiceNumberData.finantialYear 
                        + "-"+ moment(nextYear, 'YYYY').format('YY')
                        + "/" +invoiceNumberData.invoiceNumber;
                } 

                /*=========== Create Invoice ===========*/
                // const billingManagement = new BillingManagement({
                //     _id                         : new mongoose.Types.ObjectId(),
                //     invoiceNumber               : invoiceNumber,
                //     packageTypeId               : data[0].packageTypeId,
                //     packageId                   : data[0].packageId,
                //     contractId                  : data[0].contractId,
                //     booking_Id                  : data[0].bookingId,
                //     bookingId                   : data[0].bookingId,
                //     tripType                    : data[0].tripType,
                //     pickupFrom                  : data[0].pickupFrom,
                //     from                        : data[0].from,
                //     to                          : data[0].to,
                //     pickupDate                  : data[0].pickupDate,
                //     pickupTime                  : data[0].pickupTime,
                //     returnDate                  : data[0].returnDate,
                //     returnTime                  : data[0].returnTime,   
                //     vehicleCategoryId           : data[0].vehicleCategoryId,
                //     vehicleID                   : data[0].vehicleID,
                //     employeeId                  : data[0].employeeId,
                //     employeeUserId              : data[0].employeeUserId,
                //     departmentId                : data[0].departmentId,
                //     corporateId                 : data[0].corporateId,
                //     estimatedCost               : data[0].estimatedCost,
                //     intermediateStops           : data[0].intermediateStops,
                //     tripExpenses                : data[0].tripExpenses,
                //     statusValue                 : data[0].statusValue,
                //     createdBy                   : req.body.createdBy,
                //     createdAt                   : new Date()
                // })
                // billingManagement.save()
                // .then(billdata=>{
                //     console.log("billdata = ",billdata);
                //     res.status(200).json({ 
                //         created   : true,  
                //         data      : billdata 
                //     });
                // })
                // .catch(err =>{
                //     res.status(500).json({ error : err });
                // });
            }
        }else{
          console.log("no data = ")
        }
    })
    .catch(err =>{
        res.status(500).json({error : err})
    })       
};

var getInvoiceNumber = async (createdBy) => {
    return new Promise(function (resolve, reject) {
        var currentYear = moment().year();
        InvoiceNumber.find({"finantialYear" : currentYear})
            .sort({createdAt: -1})
            .exec()
            .then(data=>{
                if(data && data.length > 0){
                  var invoiceNo = data[0].invoiceNumber + 1;
                }else{
                  var invoiceNo = 1;
                } 
                const invoiceNumber = new InvoiceNumber({
                    _id              : new mongoose.Types.ObjectId(),
                    finantialYear    : currentYear,
                    invoiceNumber    : invoiceNo,
                    createdBy        : createdBy,
                    createdAt        : new Date()
                })
                invoiceNumber.save()
                .then(invoiceNum=>{
                    resolve(invoiceNum);
                })
                .catch(err =>{
                    reject(err);
                });                
            })
            .catch(err =>{
                reject(err);
            }) 
        });
};

var getContractDetails = async (contractId) => {
    return new Promise(function (resolve, reject) {
        Contracts.findOne({_id : contractId})
            .exec()
            .then(data=>{                
                if(data){                  
                    resolve(data);                              
                }           
            })
            .catch(err =>{
                reject(err);
            });
        });
};

var getAppliedPackagesData = async (packageId, contractId) => {
    return new Promise(function (resolve, reject) {
        Contracts.findOne({_id : contractId})
            .exec()
            .then(data=>{                
                if(data){
                  var packages = data.packages;
                  if(packages.length > 0){
                    for (var i = 0; i < packages.length; i++) {                      
                        if(packageId.equals(packages[i].packageID)){
                            resolve(packages[i]);                              
                        }
                    }
                  }
                }              
            })
            .catch(err =>{
                reject(err);
            });
        });
};

var getExtraKmCharges = async (totalKms, minKms, extraKmCharges) => {
    return new Promise(function (resolve) {
        var chargesForExtraKms = ((totalKms - minKms) * extraKmCharges);
        resolve(chargesForExtraKms);
    })
};

var getExtraHrCharges = async (totalHrs, minHrs, extraHrCharges) => {
    return new Promise(function (resolve) {
        var chargesForExtraHrs = ((totalHrs - minHrs) * extraHrCharges);
        resolve(chargesForExtraHrs);
    })
};

var getTotalHrs = async (pickupTime, returnTime) => {
    return new Promise(function (resolve) {
        var startTime = moment(pickupTime, "HH:mm");
        var endTime = moment(returnTime, "HH:mm");

        if ( (startTime.hour() >=12 && endTime.hour() <=12 ) || endTime.isBefore(startTime) )
        {
            endTime.add(1, "days");       // handle spanning days endTime
            var duration = moment.duration(endTime.diff(startTime));
            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes())%60;
            resolve(hours);
        }else{
            var duration = moment.duration(endTime.diff(startTime));
            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes())%60;
            resolve(hours);
        }       
    })
};

var getTotalDays = async (pickupDate, returnDate) => {
    return new Promise(function (resolve) {
        var startDate = new Date(pickupDate);
        var endDate = new Date(returnDate);
        var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        var totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        resolve(totalDays+1);
    })
};

var getNightHaltCharges = async (pickupTime, returnTime, nightHaltCharges) => {
    return new Promise(function (resolve) {
        var startTime = moment(pickupTime, "HH:mm");
        var endTime = moment(returnTime, "HH:mm");
        var beforeTime = moment("23:00", "HH:mm");
        var afterTime = moment("18:00", "HH:mm");
        if ((startTime.isBefore(beforeTime) && endTime.isAfter(afterTime))) 
        {
            resolve(nightHaltCharges);
        }else{            
            resolve(0);
        }       
    })
};

var getEarlyMorningCharges = async (pickupTime, returnTime, earlyMorningChargesFromTime, earlyMorningChargesToTime, earlyMorningCharges) => {
    return new Promise(function (resolve) {
        var startTime = moment(pickupTime, "HH:mm");
        var endTime = moment(returnTime, "HH:mm");
        var earlyMorningChargesFromTime1 = moment(earlyMorningChargesFromTime, "HH:mm");
        var earlyMorningChargesToTime1 = moment(earlyMorningChargesToTime, "HH:mm");
        if ((startTime.isAfter(earlyMorningChargesFromTime1) || endTime.isBefore(earlyMorningChargesToTime1))) 
        {
            resolve(earlyMorningCharges);
        }else{            
            resolve(0);
        }       
    })
};

var getNightCharges = async (pickupTime, returnTime, nightChargesFromTime, nightChargesToTime, nightCharges) => {
    return new Promise(function (resolve) {
        console.log("nightChargesFromTime = ", nightChargesFromTime);
        console.log("nightChargesToTime = ", nightChargesToTime);
        var startTime = moment(pickupTime, "HH:mm");
        var endTime = moment(returnTime, "HH:mm");
        var nightChargesFromTime1 = moment("nightChargesFromTime", "HH:mm");
        var nightChargesToTime1 = moment(nightChargesToTime, "HH:mm");
        if ( (nightChargesFromTime1.hour() >=12 && nightChargesToTime1.hour() <=12 ) || nightChargesToTime1.isBefore(nightChargesFromTime1) ){
            nightChargesToTime1.add(1, "days");
            endTime.add(1, "days");
            console.log("in main if ")
            if ((startTime.isAfter(nightChargesFromTime1) || endTime.isBefore(nightChargesToTime1))) 
            {
                console.log("in sub if ")
                resolve(nightCharges);
            }else{ 
                console.log("in sub else ")           
                resolve(0);
            }  
        }else{
            console.log("in main else ")
            if ((startTime.isAfter(nightChargesFromTime1) || endTime.isBefore(nightChargesToTime1))) 
            {
                console.log("in sub if ")
                resolve(nightCharges);
            }else{  
                console.log("in sub else ")          
                resolve(0);
            }
        }    
    })
};

exports.getAllInvoices = (req, res, next)=>{
    BillingManagement.find({})
        .sort({createdAt : 1})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};