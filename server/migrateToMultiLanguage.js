const mongoose = require('mongoose');
const Review = require('./models/Review');
require('dotenv').config();

const migrateToMultiLanguage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all reviews
    const reviews = await Review.find({});
    
    console.log(`📊 Found ${reviews.length} reviews to migrate\n`);
    console.log('🔄 Migrating to multi-language structure...\n');

    let migrated = 0;
    let skipped = 0;

    for (const review of reviews) {
      // Check if already in new format (reviewTexts is an object with language keys)
      if (review.reviewTexts && typeof review.reviewTexts === 'object' && 
          !Array.isArray(review.reviewTexts) &&
          review.reviewTexts.en !== undefined) {
        console.log(`   ⏭️  Skipped: ${review.gameName} (already migrated)`);
        skipped++;
        continue;
      }

      // Get old data
      const oldReviewTexts = Array.isArray(review.reviewTexts) 
        ? review.reviewTexts 
        : (review.reviewText ? [review.reviewText] : []);
      
      const language = review.language || 'en';

      // Create new structure
      const newReviewTexts = {
        en: language === 'en' ? oldReviewTexts : [],
        fr: language === 'fr' ? oldReviewTexts : [],
        es: language === 'es' ? oldReviewTexts : [],
        it: language === 'it' ? oldReviewTexts : [],
        de: language === 'de' ? oldReviewTexts : [],
        tr: language === 'tr' ? oldReviewTexts : []
      };

      // Update with unset to remove old fields
      await Review.updateOne(
        { _id: review._id },
        { 
          $set: { reviewTexts: newReviewTexts },
          $unset: { language: '', reviewText: '' }
        }
      );

      console.log(`   ✓ Migrated: ${review.gameName} (${language})`);
      migrated++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   📈 Migrated: ${migrated} reviews`);
    console.log(`   ⏭️  Skipped: ${skipped} reviews (already migrated)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

migrateToMultiLanguage();

