# Railway Quick Start Guide 🚀

Deploy your Steam Review Quiz Game to Railway in under 10 minutes!

## Prerequisites

✅ [Railway Account](https://railway.app) (free signup)
✅ [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (free tier)
✅ Your project code

## 1️⃣ Setup MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Create a New Cluster"** (Free tier is perfect!)
3. Create Database User:
   - Left menu: **Database Access** → **Add New Database User**
   - Authentication Method: **Password**
   - Username: `gameuser` (or your choice)
   - Password: Generate a secure password (save it!)
   - User Privileges: **Read and write to any database**
   - Click **Add User**

4. Allow Network Access:
   - Left menu: **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **Confirm**

5. Get Connection String:
   - Left menu: **Database** → **Connect** → **Connect your application**
   - Driver: **Node.js**
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `steam-game` or your choice

Example:
```
mongodb+srv://gameuser:YourPassword123@cluster0.abc123.mongodb.net/steam-game?retryWrites=true&w=majority
```

## 2️⃣ Deploy to Railway (3 minutes)

### Method A: GitHub (Recommended - Auto-deploys on push)

1. **Push to GitHub**:
```bash
# If not already initialized
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

2. **Deploy on Railway**:
   - Visit [railway.app](https://railway.app)
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Authorize GitHub if needed
   - Select your repository
   - Railway will start building automatically! ⚡

### Method B: Railway CLI (Direct deploy from local)

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login**:
```bash
railway login
```

3. **Initialize and Deploy**:
```bash
# In your project root
railway init
railway up
```

## 3️⃣ Configure Environment Variables (2 minutes)

In Railway Dashboard:

1. Click on your project
2. Click on your service (should be auto-created)
3. Go to **"Variables"** tab
4. Click **"New Variable"** and add each of these:

### Required Variables:

```env
NODE_ENV=production
```

```env
MONGODB_URI=mongodb+srv://gameuser:YourPassword@cluster0.abc123.mongodb.net/steam-game?retryWrites=true&w=majority
```
(Use YOUR connection string from Step 1!)

```env
JWT_SECRET=
```
**Generate JWT_SECRET**: Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste as JWT_SECRET value.

```env
PORT=5000
```

5. Click **"Save"** or it saves automatically

## 4️⃣ Verify Deployment (1 minute)

1. **Get Your URL**:
   - In Railway Dashboard → Settings → Domains
   - Railway auto-generates a URL like: `https://your-app.railway.app`
   - Or click **"Generate Domain"** if not available

2. **Check Deployment**:
   - Go to **"Deployments"** tab
   - Wait for "✅ Deployed" status
   - Click on deployment logs to see:
   ```
   MongoDB Connected: cluster0-xxx.mongodb.net
   Server is running on port 5000
   WebSocket server is ready
   ```

3. **Test Your App**:
   - Click on your domain URL
   - Should see the game homepage! 🎮
   - Test health endpoint: `https://your-app.railway.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

## 5️⃣ Create Admin User (Optional - 1 minute)

To access the admin panel:

1. **Register** a user through your deployed app
2. Open **MongoDB Atlas**:
   - Database → Browse Collections
   - Select `users` collection
   - Find your user document
   - Click **Edit Document**
   - Add/Change: `"isAdmin": true`
   - Click **Update**
3. **Log out and back in** to your app
4. You'll now see **"Admin Panel"** in the menu! 👑

## 6️⃣ Add Game Data (Optional)

### Option A: Use Seed Script

In Railway Dashboard → Terminal tab:
```bash
cd server
node seedDatabase.js
```

### Option B: Via CLI
```bash
railway run node server/seedDatabase.js
```

### Option C: Manual via Admin Panel
Just use the admin panel to add reviews one by one!

## 🎉 Done! Your Game is Live!

Your Steam Review Quiz Game is now:
- ✅ Live on Railway
- ✅ Connected to MongoDB Atlas
- ✅ Socket.IO working (real-time leaderboards!)
- ✅ SSL/HTTPS enabled
- ✅ Auto-deploying on GitHub push (if Method A)

### Share Your Game:
```
🎮 Play now: https://your-app.railway.app
```

## 🔄 Updating Your App

### With GitHub (Method A):
```bash
git add .
git commit -m "Update feature"
git push
```
Railway automatically redeploys! 🚀

### With CLI (Method B):
```bash
railway up
```

## 📊 Monitoring

### View Logs:
```bash
railway logs
```

Or in Railway Dashboard → Deployments → Logs

### Metrics:
Railway Dashboard shows:
- 📈 CPU & Memory usage
- 🌐 Network traffic
- 📊 Request counts

## ❌ Troubleshooting

### Build Failed?
- Check Railway logs: Deployments → Click deployment → View logs
- Verify all files committed to Git
- Try: `npm run build` locally first

### Can't Connect to MongoDB?
- ✅ Check MongoDB connection string (no typos!)
- ✅ Verify password in connection string
- ✅ Ensure Network Access allows 0.0.0.0/0
- ✅ Check database user has read/write permissions

### App Won't Start?
- ✅ All environment variables set correctly?
- ✅ JWT_SECRET is set?
- ✅ MONGODB_URI is correct?
- View logs: `railway logs`

### WebSocket Issues?
Railway fully supports WebSocket - no extra config needed!
If issues persist:
- Check browser console for errors
- Verify Socket.IO connection in network tab

## 💰 Pricing

**Railway Free Tier:**
- $5 credit per month
- Perfect for hobby projects
- No credit card required to start
- No sleep/downtime

**Usage Monitoring:**
Railway Dashboard shows your current usage.

## 🚀 Pro Tips

1. **Custom Domain**: Railway Settings → Add custom domain
2. **Auto-Deploy**: Enable in GitHub settings (if not already)
3. **Environment Sync**: Use Railway CLI to sync env vars locally
4. **Database Backups**: MongoDB Atlas has automatic backups!
5. **Monitoring**: Set up MongoDB Atlas monitoring alerts

## 📚 Useful Commands

```bash
# Railway CLI
railway login              # Login to Railway
railway link               # Link to existing project
railway up                 # Deploy current directory
railway logs               # View logs
railway run <command>      # Run command in Railway environment
railway open               # Open project in browser
railway status             # Check deployment status
railway variables          # View environment variables

# Local Development
npm run dev                # Run both client & server
npm run client             # Run only client (port 5173)
npm run server             # Run only server (port 5000)
npm run build              # Build for production
```

## 🆘 Need Help?

- 📖 Full Guide: [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md)
- 🚂 Railway Docs: https://docs.railway.app
- 💬 Railway Discord: https://discord.gg/railway
- 🍃 MongoDB Support: https://www.mongodb.com/docs/atlas/

---

**Congratulations!** 🎊 Your game is now live on Railway!

Happy gaming! 🎮✨

