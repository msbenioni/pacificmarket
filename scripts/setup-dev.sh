#!/bin/bash

# Development Setup Script for Pacific Discovery Network
echo "🚀 Setting up Pacific Discovery Network development environment..."

# Check if required tools are installed
echo "📋 Checking required tools..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 22 or higher."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Check Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Start Supabase local development
echo "🗄️ Starting Supabase local development..."
supabase start

# Link to Netlify (optional)
echo "🌐 To link to Netlify, run: netlify link"
echo "🚀 Development environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Run 'supabase status' to get local database credentials"
echo "3. Update your .env.local with the local Supabase credentials"
echo "4. Run 'netlify dev' to test local Netlify functions"
