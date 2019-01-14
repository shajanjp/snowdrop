const express = require('express');
const router = express.Router();
const monqlController = require('../controllers/monql.server.controller.js'); 

router.post('/monql', monqlController.monqlAPIController);

module.exports = router;