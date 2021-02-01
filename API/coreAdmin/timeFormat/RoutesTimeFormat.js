const express 	= require("express");
const router 	= express.Router();

const TimeFormatController = require('./ControllerTimeFormat.js');

router.post('/post', TimeFormatController.create_timeFormat);

router.get('/get', TimeFormatController.detail_timeFormat);

router.patch('/patch', TimeFormatController.update_timeFormat);


module.exports = router;