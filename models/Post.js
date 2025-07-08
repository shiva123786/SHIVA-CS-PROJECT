// Post model schema with imageUrl
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: String, // announcement | summary | news | form
  imageUrl: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
