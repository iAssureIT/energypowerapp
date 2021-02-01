const express 	= require("express");
const router 	= express.Router();

const BrandsMaster = require('./Controller.js');

router.post('/post', BrandsMaster.insertBrandsMaster);

router.post('/get/list', BrandsMaster.fetchBrandsMaster);

router.get('/get/count', BrandsMaster.countBrandsMaster);

router.get('/get/one/:fieldID', BrandsMaster.fetchSingleBrandsMaster);

router.get('/search/:str', BrandsMaster.searchBrandsMaster);

router.patch('/patch', BrandsMaster.updateBrandsMaster);

router.delete('/delete/:fieldID', BrandsMaster.deleteBrandsMaster);

module.exports = router;

