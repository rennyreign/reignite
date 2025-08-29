#!/bin/bash

# Setup GitHub Repository for Reignite Capability Tracker
echo "🚀 Setting up GitHub repository for Reignite..."

# Navigate to project directory
cd "/Users/renaldoedmondson/Library/CloudStorage/Dropbox/Projects/think diffrent/capability tracker"

# Check if git is already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Reignite capability tracker

- React frontend with comprehensive UI components
- Flask backend with SQLAlchemy models
- 10 capability categories assessment system
- Interactive charts and progress tracking
- Student profile management
- Assessment history and trends
- Complete documentation and setup guides"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo "❌ Please install GitHub CLI manually: https://cli.github.com/"
        exit 1
    fi
fi

# Login to GitHub (if not already logged in)
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub:"
    gh auth login
fi

# Create GitHub repository
echo "🌟 Creating GitHub repository 'reignite'..."
gh repo create reignite --public --description "A web application for tracking and assessing student capabilities across multiple categories. Built with React and Flask for homeschool families and educators." --clone=false

# Get GitHub username
GITHUB_USER=$(gh api user --jq .login)

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin "https://github.com/$GITHUB_USER/reignite.git"

# Set main branch
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "🎉 Successfully created GitHub repository!"
echo "📍 Repository URL: https://github.com/$GITHUB_USER/reignite"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Add any additional collaborators if needed"
echo "3. Set up GitHub Pages if you want to deploy the frontend"
echo "4. Configure any CI/CD workflows"
echo ""
echo "✨ Your Reignite capability tracker is now on GitHub!"
