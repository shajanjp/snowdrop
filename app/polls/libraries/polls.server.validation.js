const joi = require('joi');
const mongoId = joi.string().length(24);

const pollInsertSchema = joi.object().keys({
  
  title: joi.string().allow('').optional(),
});

exports.validateInsertPoll = function (req, res, next) {
  joi.validate(req.body, pollInsertSchema, { 'stripUnknown': true }, function (err, validated) {
    if(err)
      return res.status(500).json({ 
        "errors": err.details[0].message
      });
    else {
      res.locals.poll = validated;
      return next();
    }
  });
}