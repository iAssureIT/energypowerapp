const express 	= require("express");
const router 	= express.Router();

const socialMediaMaster = require('./Controller.js');

router.post('/post', socialMediaMaster.insertSocialMedia);

router.post('/get/list', socialMediaMaster.fetchSocialMedia);

router.get('/get/list', socialMediaMaster.getSocialMedia);

router.get('/get/count', socialMediaMaster.countSocialMedia);

router.get('/get/one/:fieldID', socialMediaMaster.fetchSingleSocialMedia);

router.get('/search/:str', socialMediaMaster.searchSocialMedia);

router.patch('/patch', socialMediaMaster.updateSocialMedia);

router.delete('/delete/:fieldID', socialMediaMaster.deleteSocialMedia);

module.exports = router;