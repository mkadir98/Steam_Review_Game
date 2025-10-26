const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload all images to Cloudinary (without database update)
async function uploadAllImages() {
  try {
    const uploadsDir = path.join(__dirname, 'uploads/reviews');
    const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.png'));
    
    console.log(`📸 Found ${files.length} images to upload to Cloudinary\n`);

    let successCount = 0;
    let errorCount = 0;
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const filePath = path.join(uploadsDir, file);

        console.log(`⏳ Uploading ${file}...`);

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

        console.log(`✅ Uploaded: ${file}`);
        console.log(`   URL: ${result.secure_url}\n`);
        
        uploadedUrls.push({
          filename: file,
          url: result.secure_url,
          publicId: result.public_id
        });

        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`❌ Error uploading ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📸 Total: ${files.length}\n`);

    // Save URLs to file
    fs.writeFileSync(
      path.join(__dirname, 'cloudinary-urls.json'),
      JSON.stringify(uploadedUrls, null, 2)
    );

    console.log(`💾 All URLs saved to: cloudinary-urls.json`);
    console.log(`\n🎉 All images are now on Cloudinary!`);
    console.log(`📝 Next: Update your reviews in Admin Panel with these URLs\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadAllImages();

