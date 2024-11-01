require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

// Export App
module.exports = app;