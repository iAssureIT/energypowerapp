const express 	= require("express");
const router 	= express.Router();

const AddSite = require('./Controller.js');

router.post('/post', AddSite.create_site);

router.post('/get/list', AddSite.list_site);

router.post('/get/sitelist', AddSite.list_Allsites);

router.get('/get/one/:client_Id', AddSite.fetch_onesite);

router.patch('/patch', AddSite.update_site);

router.delete('/delete/:client_Id', AddSite.delete_site);

module.exports = router;