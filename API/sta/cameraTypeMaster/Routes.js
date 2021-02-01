const express 	= require("express");
const router 	= express.Router();

const CameratypeController = require('./Controller.js');

router.post('/post', CameratypeController.insertCameratype);

router.post('/get/list', CameratypeController.fetchCameratype);

router.get('/get/count', CameratypeController.countCameratype);

router.get('/get/one/:fieldID', CameratypeController.fetchSingleCameratype);

router.get('/search/:str', CameratypeController.searchCameratype);

router.patch('/patch', CameratypeController.updateCameratype);

router.delete('/delete/:fieldID', CameratypeController.deleteCameratype);

module.exports = router;