<!-- a07caf42-f655-4060-aca9-c38c8caa0514 fc656e0e-97d5-465d-b6c9-72b08acc8c0e -->
# Steam Review Quiz Game - MERN Stack Implementation

## Architecture Overview

**Frontend**: React.js (Vite) + TailwindCSS + React Router

**Backend**: Node.js + Express.js + MongoDB (Mongoose)

**Deployment**: Vercel (Frontend + Serverless Functions for Backend)

**Authentication**: JWT tokens + bcrypt

## Database Schema (MongoDB)

### Collections:

1. **users**: User accounts with scores and statistics

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - email, password (hashed), username, totalScore, gamesPlayed, streak

2. **reviews**: Steam review entries (admin-managed)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - reviewText, gameName, genre, gameImage, difficulty, isActive, dateAdded

3. **dailyChallenges**: Daily review sets (auto-generated)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - date, reviewIds (array), expiresAt

4. **scores**: Score history for registered users

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - userId, gameMode (daily/freeplay), score, date, reviewsCompleted

## Core Features Implementation

### 1. Frontend Structure

```
/client
  /src
    /components
   - Header.jsx (navigation, user info)
   - GameBoard.jsx (main game interface)
   - ReviewCard.jsx (displays Steam review)
   - AnswerInput.jsx (autocomplete input for game name)
   - JokerButtons.jsx (skip & genre hint buttons)
   - ScoreDisplay.jsx (current score, streak)
   - Leaderboard.jsx (top scores)
   - AuthModal.jsx (login/register modal)
    /pages
   - Home.jsx (mode selection: daily/freeplay)
   - DailyChallenge.jsx
   - FreePlay.jsx
   - AdminPanel.jsx (protected route)
   - Profile.jsx (user stats)
    /context
   - AuthContext.jsx (user authentication state)
   - GameContext.jsx (game state management)
    /utils
   - api.js (axios instance for API calls)
   - gameLogic.js (score calculation, joker logic)
```

### 2. Backend Structure

```
/server
  /models
  - User.js (Mongoose schema)
  - Review.js
  - DailyChallenge.js
  - Score.js
  /routes
  - auth.js (register, login, logout)
  - reviews.js (CRUD for reviews - admin only)
  - game.js (get daily challenge, get random reviews)
  - scores.js (submit score, get leaderboard)
  - admin.js (admin panel operations)
  /middleware
  - authMiddleware.js (JWT verification)
  - adminMiddleware.js (admin role check)
  /controllers
  - authController.js
  - reviewController.js
  - gameController.js
 - server.js (main entry point)
```

## Key Game Mechanics

### Scoring System

- **Correct Answer**: +100 points
- **Using Skip Joker**: -30 points from potential score
- **Using Genre Hint**: -20 points cost
- **Streak Bonus**: +10 points per consecutive correct answer
- **Guest Mode**: Can play but scores not saved

### Joker System

1. **Skip Button**: 

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Shows new review
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Reduces score by 30 points
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Unlimited uses (but score penalty)

2. **Genre Hint**: 

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Costs 20 points from current score
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Displays game genre (e.g., "Action RPG")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Can only use if score >= 20

### Daily Challenge Mode

- 5 reviews per day (same for all users)
- One attempt per day
- Special leaderboard for daily challenge
- Resets at midnight UTC
- Guest users can play but not appear on leaderboard

### Free Play Mode

- Unlimited random reviews
- Practice mode with score tracking (for registered users)
- No daily limit

## Admin Panel Features

- Add new review (reviewText, gameName, genre, optional gameImage URL)
- Edit/Delete existing reviews
- View all reviews with filtering
- Mark reviews as active/inactive
- Basic statistics (total reviews, active reviews)

## Authentication Flow

1. **Guest Mode**: 

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Play immediately without registration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Local score display only
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Prompt to register to save scores

2. **Registered Users**:

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - JWT token stored in localStorage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Scores automatically saved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Access to profile and history
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Appear on leaderboards

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Game Routes

- `GET /api/game/daily` - Get today's daily challenge
- `GET /api/game/random` - Get random review for free play
- `POST /api/game/verify` - Verify answer (returns correct/incorrect)

### Score Routes

- `POST /api/scores/submit` - Submit score (auth required)
- `GET /api/scores/leaderboard/daily` - Daily leaderboard
- `GET /api/scores/leaderboard/alltime` - All-time leaderboard
- `GET /api/scores/user/:userId` - User's score history

### Admin Routes (Protected)

- `POST /api/admin/reviews` - Add new review
- `PUT /api/admin/reviews/:id` - Update review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/reviews` - Get all reviews (with pagination)

## UI/UX Design

### Modern & Clean Interface

- Dark mode toggle
- Gradient backgrounds
- Smooth animations (Framer Motion)
- Responsive design (mobile-first)
- Toast notifications for feedback
- Loading skeletons

### Game Screen Layout

```
┌─────────────────────────────────┐
│  Header (Logo, Score, User)     │
├─────────────────────────────────┤
│                                  │
│  ┌──────────────────────────┐  │
│  │   Steam Review Card       │  │
│  │   "This game is..."       │  │
│  │   (Review text here)      │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │  Type game name...        │  │
│  │  [Autocomplete Input]     │  │
│  └──────────────────────────┘  │
│                                  │
│  [Skip -30pts] [Genre -20pts]  │
│                                  │
│  Current Streak: 🔥 3           │
│  Score: 280                      │
└─────────────────────────────────┘
```

## Technical Implementation Details

### Answer Verification

- Case-insensitive matching
- Fuzzy matching for typos (using string similarity algorithm)
- Handle common variations (e.g., "The Witcher 3" vs "Witcher 3")

### Autocomplete Feature

- Pre-load popular game names from database
- Real-time filtering as user types
- Show game icons/thumbnails if available

### Vercel Deployment Strategy

- Frontend: Static React build
- Backend: Serverless functions (Express adapter)
- MongoDB: MongoDB Atlas (free tier)
- Environment variables for secrets

## Security Considerations

- JWT secret in environment variables
- Password hashing with bcrypt (10 rounds)
- Rate limiting on API endpoints
- CORS configuration for production
- Input validation and sanitization
- Admin role verification for protected routes

## Future Enhancements (Post-MVP)

- Google Ads integration
- Social sharing (share daily challenge results)
- Multiplayer mode
- Custom game collections
- Steam API integration for automatic review fetching
- Game screenshots as additional hints

### To-dos

- [ ] Initialize MERN project structure with Vite for React frontend and Express backend
- [ ] Create MongoDB schemas for User, Review, DailyChallenge, and Score collections
- [ ] Implement JWT authentication system with register/login and guest mode support
- [ ] Build admin panel for CRUD operations on reviews with admin middleware protection
- [ ] Implement core game mechanics (answer verification, scoring system, joker buttons)
- [ ] Create daily challenge system with automatic daily review set generation
- [ ] Build free play mode with random review selection
- [ ] Implement leaderboard system for daily and all-time scores
- [ ] Create all React components with TailwindCSS styling and responsive design
- [ ] Configure Vercel deployment with serverless functions and environment variables