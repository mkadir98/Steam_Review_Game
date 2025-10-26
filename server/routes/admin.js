const express = require('express');
const router = express.Router();
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

// Cloudinary configuration
const { upload } = require('../config/cloudinary');

// All routes require auth and admin privileges
router.use(authMiddleware, adminMiddleware);

// @route   GET /api/admin/reviews/stats
router.get('/reviews/stats', getReviewStats);

// @route   POST /api/admin/reviews/upload-image
// @desc    Upload a single review image to Cloudinary
router.post('/reviews/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { cloudinary } = require('../config/cloudinary');

    // Upload buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'steam-reviews',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ 
      success: true,
      imagePath: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.secure_url
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


