@echo off
echo.
echo 🚀 Personal Library Tracker - Deployment Setup
echo ===============================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

:: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ All prerequisites met!
echo.

:: Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

:: Generate secrets
echo.
echo 🔐 Generating JWT secrets...
call scripts\generate-secrets.bat

echo.
echo 🎉 Setup complete!
echo.
echo Next steps for deployment:
echo.
echo 1. 📊 Set up MongoDB Atlas:
echo    - Go to https://www.mongodb.com/atlas
echo    - Create a free cluster
echo    - Get your connection string
echo.
echo 2. 🚀 Deploy Backend to Render:
echo    - Go to https://render.com
echo    - Create a new Web Service
echo    - Connect your GitHub repository
echo    - Set root directory to 'backend'
echo    - Add environment variables (see DEPLOYMENT_GUIDE.md)
echo.
echo 3. 🌐 Deploy Frontend to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repository
echo    - Set root directory to 'frontend'
echo    - Add REACT_APP_API_URL environment variable
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo 📋 Use DEPLOYMENT_CHECKLIST.md to track your progress
echo.
pause
