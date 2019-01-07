const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  ipAddress: String,
  fullName: String,
  status: String,
  createdAt: Date,
  updatedAt: Date,
});

mongoose.model('user', userSchema);
