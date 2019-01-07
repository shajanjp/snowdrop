const User = require('../../users/models/users.server.model.js');
const Poll = require('../../polls/models/polls.server.model.js');

function homeUI(req, res){
  res.render('common/views/home.ejs');
}

module.exports = {
  homeUI  
}