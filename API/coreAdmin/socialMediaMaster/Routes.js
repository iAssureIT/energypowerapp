const express 	= require("express");
const router 	= express.Router();

const socialMediaMaster = require('./Controller.js');

router.post('/post', socialMediaMaster.insertCategory);

router.post('/get/list', socialMediaMaster.fetchSocialMedia);

router.get('/get/list', socialMediaMaster.getSocialMedia);

router.get('/get/count', socialMediaMaster.countSocialMedia);

router.get('/get/one/:fieldID', socialMediaMaster.fetchSingleCategory);

router.get('/search/:str', socialMediaMaster.searchCategory);

router.patch('/patch', socialMediaMaster.updateCategory);

router.delete('/delete/:fieldID', socialMediaMaster.deleteCategory);

module.exports = router;