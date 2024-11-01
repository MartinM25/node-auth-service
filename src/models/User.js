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
    default: '' },
  role: { 
    type: String, 
    enum: ['agent', 'tenant', 'landlord'],
    default: 'tenant',
  } 
});

module.exports = mongoose.model('User', userSchema);