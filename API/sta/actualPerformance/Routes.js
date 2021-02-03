const express 	= require("express");
const router 	= express.Router();

const ActualPerformanceController = require('./Controller.js');

router.post('/post', ActualPerformanceController.insertActualPerformance);

router.post('/get/list', ActualPerformanceController.getActualPerformance);

router.get('/get/count', ActualPerformanceController.countActualPerformance);

router.get('/get/one/:fieldID', ActualPerformanceController.fetchSingleActualPerformance);

router.get('/search/:str', ActualPerformanceController.searchActualPerformance);

router.patch('/patch', ActualPerformanceController.updateActualPerformance);

router.delete('/delete/:fieldID', ActualPerformanceController.deleteActualPerformance);

module.exports = router;