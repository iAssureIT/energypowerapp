const express 	          = require("express");
const router 	          = express.Router();
// const checkAuth           = require('../../coreAdmin/middlerware/check-auth.js');
const CameralocController = require('./Controller.js');

router.post('/post'                  			, CameralocController.create_cameralocation);
router.get('/get/one/:fetchId'       			, CameralocController.fetch_one);
router.post('/get/list'               			, CameralocController.list_cameraLoc_with_filter);
router.get('/get/list'               			, CameralocController.list_cameraLoc);
router.get('/get/list/recording/:recording_id'   , CameralocController.list_using_recording_id);
router.patch('/update/:camera_id'    			, CameralocController.update_cameraLoc);
router.delete('/delete/all'          			, CameralocController.delete_all_cameraLoc);
router.delete('/delete/:camera_id'   			, CameralocController.delete_cameraLoc);
router.get('/get/list/address'       			, CameralocController.list_address);
router.get('/get/locationName/list'  			, CameralocController.list_location_name);
router.get('/get/count'			     			, CameralocController.get_count);

module.exports = router;