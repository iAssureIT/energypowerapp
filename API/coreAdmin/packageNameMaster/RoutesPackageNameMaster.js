const express 	= require("express");
const router 	= express.Router();

const PackageNameMaster = require('./ControllerPackageNameMaster.js');

router.post('/post', 					PackageNameMaster.insertPackageName);

router.get('/get/list', 				PackageNameMaster.getPackageNameList);

router.post('/get/list', 				PackageNameMaster.fetchPackageNameList); 

router.get('/get/list/:packageTypeID',  PackageNameMaster.fetchSortedPackageNameList); 
 
router.get('/get/one/:fieldID', 		PackageNameMaster.fetchSinglePackageName);

router.patch('/patch', 					PackageNameMaster.updatePackageName);

router.delete('/delete/:fieldID', 		PackageNameMaster.deletePackageName);

module.exports = router;