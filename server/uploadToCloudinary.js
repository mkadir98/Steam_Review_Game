const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Review = require('./models/Review');

// Upload all images to Cloudinary and update database
async function uploadAllImages() {
  try {
    const uploadsDir = path.join(__dirname, 'uploads/reviews');
    const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.png'));
    
    console.log(`📸 Found ${files.length} images to upload\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(uploadsDir, file);
        const localImagePath = `/uploads/reviews/${file}`;

        // Find review with this local image path
        const review = await Review.findOne({ gameImage: localImagePath });

        if (!review) {
          console.log(`⚠️  No review found for ${file}`);
          continue;
        }

        console.log(`⏳ Uploading ${file} for game: ${review.gameName}`);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'steam-reviews',
          public_id: file.replace('.png', ''),
          overwrite: true,
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        // Update database with Cloudinary URL
        review.gameImage = result.secure_url;
        await review.save();

        console.log(`✅ Uploaded: ${review.gameName}`);
        console.log(`   URL: ${result.secure_url}\n`);
        
        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error uploading ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📸 Total: ${files.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadAllImages();

