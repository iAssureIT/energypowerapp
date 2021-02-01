const express 	= require("express");
const router 	= express.Router();

const AddProject = require('./Controller.js');

router.post('/post', AddProject.create_project);

router.post('/get/list', AddProject.list_project);

router.post('/get/projectlist', AddProject.list_AllProject);

router.get('/get/one/:client_Id', AddProject.fetch_oneproject);

router.patch('/patch', AddProject.update_project);

router.delete('/delete/:client_Id', AddProject.delete_project);

module.exports = router;