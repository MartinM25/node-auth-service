require('dotenv').config();

const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Export App
module.exports = { app };

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

app.use('/api/users', userRoutes);