# Quick Start Guide for Windows

A simplified guide to get the Steam Review Quiz Game running on Windows quickly.

## Prerequisites (One-time Setup)

### 1. Install Node.js
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run the installer (keep default settings)
3. Verify installation:
```powershell
node -v
npm -v
```

### 2. Install MongoDB

**Option A: Local MongoDB (Recommended for development)**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer (choose "Complete" installation)
3. Install as Windows Service (check the box)
4. Install MongoDB Compass (GUI tool - check the box)

**Option B: MongoDB Atlas (Cloud - easier but requires internet)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user (remember username/password)
4. Add your IP to whitelist (or 0.0.0.0/0 for any IP)
5. Get connection string

### 3. Install Git (if not already installed)
1. Download from https://git-scm.com/download/win
2. Run installer (keep default settings)

## Quick Setup (5 minutes)

### Step 1: Download the Project
```powershell
# Navigate to where you want the project
cd C:\Users\YourName\Documents

# Clone the repository
git clone <repository-url>
cd Steam_Oyun_Bulma
```

### Step 2: Install Everything
```powershell
npm run install-all
```
⏳ This will take 2-3 minutes...

### Step 3: Configure Environment Variables

**For Server:**
1. Open `server` folder
2. Create a file named `.env` (copy from `.env.example`)
3. Edit `.env` in Notepad:

```env
PORT=5000
NODE_ENV=development

# If using LOCAL MongoDB:
MONGODB_URI=mongodb://localhost:27017/steam-review-quiz

# If using MongoDB ATLAS:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/steam-review-quiz

JWT_SECRET=my_super_secret_key_12345
CLIENT_URL=http://localhost:5173
```

**For Client:**
1. Open `client` folder
2. Create a file named `.env`
3. Add this line:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Add Sample Data
```powershell
cd server
npm run seed
cd ..
```

This adds 15 sample game reviews to your database.

### Step 5: Run the App
```powershell
npm run dev
```

✅ **Done!** The app will open automatically in your browser:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Creating an Admin Account

### Using MongoDB Compass (Easiest)

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Open database: `steam-review-quiz`
4. Open collection: `users`
5. First, register a normal account through the website
6. Find your user document in Compass
7. Click "Edit Document"
8. Add field: `"isAdmin": true`
9. Click "Update"
10. Refresh the website - you'll see "Admin" button

### Using Command Line

```powershell
# Open MongoDB shell
mongosh

# Or if mongosh doesn't work:
mongo
```

Then run:
```javascript
use steam-review-quiz

// Replace with your email
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## Common Issues on Windows

### Issue: "mongosh is not recognized"
**Solution:** MongoDB service might not be running
```powershell
# Start MongoDB service
net start MongoDB

# If that doesn't work, check Services:
# 1. Press Win + R
# 2. Type: services.msc
# 3. Find "MongoDB Server"
# 4. Right-click > Start
```

### Issue: "Port 5000 is already in use"
**Solution:** Windows might be using port 5000 for other services
1. Open `server/.env`
2. Change to: `PORT=5001`
3. Open `client/.env`
4. Change to: `VITE_API_URL=http://localhost:5001/api`

### Issue: Can't create .env file in Explorer
**Solution:** Windows Explorer doesn't like files starting with dot
1. Open PowerShell in the folder
2. Run: `notepad .env`
3. When asked to create new file, click "Yes"
4. Add your content and save

### Issue: "npm: command not found"
**Solution:** Node.js not in PATH
1. Close and reopen PowerShell/CMD
2. If still doesn't work, reinstall Node.js
3. Make sure to check "Add to PATH" during installation

### Issue: Permission errors
**Solution:** Run PowerShell as Administrator
1. Search for "PowerShell" in Start menu
2. Right-click > "Run as Administrator"
3. Navigate to project folder
4. Run commands again

## Development Tips for Windows

### Recommended Code Editor
- **VS Code** (free): https://code.visualstudio.com/
  - Install "ESLint" extension
  - Install "Prettier" extension
  - Install "Tailwind CSS IntelliSense" extension

### Useful PowerShell Commands
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Kill process on a port (if needed)
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Clear npm cache (if installation issues)
npm cache clean --force
```

### File Paths in PowerShell
```powershell
# Navigate to project
cd F:\Projects\Steam_Oyun_Bulma

# Open in VS Code
code .

# Open folder in Explorer
explorer .
```

## Quick Reference

### Starting the App (Daily Use)
```powershell
cd F:\Projects\Steam_Oyun_Bulma
npm run dev
```

### Stopping the App
- Press `Ctrl + C` in PowerShell (twice if needed)

### Adding More Reviews
1. Log in as admin
2. Click "Admin" in top menu
3. Click "+ Add New Review"
4. Fill in the form

### Resetting the Database
```powershell
# Warning: This deletes all data!
mongosh
use steam-review-quiz
db.dropDatabase()
exit

# Then re-seed:
cd server
npm run seed
```

## Windows-Specific Project Locations

After setup, your project files are at:
```
C:\Users\YourName\Documents\Steam_Oyun_Bulma\
├── client\          # Frontend code
├── server\          # Backend code
├── node_modules\    # Dependencies (ignore)
└── README.md        # Main documentation
```

MongoDB data location (if local):
```
C:\Program Files\MongoDB\Server\7.0\data\
```

## Next Steps

1. ✅ App is running
2. 📝 Register an account
3. 🎮 Play a game to test
4. 👑 Make yourself admin
5. ➕ Add more reviews in admin panel
6. 🎨 Customize if you want (see CONTRIBUTING.md)

## Getting Help

If something doesn't work:
1. Check this guide again
2. Check [SETUP.md](SETUP.md) for detailed info
3. Check [README.md](README.md) for general info
4. Open an issue on GitHub with:
   - Windows version
   - Error message (screenshot)
   - What you were trying to do

---

Enjoy! 🎮✨


