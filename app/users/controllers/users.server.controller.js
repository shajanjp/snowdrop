const mongoose = require('mongoose');
const User = mongoose.model('user');

let namesList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidorina", "Nidoqueen", "Nidoran", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb"];

function randomName(){
  let randomNum = Math.floor(Math.random() * (namesList.length - 1) + 1);
  return namesList[randomNum];
}

function authUser(req, res, next){
  let ipAddress = req.connection.remoteAddress || '::ffff:UN.KN.OW.N';
  if(ipAddress == '::1')
    ipAddress = '::ffff:UN.KN.OW.N';
  ipAddress = ipAddress.split('::ffff:')[1];

  User.findOne({ipAddress: ipAddress}).lean()
  .then(usersFound => {
    if(usersFound && usersFound.ipAddress){
      res.locals.authUserId = usersFound._id;
      next();
    }
    else {
      let newUser = new User({
        ipAddress: ipAddress,
        fullName: randomName(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      newUser.save()
      .then(userSaved => {
        res.locals.authUserId = userSaved._id;
        next()
      })
      .catch(error => {
        console.log('authUser', error);
        res.json({
          message: 'Could not auth user'
        })
      });
    }
  })
  .catch(error => {
    console.log('authUser', error);
    res.json({
      message: 'Could not auth user'
    })
  })
}

function getUsersAPI(req, res) {
  User.find({}, {fullName: 1, ipAddress: 1}).lean()
  .then(usersFound => {
    res.json({
      data: usersFound
    })
  })
  .catch(error => {
    res.status(500).json({
      message: 'Could not fetch users'
    })
  })
}

function getUsersUI(req, res){
  User.find({}, {fullName: 1, ipAddress: 1}).lean()
  .then(usersFound => {
    res.render('users/views/users', { usersList: usersFound })
  })
  .catch(error => {
    console.log('getUsersUI error', error);
    res.status(500).json({
      message: 'Could not fetch users'
    })
  })
}

function updateUserAPI(req, res){
  res.json({})
}

module.exports = {
  getUsersAPI,
  authUser,
  getUsersUI,
  updateUserAPI
}