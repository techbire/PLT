# Quick Setup Guide to Fix Connection Issues

## Problem
- Frontend is running on port 3000 ✅
- Backend is NOT running on port 5000 ❌
- MongoDB connection issues

## Solutions (Try in order)

### Option 1: Use MongoDB Atlas (Cloud Database) - RECOMMENDED

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/personal-library-tracker?retryWrites=true&w=majority
   ```

### Option 2: Install MongoDB Locally

#### For Windows (Detailed Steps):

**Step 1: Download MongoDB**
1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0.x (Current)
   - Platform: Windows
   - Package: msi
3. Click "Download"

**Step 2: Install MongoDB**
1. Run the downloaded `.msi` file as Administrator
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service" 
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Click "Install" and wait for completion

**Step 3: Verify Installation**
1. Open Command Prompt as Administrator
2. Run: `mongod --version`
3. You should see MongoDB version information

**Step 4: Start MongoDB Service**
```cmd
net start MongoDB
```

**Step 5: Test MongoDB Connection**
1. Open Command Prompt
2. Run: `mongo` or `mongosh` (depending on version)
3. You should see MongoDB shell

**Step 6: Alternative - Start MongoDB Manually (if service doesn't work)**
```cmd
# Create data directory
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

**Troubleshooting:**
- If "mongo" command not found, add to PATH: `C:\Program Files\MongoDB\Server\7.0\bin`
- If service won't start, try running: `mongod --install`

### Option 3: Use Docker (if you have Docker Desktop)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Start the Servers

### Terminal 1 (Backend):
```bash
cd backend
npm start
```
You should see: "Server running on port 5000" and "Connected to MongoDB"

### Terminal 2 (Frontend):
```bash
cd frontend  
npm start
```
Frontend should open at http://localhost:3000

## Quick Test

If backend is running correctly, you should be able to visit:
- http://localhost:5000/api/health - Should return {"status":"OK"}

## Current Status

✅ Frontend: Running on port 3000
❌ Backend: NOT running (Connection Refused errors)
❌ Database: MongoDB not connected

## Next Steps

1. Choose one of the database options above
2. Start the backend server
3. Test the application

The app will work once the backend server is running!
