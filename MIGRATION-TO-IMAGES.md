# Migration Guide: Text Reviews to Image Reviews

This document explains the changes made to convert the text-based review system to an image-based system using Steam review screenshots.

## What Changed

### Backend Changes

1. **Database Schema** (`server/models/Review.js`)
   - Changed `reviewTexts` field to `reviewImages`
   - Structure remains the same: `{ en: [], fr: [], es: [], it: [], de: [], tr: [] }`
   - Each array now contains image paths (strings) instead of text

2. **File Upload System**
   - Installed `multer` package for handling file uploads
   - Created `server/uploads/reviews/` directory for storing images
   - Configured Express to serve static files from `/uploads`
   - Added upload endpoint: `POST /api/admin/reviews/upload-image`

3. **API Endpoints Updated**
   - `GET /api/game/random` - Now returns `reviewImages` instead of `reviewTexts`
   - `GET /api/game/daily` - Now returns `reviewImages` instead of `reviewTexts`
   - `POST /api/admin/reviews` - Now accepts `reviewImages` instead of `reviewTexts`
   - `PUT /api/admin/reviews/:id` - Now accepts `reviewImages` instead of `reviewTexts`

4. **File Upload Specifications**
   - Supported formats: JPEG, JPG, PNG, WebP
   - Maximum file size: 5MB
   - Unique filename generation: `review-{timestamp}-{random}.{ext}`
   - Admin authentication required

### Frontend Changes

1. **Game Display Components**
   - `ReviewCard.tsx` - Now displays image instead of text
   - `MultiReviewCard.tsx` - Shows multiple images with animation
   - Images are loaded from server's `/uploads` endpoint

2. **Admin Panel** (`AdminPanel.tsx`)
   - Replaced textarea inputs with file upload inputs
   - Added image preview after upload
   - Shows thumbnail grid in review list
   - Upload progress indicators
   - Delete uploaded image functionality

3. **TypeScript Interfaces**
   - Updated `Review` interface in all components
   - Changed `reviewTexts: string[]` to `reviewImages: string[]`

4. **Environment Types**
   - Added `vite-env.d.ts` for TypeScript support of `import.meta.env`

## How to Use

### For Admins: Adding Reviews with Images

1. **Navigate to Admin Panel**
   - Log in as admin
   - Click "Admin Panel" in navigation

2. **Add New Review**
   - Click "+ Add New Review" button
   - Fill in game name, genre, difficulty
   - Select language tab (English, French, Spanish, etc.)

3. **Upload Review Screenshots**
   - Click "Choose File" for Review Image 1, 2, or 3
   - Select a Steam review screenshot from your computer
   - Wait for upload to complete (you'll see a loading spinner)
   - Preview will appear below the upload button
   - Repeat for additional reviews (up to 3 per language)

4. **Multiple Languages**
   - Switch between language tabs
   - Upload images for each language you want to support
   - At least one language must have at least one image

5. **Save**
   - Click "Add Review" or "Update Review"
   - Review will appear in the game

### Taking Steam Review Screenshots

1. **Find a review on Steam**
   - Go to the game's Steam page
   - Scroll to the reviews section
   - Find an interesting/distinctive review

2. **Take screenshot**
   - Use Windows Snipping Tool (Win + Shift + S)
   - Or use screenshot software of your choice
   - Capture the entire review card including:
     - Thumbs up/down icon
     - Username
     - Playtime
     - Review text
     - Helpful votes

3. **Upload**
   - Save screenshot as JPEG or PNG
   - Upload through admin panel

## Data Migration

### Important Notes

⚠️ **Existing text-based reviews will NOT work with the new system!**

All existing reviews in the database have `reviewTexts` field, but the new code expects `reviewImages` field. You have two options:

### Option 1: Start Fresh (Recommended)

1. Delete all existing reviews from the admin panel
2. Add new reviews with images

### Option 2: Manual Database Migration

If you want to keep existing reviews, you need to:

1. Mark all old reviews as inactive:
   ```javascript
   db.reviews.updateMany({ reviewTexts: { $exists: true } }, { $set: { isActive: false } })
   ```

2. Then add new image-based reviews

## File Structure

```
server/
├── uploads/
│   ├── reviews/                 # Uploaded review images
│   │   ├── .gitkeep            # Keeps directory in git
│   │   └── review-*.jpg        # Uploaded images
│   ├── .gitignore              # Prevents committing uploads
│   └── README.md               # Documentation
├── models/
│   └── Review.js               # ✓ Updated schema
├── routes/
│   └── admin.js                # ✓ Added upload endpoint
├── controllers/
│   ├── gameController.js       # ✓ Updated to use reviewImages
│   └── reviewController.js     # ✓ Updated CRUD operations
└── server.js                   # ✓ Added static file serving

client/
├── src/
│   ├── components/
│   │   ├── ReviewCard.tsx      # ✓ Displays images
│   │   ├── MultiReviewCard.tsx # ✓ Multiple images
│   │   └── GameBoard.tsx       # ✓ Updated interfaces
│   ├── pages/
│   │   ├── AdminPanel.tsx      # ✓ File upload UI
│   │   └── DailyChallenge.tsx  # ✓ Updated interfaces
│   └── vite-env.d.ts           # ✓ Environment types
```

## API Examples

### Upload Image

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await api.post('/admin/reviews/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Returns: { success: true, imagePath: '/uploads/reviews/review-123.jpg', filename: 'review-123.jpg' }
```

### Create Review with Images

```javascript
await api.post('/admin/reviews', {
  reviewImages: {
    en: ['/uploads/reviews/review-123.jpg', '/uploads/reviews/review-124.jpg'],
    fr: ['/uploads/reviews/review-125.jpg']
  },
  gameName: 'Elden Ring',
  genre: 'Action RPG',
  gameImage: 'https://...',
  difficulty: 'medium'
});
```

### Get Random Review

```javascript
const response = await api.get('/game/random', {
  params: { language: 'en' }
});

// Returns:
// {
//   id: '...',
//   reviewImages: ['/uploads/reviews/review-123.jpg', '/uploads/reviews/review-124.jpg'],
//   gameImage: 'https://...',
//   difficulty: 'medium',
//   maxReviews: 2
// }
```

## Troubleshooting

### Images not displaying

1. **Check server is serving static files**
   - Verify `server.js` has: `app.use('/uploads', express.static(...))`
   - Check uploads folder exists: `server/uploads/reviews/`

2. **Check image paths**
   - Should start with `/uploads/reviews/`
   - Full URL: `http://localhost:5000/uploads/reviews/review-123.jpg`

3. **Check CORS settings**
   - Server must allow requests from client origin

### Upload failing

1. **Check file size** - Must be under 5MB
2. **Check file type** - Only JPEG, PNG, WebP allowed
3. **Check authentication** - Must be logged in as admin
4. **Check permissions** - Server must have write access to uploads folder

### Old reviews showing errors

This is expected! Old text-based reviews are incompatible.

**Solution:** Mark them as inactive or delete them, then add new image-based reviews.

## Environment Variables

Make sure your `.env` files are configured:

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

## Testing Checklist

- [ ] Server starts without errors
- [ ] Admin can upload images
- [ ] Images display in admin panel list
- [ ] Images display in game (Free Play)
- [ ] Images display in Daily Challenge
- [ ] Multiple images work (show next review)
- [ ] Image delete button works
- [ ] Language switching works
- [ ] Edit existing review works
- [ ] Image URLs are correct

## Benefits of Image-Based System

1. **More Engaging** - Real Steam reviews are more interesting than plain text
2. **Authentic** - Shows actual Steam interface, more recognizable
3. **Visual Context** - Includes user stats, thumbs up/down, helpful votes
4. **Better UX** - More visually appealing gameplay experience
5. **Flexibility** - Can include reviews in any language with proper screenshots

## Future Improvements

Potential enhancements:
- Image compression/optimization on upload
- Multiple file upload at once
- Drag & drop support
- Image cropping tool
- Bulk import from CSV/JSON
- CDN integration for better performance

