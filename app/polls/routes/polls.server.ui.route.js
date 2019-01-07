const express = require('express');
const router = express.Router();
const pollController = require('../controllers/polls.server.controller.js');
const pollValidator = require('../libraries/polls.server.validation.js');

router.route('/')
.post(pollValidator.validateInsertPoll, pollController.insertPoll)
.get(pollController.getPolls);

router.route('/:pollId')
.put(pollValidator.validateInsertPoll, pollController.updatePoll)
.get(pollController.getPoll)
.delete(pollController.removePoll)

router.param('pollId', pollController.pollbyId)

module.exports = router;