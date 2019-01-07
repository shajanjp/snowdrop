const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.server.controller.js');

router.route('/')
.get(userController.getUsersAPI);

router.route('/:userId')
.put(userController.updateUserAPI)

module.exports = router;
