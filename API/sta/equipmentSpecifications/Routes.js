const express 	= require("express");
const router 	= express.Router();

const EquipmentSpecificationsController = require('./Controller.js');

router.post('/post', EquipmentSpecificationsController.insertEquipmentSpecifications);

router.post('/get/list', EquipmentSpecificationsController.fetchEquipmentSpecifications);

router.get('/get/count', EquipmentSpecificationsController.countEquipmentSpecifications);

router.get('/get/one/:fieldID', EquipmentSpecificationsController.fetchSingleEquipmentSpecifications);

router.get('/search/:str', EquipmentSpecificationsController.searchEquipmentSpecifications);

router.patch('/patch', EquipmentSpecificationsController.updateEquipmentSpecifications);

router.delete('/delete/:fieldID', EquipmentSpecificationsController.deleteEquipmentSpecifications);

module.exports = router;