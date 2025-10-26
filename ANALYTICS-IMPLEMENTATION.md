# Analytics System Implementation

## Overview
A comprehensive real-time analytics dashboard has been implemented for the Steam Review Quiz Game. This system provides live statistics through WebSocket connections and tracks detailed game metrics including joker usage.

## Features Implemented

### 1. Real-Time WebSocket Communication
- **Socket.IO Integration**: Server broadcasts stats updates every 5 seconds
- **Live Connection Indicator**: Green dot shows when connected
- **Admin Authentication**: Only admin users can access analytics via JWT token

### 2. Global Statistics
- **Total Users**: Count of all registered users
- **Online Users**: Live count of active WebSocket connections
- **Total Games Played**: Sum of all review plays across the platform
- **Total Correct Answers**: Sum of all correct guesses

### 3. Hardest Review Display
- Shows the review with the lowest success rate
- Displays game name, image, difficulty, success rate, and total attempts
- Highlighted with a special "🔥 Hardest Review" card

### 4. Detailed Review Statistics Table
For each review, the following metrics are displayed:
- **Game Name & Image**: Visual identification
- **Difficulty**: Easy, Medium, or Hard
- **Total Plays**: Number of times the review was shown
- **Success Rate**: Percentage of correct answers (color-coded)
  - 🟢 Green: ≥70%
  - 🟡 Yellow: 40-69%
  - 🔴 Red: <40%
- **Skip Usage**: Percentage and count with progress bar
- **Hint Usage**: Percentage and count with progress bar

### 5. Sorting & Filtering
- Click column headers to sort by:
  - Game Name
  - Total Plays
  - Success Rate
  - Skip Percentage
  - Hint Percentage
- Toggle ascending/descending order

## Backend Changes

### New Files
1. **`server/controllers/analyticsController.js`**
   - `getGlobalStats()`: Returns total users, games played, correct answers
   - `getReviewStats()`: Returns detailed stats for all reviews
   - `getReviewStatsById()`: Returns stats for a specific review
   - `getHardestReview()`: Returns the review with lowest success rate

2. **`server/routes/analytics.js`**
   - `GET /api/analytics/global`: Global statistics
   - `GET /api/analytics/reviews`: All review statistics
   - `GET /api/analytics/reviews/:id`: Specific review statistics
   - `GET /api/analytics/hardest`: Hardest review

3. **`server/socket.js`**
   - WebSocket server initialization
   - Admin authentication middleware
   - Stats broadcasting every 5 seconds
   - Online user tracking

### Modified Files
1. **`server/models/Review.js`**
   - Added `analytics` field with:
     - `totalPlays`: Total times played
     - `correctAnswers`: Number of correct answers
     - `incorrectAnswers`: Number of incorrect answers
     - `skips`: Number of times skipped
     - `hints`: Number of times hint was used

2. **`server/controllers/gameController.js`**
   - Updated `verifyAnswer()`: Tracks correct/incorrect answers
   - Updated `getHint()`: Tracks hint usage
   - Updated `getRandomReview()`: Tracks total plays
   - Added `trackSkip()`: Tracks skip actions

3. **`server/routes/game.js`**
   - Added `POST /api/game/skip`: Track skip actions

4. **`server/server.js`**
   - Integrated Socket.IO with HTTP server
   - Added analytics routes
   - Initialized WebSocket handlers

## Frontend Changes

### New Files
1. **`client/src/hooks/useAnalytics.ts`**
   - Custom React hook for WebSocket connection
   - Handles authentication with JWT token
   - Manages connection state and data updates
   - Auto-reconnection on disconnect

2. **`client/src/components/StatsCard.tsx`**
   - Reusable card component for displaying metrics
   - Animated appearance
   - Customizable icon, label, value, and background color

3. **`client/src/components/ReviewStatsTable.tsx`**
   - Comprehensive table showing all review statistics
   - Sortable columns
   - Progress bars for skip/hint percentages
   - Color-coded success rates
   - Responsive design

4. **`client/src/components/AdminAnalytics.tsx`**
   - Main analytics dashboard component
   - Live connection indicator
   - Global stats cards
   - Hardest review display
   - Review statistics table
   - Last updated timestamp

### Modified Files
1. **`client/src/pages/AdminPanel.tsx`**
   - Added "Analytics" tab
   - Integrated `AdminAnalytics` component
   - Tab switching functionality

2. **`client/src/components/GameBoard.tsx`**
   - Updated `handleSkip()`: Calls skip tracking API

## How to Use

### For Admins
1. **Access Analytics**:
   - Log in as an admin user
   - Navigate to Admin Panel
   - Click the "Analytics" tab

2. **View Live Stats**:
   - Green indicator shows live connection
   - Stats update automatically every 5 seconds
   - No manual refresh needed

3. **Analyze Data**:
   - View global platform statistics
   - Identify the hardest review
   - Sort reviews by various metrics
   - See detailed joker usage per review

### For Developers

#### Starting the System
```bash
# Start the server (includes WebSocket)
cd server
npm start

# Start the client
cd client
npm run dev
```

#### WebSocket Connection
The client automatically connects to the WebSocket server when an admin opens the Analytics page. The connection uses the JWT token from localStorage for authentication.

#### Adding New Analytics
To track new metrics:
1. Add field to `Review.analytics` in `server/models/Review.js`
2. Track the metric in relevant controller
3. Include in `broadcastStats()` in `server/socket.js`
4. Update frontend interfaces in `useAnalytics.ts`
5. Display in `AdminAnalytics.tsx` or `ReviewStatsTable.tsx`

## Technical Details

### WebSocket Events
- **Event**: `stats-update`
- **Frequency**: Every 5 seconds
- **Payload**:
  ```typescript
  {
    globalStats: {
      totalUsers: number,
      onlineUsers: number,
      totalGamesPlayed: number,
      totalCorrectAnswers: number
    },
    hardestReview: {
      _id: string,
      gameName: string,
      gameImage: string,
      difficulty: string,
      totalPlays: number,
      successRate: number
    } | null,
    reviewStats: ReviewStat[],
    timestamp: string
  }
  ```

### Authentication
- WebSocket connections require JWT token
- Only users with `isAdmin: true` can connect
- Token passed via `socket.handshake.auth.token`

### Performance Considerations
- Stats are calculated on-demand (no caching yet)
- Review stats limited to top 50 to reduce payload size
- Aggregation pipelines used for efficient calculations
- Consider adding Redis caching for high-traffic scenarios

## Testing

### Test Analytics Tracking
1. Play some games (both daily and free play)
2. Use skip and hint jokers
3. Submit correct and incorrect answers
4. Open Admin Panel → Analytics tab
5. Verify stats are displayed correctly

### Test Real-Time Updates
1. Open Analytics page in one browser
2. Play games in another browser/tab
3. Watch stats update automatically every 5 seconds

### Test WebSocket Connection
1. Check browser console for "Connected to WebSocket server"
2. Green indicator should show "🟢 LIVE"
3. Last updated timestamp should refresh every 5 seconds

## Future Enhancements
- [ ] Redis caching for stats
- [ ] Historical data tracking (daily/weekly trends)
- [ ] Export analytics to CSV/Excel
- [ ] User-specific analytics (per-player stats)
- [ ] Real-time charts and graphs
- [ ] Email reports for admins
- [ ] Custom date range filtering
- [ ] A/B testing metrics

## Dependencies Added
- **Server**: `socket.io` (^4.x)
- **Client**: `socket.io-client` (^4.x)

## Environment Variables
No new environment variables required. Uses existing:
- `CLIENT_URL`: For CORS configuration
- `JWT_SECRET`: For WebSocket authentication

## API Endpoints Summary

### Analytics Routes (Admin Only)
- `GET /api/analytics/global` - Global platform stats
- `GET /api/analytics/reviews` - All review stats
- `GET /api/analytics/reviews/:id` - Single review stats
- `GET /api/analytics/hardest` - Hardest review

### Game Routes (Public)
- `POST /api/game/skip` - Track skip action

### WebSocket
- `ws://localhost:5000` - Real-time stats updates

## Troubleshooting

### WebSocket Connection Failed
- **Issue**: "Authentication error" or "Admin access required"
- **Solution**: Ensure you're logged in as an admin user

### Stats Not Updating
- **Issue**: Green indicator shows but stats are stale
- **Solution**: Check server console for aggregation errors

### Missing Review Stats
- **Issue**: Some reviews show 0 plays despite being played
- **Solution**: Ensure all game actions properly track analytics

### High Server Load
- **Issue**: Server slows down with WebSocket
- **Solution**: Reduce broadcast frequency or implement caching

## Support
For issues or questions, check:
1. Browser console for frontend errors
2. Server logs for backend errors
3. Network tab for WebSocket connection status

