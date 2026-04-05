#!/usr/bin/env node

// Development Setup Script for Pacific Discovery Network (Node.js)
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Pacific Discovery Network development environment...');

// Function to check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to run command with output
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Error running ${command}:`, error.message);
    process.exit(1);
  }
}

// Check if required tools are installed
console.log('📋 Checking required tools...');

// Check Node.js
if (!commandExists('node')) {
  console.error('❌ Node.js is not installed. Please install Node.js 22 or higher.');
  process.exit(1);
}

// Check npm
if (!commandExists('npm')) {
  console.error('❌ npm is not installed. Please install npm.');
  process.exit(1);
}

// Check Supabase CLI
if (!commandExists('supabase')) {
  runCommand('npm install -g supabase', 'Installing Supabase CLI');
}

// Check Netlify CLI
if (!commandExists('netlify')) {
  runCommand('npm install -g netlify-cli', 'Installing Netlify CLI');
}

// Install project dependencies
runCommand('npm install', 'Installing project dependencies');

// Create .env.local if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  fs.writeFileSync(envPath, `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key-here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here

# Resend Configuration
RESEND_API_KEY=re_your-resend-api-key-here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Firecrawl Configuration (Web Scraping)
FIRECRAWL_API_KEY=fc-your-firecrawl-api-key-here

# Netlify Configuration
NEXT_PUBLIC_APP_DEV_URL=http://localhost:3000
NEXT_PUBLIC_APP_PROD_URL=https://your-domain.netlify.app
`);
  console.log('✅ .env.local created. Please update with your actual keys.');
}

console.log('🗄️ Starting Supabase local development...');
runCommand('supabase start', 'Starting Supabase');

console.log('🌐 To link to Netlify, run: netlify link');
console.log('🚀 Development environment setup complete!');
console.log('');
console.log('📝 Next steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Run "npm run supabase:status" to get local database credentials');
console.log('3. Update your .env.local with the local Supabase credentials');
console.log('4. Run "npm run netlify:dev" to test local Netlify functions');
