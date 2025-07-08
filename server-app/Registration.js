// Registration model schema
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  orgName: String,
  panCard: String,
  address: String,
  gst: String,
  eventType: String,
  eventName: String,
  eventDate: String,
  fullName: String,
  email: String,
  phone: String
});

module.exports = mongoose.model('Registration', registrationSchema);
