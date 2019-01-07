const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pollSchema = new Schema({
  title: String,
});

mongoose.model('poll', pollSchema);