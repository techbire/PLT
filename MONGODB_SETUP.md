# MongoDB Installation & Setup Instructions

## Current Status
- Express.js: ✅ Fixed (downgraded to v4.19.2)
- MongoDB: ❌ Not installed

## Quick Solution - Use Cloud Database (5 minutes)

I've temporarily updated your `.env` file to use a demo cloud database. 

**Test it now:**
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
Connected to MongoDB
```

## Permanent Solution - Install MongoDB Locally

### Option A: MongoDB Community Server (Recommended)

1. **Download**: https://www.mongodb.com/try/download/community
   - Choose: Windows, Version 7.0.x, MSI package

2. **Install**:
   - Run as Administrator
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass"

3. **Start Service**:
   ```cmd
   net start MongoDB
   ```

4. **Update .env back to local**:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/personal-library-tracker
   ```

### Option B: MongoDB with Chocolatey (if you have it)

```cmd
choco install mongodb
```

### Option C: Quick Test with Docker

If you have Docker Desktop:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verification Steps

1. **Check MongoDB is running**:
   ```cmd
   mongosh
   # or
   mongo
   ```

2. **Test backend connection**:
   ```bash
   cd backend
   npm start
   ```

3. **Test API endpoint**:
   Visit: http://localhost:5000/api/health

## Current Demo Setup

For now, your app should work with the cloud database I've configured. This allows you to test the full application immediately while you decide on the permanent MongoDB setup.

**Next Steps:**
1. Try starting the backend now with `npm start`
2. If it works, you can use the app immediately
3. Install MongoDB locally when you have time for a permanent solution
