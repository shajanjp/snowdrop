const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pollSchema = new Schema({
  title: String,
  description: String,
  coverImage: String,
  feedbacks: [{
    title: String,
    users: [{
      type: Schema.ObjectId,
      ref: 'user'
    }]
  }],
  createdBy: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  createdDate: Date, 
  updateDate: Date,
  expiryDate: Date,
});

mongoose.model('poll', pollSchema);