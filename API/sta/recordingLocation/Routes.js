const express 	          = require("express");
const router 	          = express.Router();
// const checkAuth           = require('../../coreAdmin/middlerware/check-auth.js');
const RecordingLocController = require('./Controller.js');

router.post('/post'                    				, RecordingLocController.create_recordinglocation);
router.get('/get/one/:fetchId'         				, RecordingLocController.fetch_one);
router.post('/get/list'                 			, RecordingLocController.list_recordingLoc_with_filter);
router.get('/get/list'                 				, RecordingLocController.list_recordingLoc);
router.get('/get/list/client/:client_id'              , RecordingLocController.list_using_client_id);
router.post('/get/list/address'         			, RecordingLocController.list_address);
router.get('/get/list/client_name'     				, RecordingLocController.list_client_name);
router.get('/get/locationName/list'    				, RecordingLocController.list_location_name);
router.patch('/update/:recording_id'   				, RecordingLocController.update_recordingLoc);
router.delete('/delete/all'            				, RecordingLocController.delete_all_recordingLoc);
router.delete('/delete/:recording_id'  				, RecordingLocController.delete_recordingLoc);
router.get('/get/count'			     				, RecordingLocController.get_count);


module.exports = router;