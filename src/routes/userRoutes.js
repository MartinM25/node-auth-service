const router = express.Router();
const express = require('express');
const User = require('../models/User');

// User Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User ({ name, email, passoword });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;