const express 	= require("express");
const router 	= express.Router();

const IndustryMaster = require('./Controller.js');

router.post('/post', IndustryMaster.insertIndustryMaster);

router.post('/get/list', IndustryMaster.fetchIndustryMaster);

router.get('/get/count', IndustryMaster.countIndustryMaster);

router.get('/get/one/:fieldID', IndustryMaster.fetchSingleIndustryMaster);

router.get('/search/:str', IndustryMaster.searchIndustryMaster);

router.patch('/patch', IndustryMaster.updateIndustryMaster);

router.delete('/delete/:fieldID', IndustryMaster.deleteIndustryMaster);

module.exports = router;

