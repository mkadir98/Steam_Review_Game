# Steam Review Quiz Game - Setup Guide

This guide will help you set up and run the Steam Review Quiz Game locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas account (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **npm** (comes with Node.js) or **yarn**

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Steam_Oyun_Bulma
```

### 2. Install Dependencies

You can install all dependencies at once:

```bash
npm run install-all
```

Or install them separately:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB

1. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

2. Verify MongoDB is running:
```bash
mongosh
# or
mongo
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 4. Configure Environment Variables

#### Server Configuration

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/steam-review-quiz

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/steam-review-quiz?retryWrites=true&w=majority

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

#### Client Configuration

Create `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed the Database (Optional but Recommended)

Populate your database with sample reviews:

```bash
cd server
npm run seed
```

This will add 15 sample Steam reviews to your database.

### 6. Run the Application

#### Option A: Run Both Server and Client Together

From the root directory:

```bash
npm run dev
```

This will start both the backend and frontend concurrently.

#### Option B: Run Separately

In one terminal (Backend):
```bash
cd server
npm run dev
```

In another terminal (Frontend):
```bash
cd client
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Creating an Admin User

To access the admin panel, you need to manually set a user as admin:

1. Register a new account through the web interface
2. Connect to your MongoDB database:
```bash
mongosh
# or
mongo
```

3. Run the following commands:
```javascript
use steam-review-quiz

// Find your user
db.users.find({ email: "your-email@example.com" })

// Set as admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

4. Log out and log back in to see the Admin Panel link

## Using MongoDB Compass (GUI)

If you prefer a graphical interface:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your database:
   - Local: `mongodb://localhost:27017`
   - Atlas: Use your connection string
3. Navigate to the `steam-review-quiz` database
4. Select the `users` collection
5. Find your user and edit the document to set `isAdmin: true`

## Common Issues and Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Verify MongoDB is running: `mongosh` or `mongo`
- Check your `MONGODB_URI` in `server/.env`
- For Atlas, verify your IP is whitelisted

### Issue: "Port 5000 already in use"

**Solution:**
- Change the port in `server/.env`:
```env
PORT=5001
```
- Update `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

### Issue: Frontend can't connect to backend

**Solution:**
- Verify backend is running on port 5000
- Check `client/.env` has correct API URL
- Check browser console for CORS errors
- Verify `CLIENT_URL` in `server/.env` matches your frontend URL

### Issue: "Invalid token" or authentication errors

**Solution:**
- Clear localStorage in browser dev tools
- Log out and log back in
- Verify `JWT_SECRET` is set in `server/.env`

## Development Tips

### Hot Reloading

Both frontend and backend support hot reloading:
- Frontend: Vite automatically reloads on file changes
- Backend: Nodemon automatically restarts on file changes

### Testing the API

You can use tools like:
- **Postman** - [Download](https://www.postman.com/downloads/)
- **Insomnia** - [Download](https://insomnia.rest/download)
- **Thunder Client** (VS Code extension)

Example API calls:

```bash
# Health check
GET http://localhost:5000/api/health

# Register user
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Get daily challenge
GET http://localhost:5000/api/game/daily
```

### Viewing Logs

- **Backend logs**: Check the terminal where server is running
- **Frontend logs**: Check browser console (F12)
- **MongoDB logs**: Check MongoDB service logs

### Database Management

View your data:
```bash
mongosh
use steam-review-quiz
db.users.find()
db.reviews.find()
db.scores.find()
db.dailychallenges.find()
```

## Next Steps

1. **Add more reviews**: Use the admin panel to add more Steam reviews
2. **Customize styling**: Modify TailwindCSS classes in components
3. **Test the game**: Play both daily challenge and free play modes
4. **Check leaderboards**: Create multiple accounts to test leaderboard functionality

## Production Deployment

For production deployment instructions, see the main [README.md](README.md) file.

## Need Help?

If you encounter any issues not covered here:
1. Check the [README.md](README.md) for general information
2. Open an issue on GitHub with:
   - Your operating system
   - Node.js version (`node -v`)
   - Error message and stack trace
   - Steps to reproduce the issue

---

Happy coding! 🎮✨


