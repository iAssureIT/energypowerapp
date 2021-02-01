const express 	= require("express");
const router 	= express.Router();

const FuelReimbursementMaster = require('./Controller.js');

router.post('/post', FuelReimbursementMaster.insertFuelReimbursement);

router.get('/get/list', FuelReimbursementMaster.getFuelReimbursement);

router.post('/get/list', FuelReimbursementMaster.fetchFuelReimbursement); 

router.get('/get/list/:entityname', FuelReimbursementMaster.getFuelReimbursementData); 
 
router.get('/get/one/:fieldID', FuelReimbursementMaster.fetchSingleFuelReimbursement);

router.patch('/patch', FuelReimbursementMaster.updateFuelReimbursement);

router.delete('/delete/:fieldID', FuelReimbursementMaster.deleteFuelReimbursement);

// router.post('/bulkUploadModel',FuelReimbursementMaster.bulkUploadDocumentList);

// router.get('/get/filedetails/:fileName', FuelReimbursementMaster.filedetails);

// router.post('/get/files', FuelReimbursementMaster.fetch_file); 


module.exports = router;