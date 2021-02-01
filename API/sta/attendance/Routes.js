const express 	= require("express");
const router 	= express.Router();
const TrackingController = require('./Controller.js');

router.post('/post/startDetails',TrackingController.start_location_details);

router.get('/get/startDetails/:tracking_id',TrackingController.get_location_details);

router.get('/get/all',TrackingController.get_all);

router.get('/get/daywise/:date',TrackingController.day_wise);

router.get('/get/:tracking_id',TrackingController.get_details);

router.get('/get/person_details/:tracking_id',TrackingController.getPersonDetails);


router.get('/get/daywiseLocationDetails/:userId',TrackingController.get_daywise_location_details);

router.get('/get/get_tracking_status/:user_id',TrackingController.get_tracking_status);

router.get('/get/daywiseUserdetails/:monthyear/:user_id',TrackingController.get_daywise_userdetails);

router.patch('/patch/routeCoordinates',TrackingController.update_routeCoordinates);

router.patch('/patch/endDetails',TrackingController.end_location_details);

router.get('/get/count/:company_id',TrackingController.get_count);

module.exports = router;