const mongoose = require('mongoose');
const Review = require('./models/Review');
const sampleReviews = require('./sampleReviews.json');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing reviews (optional - comment out if you want to keep existing data)
    // await Review.deleteMany({});
    // console.log('🗑️  Cleared existing reviews');

    // Insert sample reviews one by one (so pre-save middleware runs)
    console.log('📝 Inserting reviews...');
    const insertedReviews = [];
    
    for (const reviewData of sampleReviews) {
      const review = await Review.create(reviewData);
      insertedReviews.push(review);
      console.log(`   ✓ ${review.gameName} (${review.genre})`);
    }
    
    console.log(`\n✅ Inserted ${insertedReviews.length} sample reviews`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


