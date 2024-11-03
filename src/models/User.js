const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profilePicture: { 
    type: String 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    required: true, 
    unique: true 
  },
  passwordHash: { 
    type: String, 
    required: true,
  },
  role: { 
    type: String,
    required: true, 
    enum: ['agent', 'tenant', 'landlord']
  } 
});

module.exports = mongoose.model('User', userSchema);