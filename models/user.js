const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  organization: String,
  panNumber: String,
  gst: String,
  eventType: String,
  eventName: String,
  eventDate: String,
  poster: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
