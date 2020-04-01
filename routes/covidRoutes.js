const express = require('express');

const covidController = require('./../controller/covidController');

const router = express.Router();

router.use(covidController.checkService);

router.get('/', covidController.getHome);
router.get('/affected-countries', covidController.getAffected);
router.get('/affected-countries/:countryCode', covidController.getCountry);

module.exports = router;
