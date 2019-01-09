const joi = require('joi');
const mongoId = joi.string().length(24);

const pollInsertSchema = joi.object().keys({
  title: joi.string().allow('').optional().default(''),
  description: joi.string().allow('').optional().default(''),
  coverImage: joi.string().max(1024).allow('').optional().default(''),
  feedbackTitles: joi.array().items(joi.string()).default([]),
  expiryDate: joi.date().min('now')
});

exports.validateInsertPoll = function (req, res, next) {
  joi.validate(req.body, pollInsertSchema, { 'stripUnknown': true }, function (err, validated) {
    if(err)
      return res.status(500).json({ 
        "errors": err.details[0].message
      });
    else {
      res.locals.poll = validated;
      let feedbacks = [];
      res.locals.poll.feedbackTitles.forEach((title) => {
        feedbacks.push({
          title: title
        });
      })
      res.locals.poll.feedbacks = feedbacks;
      delete res.locals.poll.feedbackTitles;
      return next();
    }
  });
}