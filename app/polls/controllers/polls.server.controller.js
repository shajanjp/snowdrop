const Poll = require('mongoose').model('poll');
const pollValidation = require('../libraries/polls.server.validation.js');

exports.pollbyId = (req, res, next, pollId) => {
  Poll.findOne({ _id: pollId })
  .then(pollFound => {
    res.locals.pollId = pollFound._id;
    next();
  })
  .catch(err => {
    return res.status(404).json({ 
      "message": 'Poll not found!',
      "errors": err
    });
  });
}

exports.insertPoll = (req, res) => {
  let newPoll = new Poll(res.locals.poll);
  newPoll.save()
  .then(pollSaved => {
    return res.status(201).json(pollSaved);
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.getPolls = (req, res) => {
  Poll.find({})
  .then(pollList => {
    return res.status(200).json(pollList);
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.updatePoll = (req, res) => {
  Poll.update({ _id: res.locals.pollId }, res.locals.poll, { safe: true })
  .then(pollUpdated => {
    return res.status(200).json({});
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.getPoll = (req, res) => {
  Poll.findOne({ _id: res.locals.pollId }).exec()
  .then(pollFound => {
    return res.status(200).json(pollFound);
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.removePoll = (req, res) => {
  Poll.remove({ _id: res.locals.pollId })
  .then(pollRemoved => {
    return res.status(200).json({});
  })
  .catch(err => {
    return res.satus(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}