const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

const DJANGO_SERVICE_URL = 'http://127.0.0.1:8000/api/chats/'

// User Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    // Check if Email is in the DB
    if (existingUser) return res.status(400).json(
      { message: 'User Already Exits' }
    );

    // Validate role
    const allowedRoles = ['agent', 'tenant', 'landlord'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role });
    await user.save();

    res.status(201).json(
      { message: 'User Registered Successfully' }
    );
  } catch (err) {
    res.status(400).json(
      { message: 'Server error' }
    );
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json(
      { message: 'User not found' }
    );

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json(
      { message: 'Invalid Credentials' }
    )

    const payload = {
      user_id: user._id, // Make sure this matches with what you expect in Django
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile Retrieval Route
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('name email profilePicture role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile Update Route
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only fields provided in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Chat
router.post('/create-chat', async (req, res) => {
  try {
    const response = await axios.post(`${DJANGO_SERVICE_URL}create/`, req.body, {
      headers: {
        'Authorization': req.headers.authorization, // Pass along the auth header
        'Content-Type': 'application/json',
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Fetch User Chats
router.get('/get-chats', authenticate, async (req, res) => {
  try {
    const response = await axios.get(`${DJANGO_SERVICE_URL}user-chats/`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;


