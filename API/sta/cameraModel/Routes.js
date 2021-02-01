const express 	= require("express");
const router 	= express.Router();

const CameraModelController = require('./Controller.js');

router.post('/post', CameraModelController.insertCameraModel);

router.post('/get/list', CameraModelController.getCameraModel);

router.get('/get/count', CameraModelController.countCameraModel);

router.get('/get/one/:fieldID', CameraModelController.fetchSingleCameraModel);

router.get('/search/:str', CameraModelController.searchCameraModel);

router.patch('/patch', CameraModelController.updateCameraModel);

router.delete('/delete/:fieldID', CameraModelController.deleteCameraModel);

module.exports = router;