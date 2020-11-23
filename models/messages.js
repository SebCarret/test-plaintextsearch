const mongoose = require('mongoose');

var messagesSchema = mongoose.Schema({
  subject: String,
  content: String,
  like: Number,
  year: Number,
  language: String,
});

messagesSchema.index({subject: "text", content: "text"});

module.exports = mongoose.model('messages', messagesSchema);