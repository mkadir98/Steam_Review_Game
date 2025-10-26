const mongoose = require('mongoose');
require('dotenv').config();

const migrateReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const reviewsCollection = db.collection('reviews');

    // Get all reviews
    const reviews = await reviewsCollection.find({}).toArray();
    console.log(`📝 Found ${reviews.length} reviews to migrate`);

    // Update each review
    for (const review of reviews) {
      if (review.reviewText && !review.reviewTexts) {
        // Convert old format to new format
        await reviewsCollection.updateOne(
          { _id: review._id },
          {
            $set: {
              reviewTexts: [review.reviewText],
              maxReviews: 1
            },
            $unset: {
              reviewText: ''
            }
          }
        );
        console.log(`   ✓ Migrated: ${review.gameName}`);
      } else if (review.reviewTexts) {
        console.log(`   ⏭️  Already migrated: ${review.gameName}`);
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('💡 Tip: You can now add more reviews to each game in the admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateReviews();

