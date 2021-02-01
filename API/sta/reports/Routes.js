const express 	= require("express");
const router 	= express.Router();

const reportMaster = require('./Controller.js');

router.get('/get/daily_employee_task_report/:fromdate/:enddate/:searchtext', reportMaster.daily_employee_task_report);

router.get('/get/employee_wise_task_report/:employee_id/:monthyear', reportMaster.employee_wise_task_report);

router.get('/get/datewiseUserdetails/:monthyear',reportMaster.get_datewise_userdetails);

router.get('/get/daywiseUserdetails/:monthyear/:employee_id',reportMaster.get_daywise_userdetails);



module.exports = router;