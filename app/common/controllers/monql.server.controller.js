require('../../users/models/users.server.model.js');
require('../../polls/models/polls.server.model.js');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Poll = mongoose.model('poll');

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
  console.log('req.body.collection', req.body.collection);
  let Model = modelList[req.body.collection];
  doTask(Model, req.body)
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
  monqlAPIController
}