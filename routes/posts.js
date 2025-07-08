const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
