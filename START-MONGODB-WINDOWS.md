# How to Start MongoDB on Windows

You're getting the error `connect ECONNREFUSED` because MongoDB is not running. Here's how to fix it:

## Option 1: Start MongoDB Service (If Already Installed)

### Method A: Using Services Manager (Easiest)

1. Press `Win + R` to open Run dialog
2. Type: `services.msc` and press Enter
3. Scroll down and find **"MongoDB Server"** or **"MongoDB"**
4. Right-click on it → **Start**
5. (Optional) Right-click → **Properties** → Set **Startup type** to **Automatic** so it starts with Windows

### Method B: Using Command Line (Administrator)

1. Open PowerShell **as Administrator**:
   - Search for "PowerShell" in Start Menu
   - Right-click → "Run as Administrator"

2. Run this command:
```powershell
net start MongoDB
```

3. You should see:
```
The MongoDB Server service is starting.
The MongoDB Server service was started successfully.
```

### Verify MongoDB is Running

Open a regular PowerShell and try:
```powershell
mongosh
# or if that doesn't work:
mongo
```

If you see the MongoDB shell prompt, it's working! ✅

## Option 2: Install MongoDB (If Not Installed)

### Download and Install

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (e.g., 7.0.x)
     - Platform: Windows
     - Package: MSI
   - Click **Download**

2. **Run the Installer**:
   - Double-click the `.msi` file
   - Choose **"Complete"** installation
   - ✅ **Check**: "Install MongoDB as a Service" (IMPORTANT!)
   - ✅ **Check**: "Run service as Network Service user"
   - ✅ **Check**: "Install MongoDB Compass" (GUI tool - recommended)
   - Click **Install**

3. **Wait for Installation** (may take 5-10 minutes)

4. **Verify Installation**:
   - MongoDB should start automatically as a Windows Service
   - Open PowerShell and type:
   ```powershell
   mongosh
   ```

## Option 3: Use MongoDB Atlas (Cloud - No Installation)

If you can't get local MongoDB working, use the free cloud version:

### Set Up MongoDB Atlas

1. **Create Account**:
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click **"Try Free"**
   - Sign up with email or Google

2. **Create a Free Cluster**:
   - Choose **M0 FREE** tier
   - Select a cloud provider (AWS recommended)
   - Choose a region close to you
   - Click **"Create Deployment"**
   - Wait 1-3 minutes for cluster to be created

3. **Create Database User**:
   - You'll see a "Security Quickstart" modal
   - Create a username and password (SAVE THESE!)
   - Click **"Create User"**

4. **Add Your IP Address**:
   - In the same modal, under "Where would you like to connect from?"
   - Click **"Add My Current IP Address"**
   - Or click **"Add a Different IP Address"** and enter: `0.0.0.0/0` (for development)
   - Click **"Finish and Close"**

5. **Get Connection String**:
   - Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Update Your .env File**:
   - Open `server/.env`
   - Replace `MONGODB_URI` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/steam-review-quiz?retryWrites=true&w=majority
   ```
   - ⚠️ Replace `<username>` with your username
   - ⚠️ Replace `<password>` with your password
   - ⚠️ Add `/steam-review-quiz` before the `?` to specify database name

## After MongoDB is Running

Once MongoDB is running (local or Atlas), try these commands:

### 1. Seed the Database
```powershell
cd server
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Inserted 15 sample reviews

📝 Inserted reviews:
1. Factorio (Strategy Simulation)
2. Stardew Valley (Farming Simulation)
...
```

### 2. Start the Application
```powershell
cd ..
npm run dev
```

Both frontend and backend should start successfully! 🎉

## Troubleshooting

### Error: "MongoDB service not found"

**Solution**: MongoDB is not installed. Follow Option 2 or use Option 3 (Atlas).

### Error: "Access Denied" when starting service

**Solution**: Run PowerShell as Administrator:
1. Search "PowerShell" in Start Menu
2. Right-click → "Run as Administrator"
3. Try `net start MongoDB` again

### MongoDB Compass Can't Connect

**Solution**: 
- Connection String: `mongodb://localhost:27017`
- Make sure MongoDB service is running

### Still Can't Connect?

Check if MongoDB is running:
```powershell
# Check service status
Get-Service MongoDB

# Should show:
# Status   Name               DisplayName
# ------   ----               -----------
# Running  MongoDB            MongoDB Server
```

If Status is "Stopped":
```powershell
Start-Service MongoDB
```

### Port 27017 Already in Use?

Another program might be using port 27017:
```powershell
# Find what's using the port
netstat -ano | findstr :27017

# Kill the process (replace <PID> with the number you see)
taskkill /PID <PID> /F

# Then start MongoDB again
net start MongoDB
```

## Quick Reference

### Check if MongoDB is Running
```powershell
Get-Service MongoDB
```

### Start MongoDB
```powershell
net start MongoDB
```

### Stop MongoDB
```powershell
net stop MongoDB
```

### Connect to MongoDB Shell
```powershell
mongosh
# or
mongo
```

### MongoDB Data Location (Local)
```
C:\Program Files\MongoDB\Server\7.0\data\
```

### MongoDB Config File
```
C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg
```

## Recommendation

For **development**: Use local MongoDB (easier, faster, no internet needed)
For **production**: Use MongoDB Atlas (managed, scalable, backups included)

---

Once MongoDB is running, go back to the main project directory and run:
```powershell
cd server
npm run seed
cd ..
npm run dev
```

Your app should now work! 🚀

