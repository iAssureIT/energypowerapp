const express 	= require("express");
const router 	= express.Router();

const MonthlyReimbursemet = require('./Controller.js');

router.post('/post', MonthlyReimbursemet.pay_reimbursement);

module.exports = router;

