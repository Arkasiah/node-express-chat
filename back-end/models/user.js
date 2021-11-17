const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  timestamp: { type: Date, required: true },
  sessionid: { type: String, required: true },
  pseudo: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);