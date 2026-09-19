# Database Setup Guide 🗄️

This guide explains how to set up MongoDB for your Hospital Management System.

## 📊 Database Options

You have three options for MongoDB setup:

### Option 1: Local MongoDB (Development) ⚡ RECOMMENDED FOR LEARNING
### Option 2: MongoDB Atlas (Cloud) ☁️ RECOMMENDED FOR PRODUCTION
### Option 3: Render MongoDB (Cloud) 🚀 ALTERNATIVE CLOUD OPTION

---

## Option 1: Local MongoDB Setup (Windows) 💻

### Step 1: Check if MongoDB is Installed

```powershell
mongod --version
```

If you see a version number, MongoDB is installed. Skip to Step 3.

### Step 2: Install MongoDB (If Not Installed)

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: Latest (7.0+)
   - Package: MSI

2. **Run Installer**
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (optional GUI tool)

3. **Verify Installation**
   ```powershell
   mongod --version
   mongo --version
   ```

### Step 3: Start MongoDB Service

```powershell
# Start MongoDB service
net start MongoDB

# Check if running
Get-Service MongoDB

# Status should show "Running"
```

### Step 4: Configure Backend .env

```env
MONGO_URI=mongodb://localhost:27017/hospital_management
```

### Step 5: Test Connection

```powershell
# In backend directory
cd backend
node server.js
```

**Expected Output:**
```
✅ MongoDB connected successfully
📦 Database: hospital_management
🚀 Server running on port 5000
```

### Troubleshooting Local MongoDB

**Problem:** `MongoDB service not found`
```powershell
# Reinstall MongoDB as a service
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg" --install
```

**Problem:** `Failed to connect to localhost:27017`
```powershell
# Check if MongoDB is running
netstat -an | findstr 27017

# If nothing shows, start the service
net start MongoDB
```

**Problem:** `Access Denied`
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell -> "Run as Administrator"
net start MongoDB
```

---

## Option 2: MongoDB Atlas (Cloud) ☁️

MongoDB Atlas is a free cloud database service. Best for production or if you don't want to install MongoDB locally.

### Step 1: Create MongoDB Atlas Account

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose "Free" tier (M0)

### Step 2: Create a Cluster

1. Click "Build a Cluster"
2. Select "Free" (M0) tier
3. Choose region closest to you
4. Cluster Name: `CarePlusHospital` (or any name)
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User

1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: "Password"
4. Username: `careplus_admin` (or any name)
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP
5. Click "Confirm"

### Step 5: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: "Node.js"
5. Version: "4.1 or later"
6. Copy the connection string

   It looks like:
   ```
   mongodb+srv://careplus_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Configure Backend .env

Replace `<password>` with your actual password and add database name:

```env
MONGO_URI=mongodb+srv://careplus_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hospital_management?retryWrites=true&w=majority
```

**Important:** Replace:
- `YOUR_PASSWORD` with your database user password
- Keep `/hospital_management` to specify database name

### Step 7: Test Connection

```powershell
cd backend
node server.js
```

**Expected Output:**
```
✅ MongoDB connected successfully
📦 Database: hospital_management
🚀 Server running on port 5000
```

### MongoDB Atlas Tips

✅ **Free Tier Limits:**
- 512 MB storage
- Shared RAM
- Perfect for development and small projects

✅ **Advantages:**
- No local installation needed
- Always accessible from anywhere
- Automatic backups
- Built-in security
- Free tier available

✅ **View Your Data:**
- Go to "Database" → "Browse Collections"
- Or use MongoDB Compass with your connection string

---

## Option 3: Render MongoDB 🚀

If you're deploying to Render, you can use their managed MongoDB service.

### Step 1: Create Render Account

1. Visit: https://render.com
2. Sign up with GitHub or email

### Step 2: Create MongoDB Instance

1. Click "New +"
2. Select "MongoDB"
3. Choose plan (Free available)
4. Database Name: `hospital_management`
5. Click "Create Database"

### Step 3: Get Connection String

1. Click on your database
2. Copy "Internal Connection String" or "External Connection String"
3. Format:
   ```
   mongodb://username:password@host:port/database
   ```

### Step 4: Configure Backend .env

```env
MONGO_URI=mongodb://render-username:password@mongodb.render.com:27017/hospital_management
```

---

## 🔍 Verify Database Connection

### Method 1: Check Server Logs

When you start the backend, you should see:
```
✅ MongoDB connected successfully
📦 Database: hospital_management
```

### Method 2: Test with MongoDB Compass (GUI Tool)

1. **Install MongoDB Compass**
   - Download: https://www.mongodb.com/try/download/compass
   - Install and open

2. **Connect**
   - Paste your connection string
   - Click "Connect"

3. **View Database**
   - You should see `hospital_management` database
   - Collections: `appointments`

### Method 3: Test with Node.js

Create `test-db.js` in backend folder:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Database connection successful!');
    console.log('📦 Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });
```

Run:
```powershell
node test-db.js
```

---

## 🆚 Which Option Should I Choose?

### Use Local MongoDB If:
- ✅ Learning and development
- ✅ Want full control
- ✅ No internet required
- ✅ Fastest performance
- ❌ Requires installation
- ❌ Not accessible remotely

### Use MongoDB Atlas If:
- ✅ Don't want to install locally
- ✅ Need remote access
- ✅ Want automatic backups
- ✅ Deploying to production
- ✅ Free tier available
- ❌ Requires internet

### Use Render MongoDB If:
- ✅ Already using Render for hosting
- ✅ Want integrated solution
- ✅ Need cloud database
- ❌ Costs more than Atlas free tier

---

## 📝 Common Issues & Solutions

### Issue 1: "MongoServerError: Authentication failed"

**Cause:** Wrong username or password

**Solution:**
```env
# Check your username and password
# For Atlas: Make sure you replaced <password> in connection string
# For Local: Default has no authentication, so use:
MONGO_URI=mongodb://localhost:27017/hospital_management
```

### Issue 2: "MongooseServerSelectionError: connect ECONNREFUSED"

**Cause:** MongoDB service not running (local) or wrong host

**Solution for Local:**
```powershell
net start MongoDB
```

**Solution for Atlas:**
- Check your internet connection
- Verify IP whitelist in Atlas Network Access

### Issue 3: "MongoParseError: Invalid connection string"

**Cause:** Malformed connection string

**Solution:**
- Remove any extra spaces
- Ensure password has no special characters (or URL-encode them)
- Check format: `mongodb://` or `mongodb+srv://`

### Issue 4: "Database shows empty"

**Cause:** No data inserted yet (normal on first run)

**Solution:**
- Create your first appointment through the frontend
- Database and collections are created automatically

---

## 🎯 Recommended Setup

### For Development:
```env
# Use Local MongoDB
MONGO_URI=mongodb://localhost:27017/hospital_management
```

### For Production:
```env
# Use MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority
```

---

## 📊 Database Structure

Once connected, your database will have:

```
hospital_management (database)
├── appointments (collection)
│   ├── fullName: String
│   ├── email: String
│   ├── phone: String
│   ├── doctor: String
│   ├── specialty: String
│   ├── date: String
│   ├── time: String
│   ├── fee: Number
│   ├── paymentStatus: String
│   ├── appointmentStatus: String
│   ├── createdAt: Date
│   └── updatedAt: Date
```

---

## 🔐 Security Best Practices

1. **Never commit .env file**
   ```bash
   # .gitignore already includes .env
   ```

2. **Use strong passwords**
   - At least 16 characters
   - Mix of letters, numbers, symbols

3. **Limit IP access** (Production)
   - Don't use 0.0.0.0/0 in production
   - Whitelist only your server's IP

4. **Use environment variables**
   - Never hardcode connection strings
   - Always use `.env` file

5. **Regular backups**
   - Atlas does this automatically
   - For local: Use `mongodump`

---

## 📞 Need More Help?

### MongoDB Documentation:
- Local: https://docs.mongodb.com/manual/installation/
- Atlas: https://docs.atlas.mongodb.com/

### Video Tutorials:
- MongoDB Installation: YouTube search "install mongodb windows"
- MongoDB Atlas Setup: YouTube search "mongodb atlas tutorial"

### Common Commands:

```powershell
# Check MongoDB status
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Connect to MongoDB shell (if installed)
mongosh

# Show databases
show dbs

# Use specific database
use hospital_management

# Show collections
show collections
```

---

**Last Updated:** September 19, 2026
