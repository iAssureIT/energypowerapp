const express 	= require("express");
const router 	= express.Router();

const Tasktype = require('./Controller.js');

router.post('/post', Tasktype.inserttaskType);

router.post('/get/list', Tasktype.fetchtaskType);

router.get('/get/count', Tasktype.counttaskType);

router.get('/get/one/:fieldID', Tasktype.fetchSingletaskType);

router.get('/search/:str', Tasktype.searchtaskType);

router.patch('/patch', Tasktype.updatetaskType);

router.delete('/delete/:fieldID', Tasktype.deletetaskType);

module.exports = router;