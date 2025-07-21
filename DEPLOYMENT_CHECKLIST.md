# 🚀 Deployment Checklist

## Pre-Deployment Setup ✅

- [x] MongoDB Atlas configuration guide created
- [x] Backend production optimizations added
- [x] Frontend Vercel configuration created
- [x] Environment variables documented
- [x] Docker configurations added
- [x] CI/CD pipeline configured
- [x] Security enhancements implemented
- [x] Deployment scripts created

## Required Actions Before Deployment

### 1. Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster
- [ ] Configure database user and network access
- [ ] Get connection string

### 2. Generate Secrets
- [ ] Run `scripts/generate-secrets.bat` (Windows) or `scripts/generate-secrets.sh` (Linux/Mac)
- [ ] Save the generated JWT secrets

### 3. Backend Deployment (Render)
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure environment variables:
  - `NODE_ENV=production`
  - `MONGODB_URI=<your-atlas-connection-string>`
  - `JWT_SECRET=<generated-secret>`
  - `JWT_REFRESH_SECRET=<generated-refresh-secret>`
  - `GOOGLE_BOOKS_API_KEY=<your-api-key>`
  - `FRONTEND_URL=<your-vercel-url>` (add after frontend deployment)

### 4. Frontend Deployment (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Configure environment variable:
  - `REACT_APP_API_URL=<your-render-backend-url>/api`

### 5. Post-Deployment
- [ ] Update backend `FRONTEND_URL` with Vercel URL
- [ ] Test application functionality
- [ ] Verify file uploads work
- [ ] Test user registration and login

## Quick Commands

```bash
# Prepare for deployment
npm run deploy:prepare

# Generate JWT secrets
./scripts/generate-secrets.sh    # Linux/Mac
scripts/generate-secrets.bat     # Windows

# Build frontend only
npm run build:frontend

# Start backend in production mode
cd backend && npm run prod
```

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/personal-library-tracker
JWT_SECRET=<generated-64-char-string>
JWT_REFRESH_SECRET=<generated-64-char-string>
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
GOOGLE_BOOKS_API_KEY=<your-google-books-api-key>
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

### Common Issues:
1. **Build failures**: Check Node.js version (requires 16+)
2. **CORS errors**: Verify FRONTEND_URL is correctly set
3. **Database connection**: Verify MongoDB Atlas connection string and whitelist IPs
4. **File uploads**: Consider cloud storage for production (Cloudinary, AWS S3)

### Health Check Endpoints:
- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-app.vercel.app`

### Logs:
- Render: Check deployment logs in Render dashboard
- Vercel: Check function logs in Vercel dashboard

## Production Considerations

### Security:
- [x] Rate limiting implemented
- [x] CORS properly configured
- [x] Helmet security headers added
- [x] Input validation in place

### Performance:
- [x] Gzip compression enabled
- [x] Static file caching configured
- [x] Database connection pooling
- [x] Frontend build optimization

### Monitoring:
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring
- [ ] Set up database backup schedule in Atlas

### Scaling:
- [ ] Consider implementing Redis for session storage
- [ ] Plan for CDN integration for file uploads
- [ ] Monitor database performance and upgrade if needed
