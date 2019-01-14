require('../../users/models/users.server.model.js');
require('../../polls/models/polls.server.model.js');
const mongoose = require('mongoose');
const joi = require('joi');
const User = mongoose.model('user');
const Poll = mongoose.model('poll');

const mongoId = joi.string().length(24);

const populateBodySchema = joi.object().keys({
  path: joi.string().required(),
  select: joi.array().items(joi.string()).optional().default([])
});

const optionsBodySchema = joi.object().keys({
  safe: joi.boolean().optional()
});

const requestBodySchema = joi.object().keys({
    "method": joi.string().required().default('READ'),
    "collection": joi.string().required().default('users'),
    "data": joi.object().optional().default({}),
    "filter": joi.object().optional().default({}),
    "populate": joi.array().items(populateBodySchema).optional(),
    "select": joi.array().items(joi.string()).optional().default([]),
    "skip": joi.number().optional().default(0),
    "limit": joi.number().optional(),
    "options": optionsBodySchema
});

const validateRequestBody = function(req, res, next) {
  joi.validate(req.body, requestBodySchema, {'stripUnknown': true}, function(err, validated) {
    if (err) {
      return res.status(500).json({
        'errors': err.details[0].message,
      });
    } else {
      res.locals.dataBody = validated;
      if(res.locals.dataBody.method == 'UPDATE' || res.locals.dataBody.method == 'DELETE'){
        res.locals.dataBody.filters = { createdAt: res.locals.authUserId };
      }
      return next();
    }
  });
};

const modelList = {
  users: User,
  polls: Poll
}

function makeSelectObjectFromArray(selectList){
  let selectObject = {};
  selectList.forEach((keyName) => {
    selectObject[keyName] = 1;
  })
  return selectObject;
}

function doTask(Model, taskDetails){
  switch(taskDetails.method){
    case "CREATE":
      let newModelData = new Model(taskDetails.data);
      return newModelData.save();
      break;
    case "READ":
      return Model.find(taskDetails.filter, makeSelectObjectFromArray(taskDetails.select))
      .populate({ 'path': taskDetails.populate[0].path, 'select': makeSelectObjectFromArray(taskDetails.populate[0].select) })
      .skip(taskDetails.skip)
      .limit(taskDetails.limit)
      .lean();
      break;
    case "DELETE":
      return Model.remove(taskDetails.filter);
      break;
    case "UPDATE":
      return Model.update(taskDetails.filter, { $set: taskDetails.data }, taskDetails.options);
      break;
    default:
      return Promise.resolve({}); 
  }
}

const monqlAPIController = (req, res) => {
  console.log('req.body.dataBody', res.locals.dataBody);
  let Model = modelList[res.locals.dataBody.collection];
  doTask(Model, res.locals.dataBody)
  .then(taskResult => {
    res.json({
      "status": "success",
      "data": taskResult
    })
  })
  .catch(error => { 
    res.status(500).json({
      "status": "failed"
    })
  })
}

module.exports = {
  validateRequestBody,
  monqlAPIController
}