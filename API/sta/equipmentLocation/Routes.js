const express 	          = require("express");
const router 	          = express.Router();
// const checkAuth           = require('../../coreAdmin/middlerware/check-auth.js');
const EquipmentlocController = require('./Controller.js');

router.post('/post'                  			, EquipmentlocController.create_equipmentlocation);
router.get('/get/one/:fetchId'       			, EquipmentlocController.fetch_one);
router.post('/get/list'               			, EquipmentlocController.list_equipmentLoc_with_filter);
router.get('/get/list'               			, EquipmentlocController.list_equipmentLoc);
router.get('/get/list/project/:project_id'   , EquipmentlocController.list_using_project_id);
router.patch('/update/:equipment_id'    			, EquipmentlocController.update_equipmentLoc);
router.delete('/delete/all'          			, EquipmentlocController.delete_all_equipmentLoc);
router.delete('/delete/:equipment_id'   			, EquipmentlocController.delete_equipmentLoc);
router.get('/get/list/address'       			, EquipmentlocController.list_address);
router.get('/get/locationName/list'  			, EquipmentlocController.list_location_name);
router.get('/get/count'			     			, EquipmentlocController.get_count);

module.exports = router;