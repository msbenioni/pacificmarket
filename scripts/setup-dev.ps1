# Development Setup Script for Pacific Discovery Network (PowerShell)
Write-Host "🚀 Setting up Pacific Discovery Network development environment..." -ForegroundColor Green

# Check if required tools are installed
Write-Host "📋 Checking required tools..." -ForegroundColor Blue

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 22 or higher." -ForegroundColor Red
    exit 1
}

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Check Supabase CLI
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
}

# Check Netlify CLI
if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Install project dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
npm install

# Start Supabase local development
Write-Host "🗄️ Starting Supabase local development..." -ForegroundColor Blue
supabase start

Write-Host "🌐 To link to Netlify, run: netlify link" -ForegroundColor Cyan

# Create .env.local if it doesn't exist
$envPath = Join-Path $PWD ".env.local"
if (-not (Test-Path $envPath)) {
    Write-Host "� Creating .env.local file..." -ForegroundColor Yellow
    @"
# Supabase Configuration
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
"@ | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ .env.local created. Please update with your actual keys." -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor White
Write-Host "1. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "2. Run 'supabase status' to get local database credentials" -ForegroundColor White
Write-Host "3. Update your .env.local with the local Supabase credentials" -ForegroundColor White
Write-Host "4. Run 'netlify dev' to test local Netlify functions" -ForegroundColor White
Write-Host "🚀 Development environment setup complete!" -ForegroundColor Green
