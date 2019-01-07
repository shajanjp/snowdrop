const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.server.controller.js');

router.route('/')
.get(userController.getUsersUI);

module.exports = router;
