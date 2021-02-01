const express 	= require("express");
const router 	= express.Router();

const EarlyMorningTimingsMasterContoller = require('./ControllerEarlyMorningTimings.js');

router.patch('/insertEarlyMorningTimings', EarlyMorningTimingsMasterContoller.insertEarlyMorningTimings);

router.post('/get/list', EarlyMorningTimingsMasterContoller.fetchEarlyMorningTimingsList);

router.get('/get', EarlyMorningTimingsMasterContoller.getEarlyMorningTimingsList);

router.get('/getSingleData/:id', EarlyMorningTimingsMasterContoller.getSingleData);

router.patch('/updateEarlyMorningTimings', EarlyMorningTimingsMasterContoller.updateEarlyMorningTimings);

router.delete('/delete/:fieldID', EarlyMorningTimingsMasterContoller.deleteEarlyMorningTimings);

module.exports = router;


