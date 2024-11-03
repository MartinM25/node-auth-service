require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Export App
module.exports = { app };