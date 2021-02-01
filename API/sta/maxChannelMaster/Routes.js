const express 	= require("express");
const router 	= express.Router();

const Maxchannels = require('./Controller.js');

router.post('/post', Maxchannels.insertmaxchannels);

router.post('/get/list', Maxchannels.fetchmaxchannels);

router.get('/get/count', Maxchannels.countmaxchannels);

router.get('/get/one/:fieldID', Maxchannels.fetchSinglemaxchannels);

router.get('/search/:str', Maxchannels.searchmaxchannels);

router.patch('/patch', Maxchannels.updatemaxchannels);

router.delete('/delete/:fieldID', Maxchannels.deletemaxchannels);

module.exports = router;