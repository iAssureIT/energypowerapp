const express 	= require("express");
const router 	= express.Router();

const Division = require('./Controller.js');

router.post('/post', Division.insertDivisionMaster);

router.post('/get/list', Division.fetchDivisionMaster);

router.post('/get/reclist', Division.list_recoredrtypelist);

router.get('/get/count', Division.countDivisionMaster);

router.get('/get/one/:fieldID', Division.fetchSingleDivisionMaster);

router.get('/search/:str', Division.searchDivisionMaster);

router.patch('/patch', Division.updateDivisionMaster);

router.delete('/delete/:fieldID', Division.deleteDivisionMaster);

module.exports = router;