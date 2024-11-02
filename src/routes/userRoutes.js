const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    // Check if Email is in the DB
    if (existingUser) return res.status(400).json(
      { message: 'User Already Exits'}
    );

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User ({ name, email, passwordHash });
    await user.save();

    res.status(201).json(
      { message: 'User Registered Successfully'}
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
      { message: 'Invalid Credentials' }
    );

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json(
      { message: 'Invalid Credentials' }
    )

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile Retrieval Route
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email profilePicture role');
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
    const user = await User.findById(req.user.id);
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

module.exports = router;