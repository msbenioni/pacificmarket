# 🔌 API Documentation

> **📅 Last Updated:** March 2026  
> **🎯 Platform:** Pacific Discovery Network

---

## 📋 **Table of Contents**

1. [Authentication](#authentication)
2. [Business APIs](#business-apis)
3. [Email APIs](#email-apis)
4. [Admin APIs](#admin-apis)
5. [Payment APIs](#payment-apis)
6. [Error Handling](#error-handling)

---

## 🔐 **Authentication**

### **Supabase Auth Integration**

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

### **Protected Routes**

```javascript
// Server-side authentication
import { createServiceClient } from '@/lib/server-auth'

export async function POST(request) {
  const serviceClient = createServiceClient()
  const { data: { user } } = await serviceClient.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

---

## 🏢 **Business APIs**

### **Business Management**

#### `GET /api/businesses/[id]`
- **Purpose**: Retrieve business details
- **Authentication**: Required
- **Response**: Business object with full details

#### `POST /api/businesses`
- **Purpose**: Create new business listing
- **Authentication**: Required
- **Body**: Business data object

#### `PUT /api/businesses/[id]`
- **Purpose**: Update business information
- **Authentication**: Owner or admin required
- **Body**: Updated business data

### **Business Discovery**

#### `GET /api/businesses/search`
```javascript
// Query parameters
{
  q: "search term",
  industry: "technology",
  country: "New Zealand",
  city: "Auckland",
  limit: 20,
  offset: 0
}
```

---

## 📧 **Email APIs**

### **Google Workspace SMTP Integration**

All email APIs use Google Workspace SMTP configuration:

```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};
```

### **Email Endpoints**

#### `POST /api/emails/contact`
- **Purpose**: General contact form submissions
- **Body**: `{ name, email, subject, message, inquiryType }`
- **Sends to**: Admin team and user confirmation

#### `POST /api/emails/business-contact`
- **Purpose**: Business-to-business contact requests
- **Body**: `{ business, userEmail, userName }`
- **Sends to**: Business owner and admin team

#### `POST /api/emails/owner-invite`
- **Purpose**: Send business ownership invitations
- **Body**: `{ ownerEmail, ownerName, businessName, businessId }`

---

## 👥 **Admin APIs**

### **Email Campaign Management**

#### `POST /api/admin/email/campaigns`
- **Purpose**: Create and manage email campaigns
- **Authentication**: Admin required
- **Features**: Test emails, campaign scheduling

#### `POST /api/admin/email/processor`
- **Purpose**: Background email processing
- **Authentication**: Internal API secret required
- **Usage**: Cron job endpoint

### **Notification Management**

#### `GET /api/admin/notifications/settings`
- **Purpose**: Retrieve admin notification preferences
- **Authentication**: Admin required

#### `PUT /api/admin/notifications/settings`
- **Purpose**: Update notification preferences
- **Authentication**: Admin required

---

## 💳 **Payment APIs**

### **Stripe Integration**

#### `POST /api/stripe/checkout`
- **Purpose**: Create Stripe checkout session
- **Authentication**: User required
- **Body**: `{ tier, businessId, successUrl, cancelUrl }`

#### `POST /api/stripe/webhook`
- **Purpose**: Handle Stripe webhooks
- **Authentication**: Stripe signature verification
- **Events**: Subscription lifecycle events

### **Subscription Tiers**

```javascript
const SUBSCRIPTION_TIERS = {
  VAKA: 'vaka',      // Free tier
  MANA: 'mana',      // $4.99/month
  MOANA: 'moana'     // $29.00/month
};
```

---

## 🔍 **Search & Discovery APIs**

### **Business Search**

#### `GET /api/search/businesses`
```javascript
// Advanced search parameters
{
  query: "restaurant",
  filters: {
    industry: "Food & Beverage",
    country: "New Zealand",
    city: "Auckland",
    subscriptionTier: "mana"
  },
  sort: {
    field: "name",
    order: "asc"
  },
  pagination: {
    limit: 20,
    offset: 0
  }
}
```

### **Category Discovery**

#### `GET /api/categories`
- **Purpose**: Retrieve available business categories
- **Response**: Array of category objects with counts

---

## 📊 **Analytics APIs**

### **Business Insights**

#### `GET /api/analytics/business/[id]/insights`
- **Purpose**: Retrieve business analytics data
- **Authentication**: Owner or admin required
- **Metrics**: Views, clicks, contact requests, profile views

#### `GET /api/analytics/business/[id]/trends`
- **Purpose**: Get business performance trends
- **Authentication**: Owner or admin required
- **Timeframes**: Daily, weekly, monthly data

---

## 🛡️ **Error Handling**

### **Standard Error Response**

```javascript
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error context"
  }
}
```

### **Common Error Codes**

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMITED` - Too many requests

### **Rate Limiting**

```javascript
// Rate limiting configuration
const rateLimits = {
  search: 100,      // requests per hour
  contact: 10,      // requests per hour
  checkout: 5       // requests per hour
};
```

---

## 🔄 **Webhook Integration**

### **Stripe Webhooks**

```javascript
// Webhook signature verification
const crypto = require('crypto')

const verifyWebhook = (payload, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload, 'utf8')
  const expectedSignature = hmac.digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

---

## 📝 **Response Formats**

### **Success Response**

```javascript
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2026-03-17T12:00:00Z",
    "requestId": "req_123456"
  }
}
```

### **Paginated Response**

```javascript
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## 🧪 **Testing**

### **API Testing Examples**

```bash
# Test business search
curl "https://pacificdiscoverynetwork.com/api/search/businesses?q=restaurant&limit=10"

# Test contact form
curl -X POST https://pacificdiscoverynetwork.com/api/emails/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","subject":"Test","message":"Hello"}'

# Test Stripe checkout
curl -X POST https://pacificdiscoverynetwork.com/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{"tier":"mana","businessId":"123"}'
```

---

## 📞 **API Support**

For API-related issues:
- **Email**: `contact@pacificdiscoverynetwork.com`
- **Documentation**: This guide and individual endpoint docs
- **Rate Limits**: Contact for increased limits

---

*Last updated: March 2026*
