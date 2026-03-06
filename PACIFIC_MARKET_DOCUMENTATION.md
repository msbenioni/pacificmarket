# Pacific Market - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Current Data State](#current-data-state)
5. [Application Structure](#application-structure)
6. [Key Features](#key-features)
7. [Business Logic](#business-logic)
8. [Deployment & Environment](#deployment--environment)
9. [Development Guidelines](#development-guidelines)
10. [Troubleshooting](#troubleshooting)

---

## 🌺 Project Overview

**Pacific Market** is the first global structured registry of Pacific-owned businesses. The platform provides a searchable database that helps people discover, connect with, and support Pacific enterprises worldwide.

### Mission
- Create a comprehensive registry of Pacific-owned businesses
- Enable discovery and connection between Pacific enterprises
- Provide economic insights through data analytics
- Support Pacific business growth and visibility

### Key Statistics (Current)
- **36 Active Businesses** registered
- **7 Countries** represented
- **9 Industry Categories** covered
- **2 Verified Business Profiles**
- **1 Pending Claim Request**

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (React 18)
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks + TanStack Query
- **Forms**: React Hook Form + Zod validation

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: RESTful endpoints via Supabase

### Payment & Integration
- **Payments**: Stripe (webhook handling)
- **Email**: Resend
- **Deployment**: Netlify (serverless functions)

### Development Tools
- **Language**: TypeScript (via jsconfig.json)
- **Linting**: ESLint with React/Next.js rules
- **Package Manager**: npm

---

## 🗄 Database Schema

### Core Tables

#### `businesses`
Main business registry table with comprehensive business information.

**Key Fields:**
- `id` (UUID) - Primary key
- `name` (varchar) - Business name
- `business_handle` (varchar) - Unique URL identifier
- `industry` (varchar) - Industry category (standardized)
- `country` (varchar) - Country of operation
- `city` (varchar) - City location
- `status` (varchar) - Business status (active/pending/rejected)
- `verified` (boolean) - Verification status
- `claimed` (boolean) - Whether business is claimed
- `subscription_tier` (varchar) - Vaka/Mana/Moana tiers
- `social_links` (jsonb) - Social media links object
- `description` (text) - Business description
- `contact_email` (varchar) - Public contact email
- `contact_phone` (varchar) - Public contact phone
- `website` (varchar) - Business website
- `logo_url` (varchar) - Logo image URL
- `banner_url` (varchar) - Banner image URL
- `created_date` (date) - Creation date
- `updated_at` (timestamp) - Last update

#### `profiles`
User profile information linked to authentication.

**Key Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Link to auth.users
- `first_name` (varchar)
- `last_name` (varchar)
- `email` (varchar)
- `role` (enum) - buyer/seller/admin
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `claim_requests`
Business ownership claim requests.

**Key Fields:**
- `id` (UUID) - Primary key
- `business_id` (UUID) - Link to businesses table
- `user_id` (UUID) - Claimant user ID
- `status` (varchar) - pending/approved/rejected
- `message` (text) - Claim message
- `evidence` (jsonb) - Supporting evidence
- `created_at` (timestamp)

#### `business_insights_snapshots`
Economic data and business insights.

**Key Fields:**
- `id` (UUID) - Primary key
- `business_id` (UUID) - Link to businesses table
- `submitted_date` (date)
- `insights_data` (jsonb) - Economic insights
- `revenue_band` (varchar)
- `employee_count` (varchar)

---

## 📊 Current Data State

### Business Statistics
- **Total Businesses**: 36
- **Active**: 36 (100%)
- **Pending**: 0
- **Rejected**: 0
- **Verified**: 0
- **Claimed**: 2 (5.6%)

### Industry Distribution
| Industry | Count | Percentage |
|----------|-------|------------|
| Arts & Crafts | 19 | 52.8% |
| Professional Services | 5 | 13.9% |
| Food & Beverage | 3 | 8.3% |
| Health & Wellness | 3 | 8.3% |
| Digital & IT Technology | 2 | 5.6% |
| Media & Entertainment | 1 | 2.8% |
| Beauty & Personal Care | 1 | 2.8% |
| Hospitality & Tourism | 1 | 2.8% |
| Construction & Trade | 1 | 2.8% |

### Geographic Distribution
| Country | Count | Percentage |
|---------|-------|------------|
| New Zealand | 23 | 63.9% |
| United States | 4 | 11.1% |
| Australia | 3 | 8.3% |
| French Polynesia | 3 | 8.3% |
| Papua New Guinea | 1 | 2.8% |
| France | 1 | 2.8% |
| Samoa | 1 | 2.8% |

### User Statistics
- **Total Profiles**: 2
- **Claim Requests**: 1 (pending)
- **Insight Snapshots**: 0

---

## 🏗 Application Structure

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [page]/            # Dynamic routes
│   ├── api/               # API endpoints
│   ├── customer-portal/   # Customer portal pages
│   └── layout.jsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── forms/            # Form components
│   ├── home/             # Homepage components
│   ├── registry/         # Business registry components
│   ├── shared/           # Shared UI components
│   └── ui/               # Base UI components
├── constants/            # Application constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   └── supabase/         # Supabase client setup
├── screens/              # Page components
├── styles/               # Global styles
└── utils/                # Utility functions
```

### Key Pages & Routes
- `/` - Homepage with business registry
- `/registry` - Main business directory
- `/admin` - Admin dashboard (protected)
- `/business-portal` - Business owner portal
- `/help` - Help and FAQ pages
- `/pricing` - Subscription tiers page
- `/about` - About page

---

## ⭐ Key Features

### Business Registry
- **Search & Filter**: By name, industry, country, verification status
- **Detailed Profiles**: Comprehensive business information
- **Media Support**: Logo and banner images
- **Social Links**: Integrated social media profiles

### Admin Dashboard
- **Business Management**: Create, edit, approve businesses
- **Status Control**: Active/pending/rejected status management
- **Verification System**: Business verification workflow
- **Analytics**: Business statistics and insights
- **Claim Management**: Review ownership claims

### User Portal
- **Business Claims**: Request ownership of listings
- **Profile Management**: User profile and business management
- **Tier Upgrades**: Subscription management via Stripe

### Data & Analytics
- **Economic Insights**: Business snapshot data collection
- **Industry Analytics**: Sector distribution and trends
- **Geographic Analysis**: Regional business distribution

---

## 🔄 Business Logic

### Business Status Flow
1. **Creation** → `pending` status
2. **Admin Review** → `active` or `rejected`
3. **Verification** → Optional verification badge
4. **Claiming** → Business ownership transfer

### Subscription Tiers
- **Vaka** (Free): Basic listing, public discoverability
- **Mana** ($9/month): Enhanced features, branding options
- **Moana** ($19/month): Premium features, advanced analytics

### Industry Categories (Standardized)
1. Agriculture
2. Arts & Crafts
3. Beauty & Personal Care
4. Books & Publishing
5. Clothing & Fashion
6. Coaching (Business & Personal)
7. Construction & Trade
8. Digital & IT Technology
9. Education & Training
10. Fashion Accessories
11. Finance & Insurance
12. Food & Beverage
13. Health & Wellness
14. Hospitality & Tourism
15. Jewellery & Watches
16. Legal Services
17. Manufacturing
18. Media & Entertainment
19. Professional Services
20. Stationery & Office Supplies
21. Transport & Logistics
22. Other

---

## 🚀 Deployment & Environment

### Environment Variables
```env
# App URLs
NEXT_PUBLIC_APP_DEV_URL=http://localhost:3000
NEXT_PUBLIC_APP_PROD_URL=https://pacificmarket.co.nz

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
SUPABASE_CONNECTION_STRING=postgresql://[connection_string]

# Stripe Configuration
STRIPE_SECRET_KEY=[secret_key]
STRIPE_WEBHOOK_SECRET=[webhook_secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[publishable_key]

# Email (Resend)
RESEND_API_KEY=[api_key]
RESEND_FROM_EMAIL=admin@pacificmarket.co.nz
```

### Deployment Architecture
- **Frontend**: Netlify (static site deployment)
- **Backend**: Supabase (database + auth + storage)
- **Functions**: Netlify Functions for Stripe webhooks
- **CDN**: Netlify's global CDN

---

## 📝 Development Guidelines

### Code Standards
- **Language**: JavaScript/TypeScript hybrid
- **Styling**: TailwindCSS utility classes
- **Components**: Functional components with hooks
- **State**: Local state with useState, global state with React Query

### File Naming Conventions
- **Components**: PascalCase (e.g., `BusinessCard.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `BUSINESS_STATUS.js`)
- **Pages**: kebab-case (e.g., `business-portal.jsx`)

### Git Workflow
- **Main branch**: `main` (production)
- **Feature branches**: Descriptive names
- **Commits**: Conventional commit messages
- **Pull requests**: Required for all changes

### Testing Strategy
- **Manual testing**: Primary testing method
- **Browser testing**: Chrome, Firefox, Safari
- **Mobile testing**: Responsive design verification
- **Integration testing**: End-to-end user flows

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check Supabase connection
npx supabase status
```

#### Environment Variables
```bash
# Verify all required variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### Build Issues
```bash
# Clean build
rm -rf .next
npm run build
```

### Debugging Tips

1. **Check Browser Console** for JavaScript errors
2. **Network Tab** for API request failures
3. **Supabase Dashboard** for database issues
4. **Netlify Functions** logs for server errors

### Performance Optimization
- **Image Optimization**: Use Supabase image transformations
- **Code Splitting**: Next.js automatic splitting
- **Caching**: Supabase RLS and browser caching
- **Bundle Size**: Regular bundle analysis

---

## 📞 Support & Contact

### Technical Support
- **Documentation**: This file (primary source of truth)
- **Issue Tracking**: GitHub Issues
- **Emergency Contact**: Project maintainers

### Business Support
- **Email**: admin@pacificmarket.co.nz
- **Help Center**: `/help` page
- **Business Portal**: `/business-portal`

---

*Last Updated: 2026-03-07*
*Version: 1.0*
*Database Snapshot: 36 businesses, 7 countries, 9 industries*
