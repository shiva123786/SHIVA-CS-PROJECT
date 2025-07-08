const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads folder exists
const UPLOAD_FOLDER = 'public/uploads';
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer Upload with multiple file types
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 3 },
  { name: 'documents', maxCount: 5 },
]);

router.post('/', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const response = {
      images: req.files['images']?.map(f => `/uploads/${f.filename}`) || [],
      videos: req.files['videos']?.map(f => `/uploads/${f.filename}`) || [],
      documents: req.files['documents']?.map(f => `/uploads/${f.filename}`) || [],
    };

    res.status(200).json({ message: 'Files uploaded successfully', files: response });
  });
});

module.exports = router;
