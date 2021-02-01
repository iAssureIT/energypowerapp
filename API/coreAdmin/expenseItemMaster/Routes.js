const express 	= require("express");
const router 	= express.Router();

const ExpenseItemMaster = require('./Controller.js');

router.post('/post', 				ExpenseItemMaster.insertExpenseItemMaster);

router.get('/get/list', 			ExpenseItemMaster.getExpenseItemList);

router.post('/get/list', 			ExpenseItemMaster.fetchExpenseItemList); 
 
router.get('/get/one/:fieldID', 	ExpenseItemMaster.fetchSingleExpenseItem);

router.patch('/patch', 				ExpenseItemMaster.updateExpenseItem);

router.delete('/delete/:fieldID', 	ExpenseItemMaster.deleteExpenseItem);

module.exports = router;