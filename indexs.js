// ✅ Step 1: Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Step 2: Create express app
const app = express();

// ✅ Step 3: Apply middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// ✅ Step 4: Import and use routes
const registerRoute = require('./routes/register');
const postRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const uploadRoute = require('./routes/upload');

app.use('/api/register', registerRoute);
app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);
app.use('/api/upload', uploadRoute);

// ✅ Step 5: Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Step 6: Start server
app.listen(5000, () => console.log('Server running on port 5000'));
