// Registration API route
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

router.post('/', async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    await newReg.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
