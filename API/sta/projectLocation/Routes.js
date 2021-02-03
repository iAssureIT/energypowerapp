const express 	          = require("express");
const router 	          = express.Router();
// const checkAuth           = require('../../coreAdmin/middlerware/check-auth.js');
const ProjectLocController = require('./Controller.js');

router.post('/post'                    				, ProjectLocController.create_projectlocation);
router.get('/get/one/:fetchId'         				, ProjectLocController.fetch_one);
router.post('/get/list'                 			, ProjectLocController.list_projectLoc_with_filter);
router.get('/get/list'                 				, ProjectLocController.list_projectLoc);
router.get('/get/list/client/:client_id'              , ProjectLocController.list_using_client_id);
router.post('/get/list/address'         			, ProjectLocController.list_address);
router.get('/get/list/client_name'     				, ProjectLocController.list_client_name);
router.get('/get/locationName/list'    				, ProjectLocController.list_location_name);
router.patch('/update/:project_id'   				, ProjectLocController.update_projectLoc);
router.delete('/delete/all'            				, ProjectLocController.delete_all_projectLoc);
router.delete('/delete/:project_id'  				, ProjectLocController.delete_projectLoc);
router.get('/get/count'			     				, ProjectLocController.get_count);


module.exports = router;