const express 	= require("express");
const router 	= express.Router();

const VehicleEmployeeMappingContoller = require('./ControllerVehicleEmployeeMapping.js');

router.post('/post', VehicleEmployeeMappingContoller.insertVehicleEmployeeMapping);

router.patch('/patch', VehicleEmployeeMappingContoller.updateVehicleEmployeeMapping);

router.post('/list', VehicleEmployeeMappingContoller.getAllVehicleEmployeeMapping);

router.post('/getVehicleData', VehicleEmployeeMappingContoller.getSelectedVehicleData);

router.get('/get/one/:id', VehicleEmployeeMappingContoller.getSingleVehicleEmployeeMapping);

router.delete('/delete/:id', VehicleEmployeeMappingContoller.deleteVehicleEmployeeMapping);

module.exports = router;


