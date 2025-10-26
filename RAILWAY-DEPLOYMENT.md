# Railway Deployment Guide

This guide will help you deploy the Steam Review Quiz Game to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. MongoDB Atlas account (free tier at https://www.mongodb.com/cloud/atlas)
3. Your project code on GitHub (optional but recommended)

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier is fine)
3. Create a database user:
   - Database Access → Add New Database User
   - Choose Password authentication
   - Remember username and password
4. Allow network access:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/steam-game?retryWrites=true&w=majority`

## Step 2: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Go to Railway Dashboard**:
   - Visit [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Railway will automatically**:
   - Detect the Node.js project
   - Run the build command
   - Start the server

### Option B: Deploy with Railway CLI

1. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize and deploy**:
```bash
# In your project root directory
railway init
railway up
```

## Step 3: Configure Environment Variables

In Railway Dashboard:

1. Click on your deployed project
2. Go to "Variables" tab
3. Add the following environment variables:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_random_string_here
PORT=5000
```

**Important Notes**:
- `MONGODB_URI`: Use the connection string from MongoDB Atlas
- `JWT_SECRET`: Generate a strong random string (at least 32 characters)
  - You can generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `PORT`: Railway automatically sets this, but 5000 is a good default
- `CLIENT_URL`: Not needed in production as we serve from the same origin

## Step 4: Verify Deployment

1. **Check deployment logs**:
   - In Railway Dashboard, go to "Deployments" tab
   - Check if build and start were successful
   - Look for "MongoDB Connected" message

2. **Test the application**:
   - Railway will provide a URL (something like `https://your-app.railway.app`)
   - Click on it or go to "Settings" → "Domains"
   - Test the following:
     - ✅ Homepage loads
     - ✅ User registration works
     - ✅ Login works
     - ✅ Daily Challenge loads
     - ✅ Free Play mode works
     - ✅ Leaderboard displays

3. **Check health endpoint**:
   - Visit: `https://your-app.railway.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

## Step 5: Seed Database (Optional)

If you want to add sample data:

1. **Connect to Railway CLI**:
```bash
railway link
```

2. **Run seed script**:
```bash
railway run node server/seedDatabase.js
```

Or use Railway's built-in terminal:
- Dashboard → Your service → "Terminal" tab
- Run: `cd server && node seedDatabase.js`

## Step 6: Create Admin User

To access the admin panel:

1. Register a user through the web interface
2. Access MongoDB Atlas:
   - Go to your cluster → "Browse Collections"
   - Find the `users` collection
   - Find your user document
   - Edit and set `isAdmin: true`
3. Log out and log back in
4. You should now see "Admin Panel" in the menu

## Custom Domain (Optional)

To use your own domain:

1. In Railway Dashboard:
   - Settings → Domains → "Add Domain"
   - Enter your domain (e.g., `steamgame.yourdomain.com`)
2. Add CNAME record in your DNS provider:
   - Type: CNAME
   - Name: steamgame (or your subdomain)
   - Value: (provided by Railway)
3. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Build Fails

**Check build logs for errors:**
- Railway Dashboard → Deployments → Click on latest deployment
- Common issues:
  - Missing dependencies: Run `npm install` locally to verify
  - TypeScript errors: Fix in your code
  - Out of memory: Railway free tier has limits

### Application Won't Start

**Check environment variables:**
- Ensure all required vars are set
- Check MongoDB connection string format
- Verify JWT_SECRET is set

**Check logs:**
```bash
railway logs
```

### MongoDB Connection Issues

- Verify connection string is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Ensure database user has read/write permissions

### WebSocket/Socket.IO Issues

- Railway fully supports WebSocket connections
- No additional configuration needed
- If issues persist, check CORS settings in `server/server.js`

## Monitoring and Logs

### View Logs
```bash
railway logs
```

Or in Dashboard → Deployments → Logs

### Metrics
- Railway Dashboard shows:
  - CPU usage
  - Memory usage
  - Network traffic
  - Request count

## Updating Your App

### With GitHub (Recommended)
```bash
git add .
git commit -m "Update description"
git push
```
Railway will automatically redeploy!

### With Railway CLI
```bash
railway up
```

## Pricing

- **Free Tier**: 
  - $5 worth of usage per month
  - Great for hobby projects
  - Includes all features

- **Paid Plans**:
  - Pay for what you use
  - No sleep/downtime
  - More resources

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MongoDB Atlas Support: https://www.mongodb.com/cloud/atlas/support

## Quick Commands Reference

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to existing project
railway link

# Deploy
railway up

# View logs
railway logs

# Run commands in Railway environment
railway run <command>

# Open dashboard
railway open
```

## Security Checklist

✅ MongoDB Atlas: Network access configured
✅ Strong JWT_SECRET generated
✅ Environment variables set in Railway (not in code)
✅ `.env` files in `.gitignore`
✅ Rate limiting enabled (already configured)
✅ CORS properly configured

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Configure environment variables
3. ✅ Test all features
4. ✅ Create admin user
5. ✅ Add game reviews via admin panel
6. 🎮 Share your game with the world!

---

**Congratulations!** Your Steam Review Quiz Game is now live on Railway! 🎉

For issues or questions, check the troubleshooting section or visit Railway's documentation.

