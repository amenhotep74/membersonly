const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    require: true,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
