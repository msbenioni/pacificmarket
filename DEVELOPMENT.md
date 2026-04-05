# Development Setup Guide

This guide will help you set up the Pacific Discovery Network development
environment with all the recommended tools and configurations.

## 🚀 Quick Start

### Automated Setup (Recommended)

Run the automated setup script for your platform:

**Windows:**

```bash
npm run setup:win
```

**macOS/Linux:**

```bash
npm run setup
```

This will:

- Install required global tools (Supabase CLI, Netlify CLI)
- Install project dependencies
- Start Supabase local development
- Create .env.local file with template

---

## 🛠️ Manual Setup

### Prerequisites

- **Node.js** 22 or higher
- **npm** 10 or higher
- **Git**

### 1. Install Global Tools

```bash
# Supabase CLI (for local database)
npm install -g supabase

# Netlify CLI (for deployment and local functions)
npm install -g netlify-cli

# Optional: Stripe CLI (for payment testing)
npm install -g stripe-cli
```

### 2. Install Project Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file:

```bash
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
```

### 4. Start Supabase Local Development

```bash
npm run supabase:start
```

Get your local database credentials:

```bash
npm run supabase:status
```

Update your `.env.local` with the local Supabase URL and keys.

---

## 🎯 Development Workflow

### Daily Development

1. **Start Supabase:**
   ```bash
   npm run supabase:start
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Start Netlify Functions (Optional):**
   ```bash
   npm run netlify:dev
   ```

### Code Quality

- **Linting:**
  ```bash
  npm run lint
  ```

- **Fix Linting Issues:**
  ```bash
  npm run lint:fix
  ```

- **Type Checking:**
  ```bash
  npm run typecheck
  ```

---

## 🔧 VS Code Configuration

The project includes optimized VS Code settings:

### Extensions (Auto-recommended)

- **Tailwind CSS IntelliSense** - CSS class completion
- **ESLint** - Code quality and linting
- **React/JSX Snippets** - React code snippets
- **Auto Rename Tag** - Paired tag renaming
- **CSS Peek** - CSS class navigation
- **GitHub Copilot** - AI coding assistant
- **Material Icon Theme** - File icons
- **Color Highlight** - Color preview

### Features Enabled

- **Format on save** with ESLint
- **Auto-fix on save** for linting issues
- **Organize imports on save**
- **Tailwind CSS IntelliSense** for class names
- **TypeScript Next.js** support

---

## 🗄️ Database Management

### Supabase Commands

```bash
# Start local development
npm run supabase:start

# Stop local development
npm run supabase:stop

# Check status
npm run supabase:status

# Generate types
supabase gen types typescript --local > src/types/supabase.ts

# Run migrations
supabase db push

# Reset database
supabase db reset
```

### Database Access

- **Studio:** http://localhost:54323
- **Database:** postgresql://postgres:postgres@localhost:54322/postgres
- **API:** http://localhost:54321

---

## 🌐 Deployment

### Local Testing

```bash
# Test Netlify functions locally
npm run netlify:dev
```

### Production Deployment

```bash
# Deploy to Netlify
npm run netlify:deploy

# Build for production
npm run build
```

---

## 📋 Available Scripts

| Script                    | Description                      |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Start Next.js development server |
| `npm run build`           | Build for production             |
| `npm run start`           | Start production server          |
| `npm run lint`            | Run ESLint                       |
| `npm run lint:fix`        | Fix ESLint issues                |
| `npm run typecheck`       | Run TypeScript type checking     |
| `npm run setup`           | Automated setup (macOS/Linux)    |
| `npm run setup:win`       | Automated setup (Windows)        |
| `npm run supabase:start`  | Start Supabase local development |
| `npm run supabase:stop`   | Stop Supabase local development  |
| `npm run supabase:status` | Check Supabase status            |
| `npm run netlify:dev`     | Test Netlify functions locally   |
| `npm run netlify:deploy`  | Deploy to Netlify                |

---

## � Firecrawl Web Scraping

Firecrawl is integrated for web scraping and business data enrichment capabilities.

### Features
- **Single page scraping** - Extract content from business websites
- **Multi-page crawling** - Crawl entire business websites
- **Business data enrichment** - Auto-extract contact info, services, social links
- **Batch processing** - Process multiple businesses at once
- **Dynamic actions** - Click, scroll, fill forms, take screenshots
- **AI-powered extraction** - Structured data extraction with custom schemas
- **Browser automation** - Remote browser sessions for complex interactions
- **Advanced search** - Web search with filtering and scraping
- **Structured data** - JSON schema-based data extraction

### Setup
1. **Get API Key:** Sign up at [Firecrawl](https://www.firecrawl.dev)
2. **Add to Environment:** `FIRECRAWL_API_KEY=fc-your-key-here`
3. **Install Package:** `npm install @mendable/firecrawl-js`

### Usage Examples

```javascript
// Import utilities
import { 
  scrapeBusinessWebsite, 
  enrichBusinessData,
  scrapeWithActions,
  extractStructuredData,
  startBrowserSession,
  advancedSearch 
} from '@/utils/firecrawlUtils';
import { 
  useBusinessScraper,
  useActionScraper,
  useStructuredExtractor,
  useBrowserSession,
  useAdvancedSearch 
} from '@/hooks/useFirecrawl';

// Basic scraping
const data = await scrapeBusinessWebsite('https://example-business.com');

// Dynamic actions scraping
const actionData = await scrapeWithActions('https://example.com', [
  { type: 'wait', milliseconds: 1000 },
  { type: 'scroll', direction: 'down' },
  { type: 'click', selector: '#load-more' },
  { type: 'screenshot' }
]);

// AI-powered structured extraction
const structuredData = await extractStructuredData(
  'https://example.com',
  'Extract business name, contact info, and services',
  {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      services: { type: "array", items: { type: "string" } }
    }
  }
);

// Browser automation
const session = await startBrowserSession();
await executeInBrowser(session.sessionId, `
  await page.goto("https://example.com");
  await page.click("#login-button");
  await page.type("#email", "user@example.com");
  await page.type("#password", "password123");
  await page.click("#submit");
`);

// Advanced web search
const searchResults = await advancedSearch('Pacific tourism businesses', {
  sources: ['web', 'news'],
  location: { country: 'US', languages: ['en'] },
  limit: 20
});

// React hook usage
const scraper = useBusinessScraper();
const actionScraper = useActionScraper();
const extractor = useStructuredExtractor();
const browserSession = useBrowserSession();
const searchHook = useAdvancedSearch();

await scraper.scrapeWebsite('https://example.com');
await actionScraper.scrapeWithActions('https://example.com', [{ type: 'scroll' }]);
await extractor.extractData('https://example.com', 'Extract contact info', schema);
await browserSession.startSession();
await searchHook.performSearch('business query');
```

### Demo Component
Access the Firecrawl demo at `/admin/firecrawl-demo` to test all features.

### Rate Limits
- **Free Tier:** 500 requests/month, 10 concurrent
- **Paid Tier:** 10,000 requests/month, 50 concurrent

---

## �� Troubleshooting

### Common Issues

1. **Supabase CLI not found:**
   ```bash
   npm install -g supabase
   ```

2. **Port conflicts:**
   ```bash
   npm run supabase:stop
   npm run supabase:start
   ```

3. **Environment variables not working:**
   - Ensure `.env.local` is in project root
   - Restart development server after changing env vars

4. **ESLint errors on save:**
   - Check `.vscode/settings.json` for formatter configuration
   - Run `npm run lint:fix` manually

### Getting Help

- Check the [Supabase Docs](https://supabase.com/docs)
- Check the [Next.js Docs](https://nextjs.org/docs)
- Check the [Netlify Docs](https://docs.netlify.com)

---

## 🎉 Ready to Develop!

Once setup is complete:

1. Your local Supabase is running
2. Development server is ready
3. VS Code is configured
4. All tools are integrated

You're ready to start building! 🚀
