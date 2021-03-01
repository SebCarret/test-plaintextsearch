const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    pwd: String,
    token: String
});

module.exports = mongoose.model('users', userSchema);