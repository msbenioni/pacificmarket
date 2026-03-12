**Welcome to the Pacific Market**

**About**

This project runs on Next.js with Supabase, Stripe, and Resend.

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Deploys are handled via Netlify.

**Prerequisites:**

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the required environment variables (see `.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_CONNECTION_STRING=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=public
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_WEBHOOK_URL_ENDPOINT=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID_MANA_NZD=
STRIPE_PRICE_ID_MANA_AUD=
STRIPE_PRICE_ID_MANA_USD=
STRIPE_PRICE_ID_MOANA_NZD=
STRIPE_PRICE_ID_MOANA_AUD=
STRIPE_PRICE_ID_MOANA_USD=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_PROD_URL=
```

Run the app: `npm run dev`

**Deploy on Netlify**

Netlify is configured via `netlify.toml`. Make sure environment variables from `.env.example` are set in Netlify.
