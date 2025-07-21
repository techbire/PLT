#!/bin/bash

echo "🚀 Personal Library Tracker - Quick Deployment Setup"
echo "=================================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "✅ Checking prerequisites..."
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

echo "✅ All prerequisites met!"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Generate secrets
echo "🔐 Generating JWT secrets..."
chmod +x scripts/generate-secrets.sh
./scripts/generate-secrets.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps for deployment:"
echo ""
echo "1. 📊 Set up MongoDB Atlas:"
echo "   - Go to https://www.mongodb.com/atlas"
echo "   - Create a free cluster"
echo "   - Get your connection string"
echo ""
echo "2. 🚀 Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to 'backend'"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "3. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Add REACT_APP_API_URL environment variable"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
