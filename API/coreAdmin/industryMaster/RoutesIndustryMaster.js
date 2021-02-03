const express 	= require("express");
const router 	= express.Router();

const industryMaster = require('./ControllerindustryMaster.js');

router.post('/post', industryMaster.insertIndustry);

router.post('/get/list', industryMaster.fetchIndustry);

router.get('/get/list', industryMaster.getIndustry);

router.get('/get/count', industryMaster.countIndustry);

router.get('/get/one/:fieldID', industryMaster.fetchSingleIndustry);

router.get('/search/:str', industryMaster.searchIndustry);

router.patch('/patch', industryMaster.updateIndustry);

router.delete('/delete/:fieldID', industryMaster.deleteIndustry);

// router.post('/bulkUploadbrand ',industryMaster.bulkUploadVehicleBrand);

router.post('/bulkUploadindustry',industryMaster.bulkUploadVehicleIndustry);

router.post('/get/files', industryMaster.fetch_file); 

router.get('/get/filedetails/:fileName', industryMaster.filedetails);

module.exports = router;