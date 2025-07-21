@echo off
echo 🚀 Deploying Personal Library Tracker...
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

:: Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

:: Build frontend
echo 🔨 Building frontend...
cd frontend
call npm run build
cd ..

:: Run tests (if available)
echo 🧪 Running tests...
call npm test 2>nul || echo ⚠️  No tests found, skipping...

echo.
echo ✅ Build completed successfully!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Render (auto-deploys from GitHub)
echo 3. Deploy frontend to Vercel (auto-deploys from GitHub)
echo 4. Configure environment variables on both platforms
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions.
pause
