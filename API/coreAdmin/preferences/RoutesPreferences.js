const express 	= require("express");
const router 	= express.Router();

const PreferencesController = require('./ControllerPreferences.js');

router.post('/post', PreferencesController.create_preferences);

router.get('/get', PreferencesController.detail_preferences);

router.patch('/patch', PreferencesController.update_profitMargin);


module.exports = router;