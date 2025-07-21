# Deployment Guide for Personal Library Tracker

This guide will walk you through deploying your Personal Library Tracker application to:
- **Database**: MongoDB Atlas
- **Backend API**: Render
- **Frontend App**: Vercel

## 1. MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account or log in
3. Create a new project called "Personal Library Tracker"

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (free tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "personal-library-cluster")
5. Click "Create"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set database user privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for deployment
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as your driver and choose version "4.1 or later"
5. Copy the connection string that appears
6. Replace `<password>` with your database user password (the one you created in Step 3)
7. Replace `<dbname>` with "personal-library-tracker"

Your connection string will look like:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/personal-library-tracker?retryWrites=true&w=majority
```

**Example:**
If your username is "libraryuser", password is "mySecurePass123", and cluster name is "cluster0", your final connection string would be:
```
mongodb+srv://libraryuser:mySecurePass123@cluster0.ab1cd.mongodb.net/personal-library-tracker?retryWrites=true&w=majority
```

**Important Notes:**
- Save this connection string securely - you'll need it for your Render deployment
- Never commit this connection string to your code repository
- The cluster name and random string (like "ab1cd") will be unique to your cluster

## 2. Backend Deployment on Render

### Step 1: Prepare Backend for Production
The backend is already configured for production deployment.

### Step 2: Deploy to Render
1. Go to [Render](https://render.com) and create an account
2. Connect your GitHub repository
3. Click "New Web Service"
4. Select your repository
5. Configure the service:
   - **Name**: personal-library-tracker-api
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Configure Environment Variables
In Render dashboard, add these environment variables:
- `NODE_ENV=production`
- `MONGODB_URI=` (your MongoDB Atlas connection string)
- `JWT_SECRET=` (generate a secure random string)
- `JWT_EXPIRE=7d`
- `JWT_REFRESH_SECRET=` (generate another secure random string)
- `JWT_REFRESH_EXPIRE=30d`
- `GOOGLE_BOOKS_API_KEY=` (your Google Books API key)
- `FRONTEND_URL=` (your Vercel app URL - add this after frontend deployment)

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

## 3. Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Production
The frontend needs the backend API URL configured.

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and create an account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

### Step 3: Configure Environment Variables
In Vercel dashboard, add:
- `REACT_APP_API_URL=` (your Render backend URL + /api)

### Step 4: Deploy
Click "Deploy" and wait for deployment to complete.

## 4. Post-Deployment Configuration

### Update Backend CORS
After frontend deployment, update the `FRONTEND_URL` environment variable in Render with your Vercel app URL.

### Test the Application
1. Visit your Vercel app URL
2. Test user registration and login
3. Test book management features
4. Verify file uploads work correctly

## 5. Domain Configuration (Optional)

### Custom Domain for Frontend (Vercel)
1. In Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Custom Domain for Backend (Render)
1. In Render dashboard, go to your service settings
2. Click "Custom Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure FRONTEND_URL is correctly set in Render
2. **Database Connection**: Verify MongoDB Atlas connection string and network access
3. **File Uploads**: May need to configure cloud storage for production (Cloudinary, AWS S3)
4. **Environment Variables**: Double-check all required variables are set

### Production Considerations:
1. **File Storage**: Consider using cloud storage instead of local uploads
2. **Error Monitoring**: Set up error tracking (Sentry, LogRocket)
3. **Performance**: Implement caching and optimization
4. **Security**: Review security settings and add rate limiting
5. **Backup**: Set up database backups in MongoDB Atlas
