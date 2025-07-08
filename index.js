const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// ✅ Connect registration route
const registerRoute = require('./routes/register');
app.use('/api/register', registerRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));
