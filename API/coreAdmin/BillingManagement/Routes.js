const express 	= require("express");
const router 	= express.Router();

const billingManagement = require('./Controller.js');

router.post('/post/:bookingID', billingManagement.generateBill);

router.get('/get/allList', billingManagement.getAllInvoices);


module.exports = router;