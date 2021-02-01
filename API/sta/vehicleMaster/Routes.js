const express 	= require("express");
const router 	= express.Router();

const VehicleMaster = require('./Controller.js');

router.post('/post', VehicleMaster.insertVehicle);

router.post('/get/list', VehicleMaster.fetchVehicle);

router.get('/get/count', VehicleMaster.countVehicle);

router.get('/get/one/:fieldID', VehicleMaster.fetchSingleVehicle);

router.get('/search/:str', VehicleMaster.searchVehicle);

router.patch('/patch', VehicleMaster.updateVehicle);

router.delete('/delete/:fieldID', VehicleMaster.deleteVehicle);

module.exports = router;