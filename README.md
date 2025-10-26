# Steam Review Quiz Game

A full-stack MERN application where users guess video games from Steam reviews. Features daily challenges, free play mode, leaderboards, and an admin panel for managing reviews.

## Features

- 🎮 **Daily Challenge**: 5 reviews per day, compete on the leaderboard
- 🎯 **Free Play Mode**: Unlimited practice with random reviews
- 🏆 **Leaderboards**: Daily and all-time rankings
- 💡 **Joker System**: Skip reviews or reveal genre hints
- 🔥 **Streak Bonuses**: Extra points for consecutive correct answers
- 👤 **User Profiles**: Track stats and progress
- 🔒 **Guest Mode**: Play without registration (scores not saved)
- ⚙️ **Admin Panel**: Manage reviews with CRUD operations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- Rate limiting for API protection
- String similarity for fuzzy matching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Steam_Oyun_Bulma
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Server (.env in server folder):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/steam-review-quiz
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Client (.env in client folder):
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Run the application**

In one terminal (server):
```bash
cd server
npm run dev
```

In another terminal (client):
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

### Creating an Admin User

To access the admin panel, you need to manually set a user as admin in the MongoDB database:

1. Register a regular account through the app
2. Open MongoDB (using MongoDB Compass or mongo shell)
3. Find your user in the `users` collection
4. Set `isAdmin: true` for that user

### Adding Reviews (Admin)

1. Log in with an admin account
2. Navigate to the Admin Panel
3. Click "Add New Review"
4. Fill in the form:
   - **Game Name**: The exact name of the game
   - **Review Text**: A Steam review (without revealing the game name)
   - **Genre**: The game's genre (e.g., "Action RPG", "FPS")
   - **Game Image URL**: (Optional) URL to game cover image
   - **Difficulty**: Easy, Medium, or Hard

### Playing the Game

1. **Guest Mode**: Just click "Start Challenge" or "Start Free Play"
2. **Registered Mode**: Sign up/login to save scores and appear on leaderboards

#### Game Mechanics

- **Correct Answer**: +100 points
- **Streak Bonus**: +10 points per streak level
- **Skip Joker**: -30 points (shows new review)
- **Genre Hint**: -20 points (reveals game genre)

## Project Structure

```
Steam_Oyun_Bulma/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Game
- `GET /api/game/daily` - Get daily challenge
- `GET /api/game/random` - Get random review (free play)
- `POST /api/game/verify` - Verify answer
- `GET /api/game/hint/:reviewId` - Get genre hint
- `GET /api/game/names` - Get all game names (autocomplete)

### Scores
- `POST /api/scores/submit` - Submit score (auth required)
- `GET /api/scores/leaderboard/daily` - Daily leaderboard
- `GET /api/scores/leaderboard/alltime` - All-time leaderboard
- `GET /api/scores/user/:userId` - User score history
- `GET /api/scores/rank/:userId` - User's current rank

### Admin (Auth + Admin Required)
- `GET /api/admin/reviews` - Get all reviews
- `GET /api/admin/reviews/stats` - Get statistics
- `GET /api/admin/reviews/:id` - Get single review
- `POST /api/admin/reviews` - Create review
- `PUT /api/admin/reviews/:id` - Update review
- `DELETE /api/admin/reviews/:id` - Delete review

## Deployment

### Railway Deployment (Recommended) ⭐

Railway fully supports this project including WebSocket/Socket.IO features.

**Quick Deploy:**

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Deploy on Railway**:
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy!

3. **Set Environment Variables** (in Railway Dashboard):
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

4. **Done!** Railway will provide a URL like `https://your-app.railway.app`

📖 **Detailed Guide**: See [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md) for complete instructions.

### Environment Variables for Production

Required environment variables in Railway:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key for JWT (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `NODE_ENV=production`
- `PORT` - 5000 (Railway auto-sets this)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Future Enhancements

- Google Ads integration
- Social sharing features
- Multiplayer mode
- Custom game collections
- Steam API integration for automatic review fetching
- Screenshot hints
- Achievement system
- Mobile app version

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using the MERN stack


