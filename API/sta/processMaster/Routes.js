const express 	= require("express");
const router 	= express.Router();

const ProcessMaster = require('./Controller.js');

router.post('/post', ProcessMaster.insertprocess);

router.post('/get/list', ProcessMaster.fetchprocess);

router.get('/get/count', ProcessMaster.countprocess);

router.get('/get/one/:fieldID', ProcessMaster.fetchSingleprocess);

router.get('/search/:str', ProcessMaster.searchprocess);

router.patch('/patch', ProcessMaster.updateprocess);

router.delete('/delete/:fieldID', ProcessMaster.deleteprocess);

module.exports = router;