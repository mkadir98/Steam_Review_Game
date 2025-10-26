const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} = require('../controllers/reviewController');
const {
  getAllChallenges,
  getCurrentChallenge,
  getNextChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge
} = require('../controllers/dailyChallengeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/reviews'));
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (increased from 5MB)
  }
});

// All routes require auth and admin privileges
router.use(authMiddleware, adminMiddleware);

// @route   GET /api/admin/reviews/stats
router.get('/reviews/stats', getReviewStats);

// @route   POST /api/admin/reviews/upload-image
// @desc    Upload a single review image
router.post('/reviews/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the relative path to be stored in the database
    const imagePath = `/uploads/reviews/${req.file.filename}`;
    
    res.json({ 
      success: true,
      imagePath: imagePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// @route   GET /api/admin/reviews
router.get('/reviews', getAllReviews);

// @route   GET /api/admin/reviews/:id
router.get('/reviews/:id', getReview);

// @route   POST /api/admin/reviews
router.post('/reviews', createReview);

// @route   PUT /api/admin/reviews/:id
router.put('/reviews/:id', updateReview);

// @route   DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', deleteReview);

// Daily Challenge Routes
// @route   GET /api/admin/daily-challenges
router.get('/daily-challenges', getAllChallenges);

// @route   GET /api/admin/daily-challenges/current
router.get('/daily-challenges/current', getCurrentChallenge);

// @route   GET /api/admin/daily-challenges/next
router.get('/daily-challenges/next', getNextChallenge);

// @route   POST /api/admin/daily-challenges
router.post('/daily-challenges', createChallenge);

// @route   PUT /api/admin/daily-challenges/:id
router.put('/daily-challenges/:id', updateChallenge);

// @route   DELETE /api/admin/daily-challenges/:id
router.delete('/daily-challenges/:id', deleteChallenge);

module.exports = router;


