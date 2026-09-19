# Troubleshooting Guide 🔧

Common issues and their solutions for the CarePlus Hospital Management System.

## 🗄️ Database Connection Issues

### Issue: "options useNewUrlParser, useUnifiedTopology are not supported"

**Error Message:**
```
❌ MongoDB connection error: options usenewurlparser, useunifiedtopology are not supported
```

**Cause:** Using deprecated Mongoose connection options with Mongoose 7.0+

**Solution:** ✅ Already Fixed!
- The deprecated options have been removed from `server.js`
- Simply restart your server

---

### Issue: MongoDB Atlas Connection Missing Database Name

**Error Message:**
```
✅ MongoDB connected successfully
📦 Database: test
```

**Problem:** Database shows "test" instead of "hospital_management"

**Cause:** Missing database name in connection string

**Solution:** Add `/hospital_management` before the `?` in your MONGO_URI:

**❌ Wrong:**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
```

**✅ Correct:**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority&appName=Cluster0
```

---

### Issue: "MongoServerSelectionError: connection refused"

**Error Message:**
```
❌ MongoDB connection error: connect ECONNREFUSED
```

**Possible Causes & Solutions:**

#### For Local MongoDB:

**1. MongoDB Service Not Running**
```powershell
# Check MongoDB status
Get-Service MongoDB

# If stopped, start it
net start MongoDB
```

**2. Wrong Port**
```env
# Default MongoDB port is 27017
MONGO_URI=mongodb://localhost:27017/hospital_management
```

#### For MongoDB Atlas:

**1. Internet Connection Issue**
- Check your internet connection
- Try opening mongodb.com in browser

**2. IP Not Whitelisted**
- Go to MongoDB Atlas dashboard
- Navigate to: Network Access
- Add your current IP or use 0.0.0.0/0 for testing

**3. Wrong Connection String**
- Copy connection string again from Atlas
- Ensure no extra spaces
- Check username and password are correct

---

### Issue: "Authentication Failed"

**Error Message:**
```
❌ MongoDB connection error: Authentication failed
```

**Solutions:**

1. **Check Credentials**
   ```env
   # Verify username and password are correct
   MONGO_URI=mongodb+srv://USERNAME:PASSWORD@...
   ```

2. **URL Encode Special Characters**
   If your password has special characters like `@`, `#`, `$`, `/`:
   
   Use this tool: https://www.urlencoder.org/
   
   Example:
   - Password: `Pass@123`
   - Encoded: `Pass%40123`
   - Use: `mongodb+srv://user:Pass%40123@...`

3. **Recreate Database User**
   - Go to MongoDB Atlas → Database Access
   - Delete old user
   - Create new user with simple password
   - Update .env file

---

## 🌐 Frontend Issues

### Issue: "Failed to fetch" or Network Error

**Error in Browser Console:**
```
Failed to fetch
TypeError: Failed to fetch
```

**Possible Causes & Solutions:**

#### 1. Backend Not Running
```powershell
# Check if backend is running
# You should see "Server running on port 5000"

# If not, start it:
cd backend
node server.js
```

#### 2. Wrong API URL
Check your frontend `.env` or `src/config/constants.js`:

```javascript
// Should be:
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Create `.env` in root directory if missing:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. CORS Error
Check backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Then restart backend.

---

### Issue: "Module not found"

**Error:**
```
Module not found: Can't resolve '../config/constants'
```

**Solution:**
```powershell
# Reinstall dependencies
npm install

# If persists, clear cache:
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

---

### Issue: Page Not Loading / Blank Screen

**Solutions:**

1. **Check Browser Console (F12)**
   - Look for red error messages
   - Fix errors shown

2. **Clear Browser Cache**
   ```
   Ctrl + Shift + Delete
   ```
   Clear cached images and files

3. **Check if React is Running**
   ```powershell
   # Should show "Compiled successfully!"
   npm start
   ```

4. **Restart Development Server**
   ```powershell
   # Stop with Ctrl+C
   # Then start again
   npm start
   ```

---

## 🔌 Port Already in Use

### Issue: Port 5000 or 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

#### Option 1: Find and Kill Process

**For Backend (Port 5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**For Frontend (Port 3000):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

#### Option 2: Change Port

**Backend:** Edit `backend/.env`:
```env
PORT=5001
```

**Frontend:** It will auto-suggest another port (3001).
Or set manually in `package.json`:
```json
"scripts": {
  "start": "set PORT=3001 && react-scripts start"
}
```

---

## 📦 Installation Issues

### Issue: npm install Fails

**Error:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**

1. **Check Node.js Version**
   ```powershell
   node --version
   # Should be 18.0.0 or higher
   ```

2. **Clear npm Cache**
   ```powershell
   npm cache clean --force
   npm install
   ```

3. **Delete node_modules**
   ```powershell
   Remove-Item -Recurse node_modules
   Remove-Item package-lock.json
   npm install
   ```

4. **Run as Administrator**
   - Right-click PowerShell
   - "Run as Administrator"
   - Try npm install again

---

## 🎨 Styling Issues

### Issue: Styles Not Applying

**Solutions:**

1. **Check CSS Import**
   ```javascript
   // In component file
   import './App.css';
   ```

2. **Clear Browser Cache**
   - Ctrl + Shift + R (hard reload)

3. **Check CSS File Path**
   - Verify file exists in correct location
   - Check import path is correct

---

## 🔐 Environment Variables Not Working

### Issue: process.env.VARIABLE_NAME is undefined

**Solutions:**

1. **Frontend Variables Must Start with REACT_APP_**
   ```env
   # ❌ Wrong
   API_URL=http://localhost:5000

   # ✅ Correct
   REACT_APP_API_URL=http://localhost:5000
   ```

2. **Restart Development Server**
   ```powershell
   # Environment variables are loaded at startup
   # Stop server (Ctrl+C)
   npm start
   ```

3. **Check .env File Location**
   - Frontend .env: In root directory
   - Backend .env: In backend directory

4. **No Quotes in .env**
   ```env
   # ❌ Wrong
   PORT="5000"

   # ✅ Correct
   PORT=5000
   ```

---

## 🚨 Runtime Errors

### Issue: "Cannot read property of undefined"

**Example:**
```
TypeError: Cannot read property 'map' of undefined
```

**Solutions:**

1. **Add Optional Chaining**
   ```javascript
   // ❌ Before
   appointments.map(...)

   // ✅ After
   appointments?.map(...)
   ```

2. **Add Default Values**
   ```javascript
   const [appointments, setAppointments] = useState([]);
   // Default to empty array, not null/undefined
   ```

3. **Check API Response**
   - Verify backend is returning correct data structure
   - Check browser Network tab

---

### Issue: "Objects are not valid as a React child"

**Solution:**
Don't render objects directly:

```javascript
// ❌ Wrong
<p>{appointment}</p>

// ✅ Correct
<p>{appointment.fullName}</p>
<p>{JSON.stringify(appointment)}</p>
```

---

## 🔄 Git Issues

### Issue: Git Not Tracking .env Changes

**This is Normal!** .env should be ignored by git for security.

**.gitignore includes:**
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**To share configuration:**
- Update `.env.example` instead
- Never commit `.env` with real credentials

---

## 📱 Mobile/Responsive Issues

### Issue: Layout Broken on Mobile

**Solutions:**

1. **Check Viewport Meta Tag** (in `public/index.html`):
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

2. **Test in Browser DevTools**
   - Press F12
   - Click device toolbar icon
   - Select different devices

3. **Check CSS Media Queries**
   - Ensure they're in `App.css`
   - Test different breakpoints

---

## 🧪 Testing Issues

### Issue: Tests Failing

**Solutions:**

1. **Update Test File**
   ```javascript
   // Wrap with ErrorBoundary if needed
   import ErrorBoundary from './components/ErrorBoundary';
   ```

2. **Mock API Calls**
   ```javascript
   // Mock fetch or axios in tests
   jest.mock('../services/api');
   ```

3. **Skip Tests Temporarily**
   ```javascript
   test.skip('test name', () => {
     // This test will be skipped
   });
   ```

---

## 💻 System-Specific Issues

### Windows-Specific

**Issue: Command not found**
```powershell
# Use PowerShell, not CMD
# Or install Windows Terminal from Microsoft Store
```

**Issue: Permission Denied**
```powershell
# Run PowerShell as Administrator
# Right-click → "Run as Administrator"
```

**Issue: Script Execution Policy**
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🔍 Debugging Tips

### 1. Check All Services Are Running

```powershell
# Terminal 1: Backend
cd backend
node server.js
# Should show: ✅ MongoDB connected, 🚀 Server running

# Terminal 2: Frontend  
npm start
# Should show: Compiled successfully!
```

### 2. Check Browser Console (F12)

- Look for red error messages
- Check Network tab for failed requests
- Look at Console tab for JavaScript errors

### 3. Check Server Logs

- Backend terminal shows all API requests
- Look for errors in red
- Check request URLs and response codes

### 4. Test API Directly

Use browser or PowerShell:
```powershell
# Test health check
curl http://localhost:5000/

# Test API status
curl http://localhost:5000/api/status

# Test appointments endpoint
curl http://localhost:5000/api/appointments
```

---

## 📞 Still Stuck?

### Quick Checklist:

- [ ] MongoDB is running/connected
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] .env files are configured correctly
- [ ] node_modules installed (both root and backend)
- [ ] No errors in terminal
- [ ] No errors in browser console
- [ ] Internet connection working (if using Atlas)

### Get Help:

1. **Read Documentation:**
   - `README.md` - Complete guide
   - `DATABASE_SETUP.md` - Database help
   - `QUICK_START.md` - Quick setup

2. **Check Files:**
   - `VERIFICATION_CHECKLIST.md` - Test everything
   - `IMPROVEMENTS_SUMMARY.md` - See what's new

3. **Common Commands:**
   ```powershell
   # Restart everything fresh
   # Terminal 1
   cd backend
   npm install
   node server.js

   # Terminal 2
   npm install
   npm start
   ```

---

## 🎯 Prevention Tips

1. **Always use two terminals** - one for backend, one for frontend
2. **Don't commit .env files** - they're in .gitignore for a reason
3. **Keep terminals open** - servers auto-reload on changes
4. **Check logs first** - errors usually show what's wrong
5. **Read error messages** - they often tell you exactly what to fix

---

**Last Updated:** September 19, 2026

**Remember:** Most issues are solved by:
1. Restarting the servers
2. Checking .env configuration
3. Reinstalling node_modules
4. Reading error messages carefully
