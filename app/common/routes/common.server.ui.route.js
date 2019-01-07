const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common.server.controller.js');

router.route('/')
.get(commonController.homeUI)

module.exports = router;