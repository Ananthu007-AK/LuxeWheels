// middleware/multer.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads'; // Relative to project root
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `images-${Date.now()}${path.extname(file.originalname).toLowerCase()}`); // Unique filename with lowercase extension
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Error: Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
  }
});

module.exports = upload;