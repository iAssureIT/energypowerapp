const express 	= require("express");
const router 	= express.Router();

const EquipmentModelController = require('./Controller.js');

router.post('/post', EquipmentModelController.insertEquipmentModel);

router.post('/get/list', EquipmentModelController.getEquipmentModel);

router.get('/get/count', EquipmentModelController.countEquipmentModel);

router.get('/get/one/:fieldID', EquipmentModelController.fetchSingleEquipmentModel);

router.get('/search/:str', EquipmentModelController.searchEquipmentModel);

router.patch('/patch', EquipmentModelController.updateEquipmentModel);

router.delete('/delete/:fieldID', EquipmentModelController.deleteEquipmentModel);

module.exports = router;