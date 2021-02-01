const express 	= require("express");
const router 	= express.Router();

const CameraresController = require('./Controller.js');

router.post('/post', CameraresController.insertCameraResolution);

router.post('/get/list', CameraresController.getCameraresolution);

router.get('/get/count', CameraresController.countCameraresolution);

router.get('/get/one/:fieldID', CameraresController.fetchSingleCameraresolution);

router.get('/search/:str', CameraresController.searchCameraresolution);

router.patch('/patch', CameraresController.updateCameraresolution);

router.delete('/delete/:fieldID', CameraresController.deleteCameraresolution);

module.exports = router;