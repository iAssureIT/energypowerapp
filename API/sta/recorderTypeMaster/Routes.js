const express 	= require("express");
const router 	= express.Router();

const RecorderType = require('./Controller.js');

router.post('/post', RecorderType.insertRecorderTypeMaster);

router.post('/get/list', RecorderType.fetchRecorderTypeMaster);

router.post('/get/reclist', RecorderType.list_recoredrtypelist);

router.get('/get/count', RecorderType.countRecorderTypeMaster);

router.get('/get/one/:fieldID', RecorderType.fetchSingleRecorderTypeMaster);

router.get('/search/:str', RecorderType.searchRecorderTypeMaster);

router.patch('/patch', RecorderType.updateRecorderTypeMaster);

router.delete('/delete/:fieldID', RecorderType.deleteRecorderTypeMaster);

module.exports = router;