const express 	= require("express");
const router 	= express.Router();

const NightTimingsMasterContoller = require('./ControllerNightTimings.js');

router.patch('/insertNightTimings', NightTimingsMasterContoller.insertNightTimings);

router.post('/get/list', NightTimingsMasterContoller.fetchNightTimingsList);

router.get('/get', NightTimingsMasterContoller.getNightTimingsList);

router.get('/getSingleData/:id', NightTimingsMasterContoller.getSingleData);

router.patch('/updateNightTimings', NightTimingsMasterContoller.updateNightTimings);

router.delete('/delete/:fieldID', NightTimingsMasterContoller.deleteNightTimings);

module.exports = router;


