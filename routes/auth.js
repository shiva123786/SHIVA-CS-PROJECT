// Admin login route
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'chaitanya-secret';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
