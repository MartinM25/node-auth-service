const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profilePicture: { type: String },
  name: { type: String, required: true },
  password: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', userSchema);