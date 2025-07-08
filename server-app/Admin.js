// Admin login schema
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  password: String // NOTE: should be hashed in real projects
});

module.exports = mongoose.model('Admin', adminSchema);
