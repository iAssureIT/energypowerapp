const express 	= require("express");
const router 	= express.Router();

const RolesEntityMaster = require('./Controller.js');


router.post('/post', RolesEntityMaster.insertDocuments);

router.post('/get/list', RolesEntityMaster.fetchDocuments);

router.get('/get/list', RolesEntityMaster.getDocuments);

router.get('/get/count', RolesEntityMaster.countdocuments);

router.get('/get/one/:fieldID', RolesEntityMaster.fetchSingleDocument);

router.get('/search/:str', RolesEntityMaster.searchDocuments);

router.patch('/patch', RolesEntityMaster.updateDocument);

router.delete('/delete/:fieldID', RolesEntityMaster.deletedocument);


router.get('/get/filedetails/:fileName', RolesEntityMaster.filedetails);

module.exports = router;