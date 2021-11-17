const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  timestamp: { type: Date, required: true },
  sessionid: { type: String, required: true },
  pseudo: { type: String, required: true },
  message: {type: String, required: true},
});

module.exports = mongoose.model('Message', messageSchema);