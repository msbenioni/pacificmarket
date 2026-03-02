**Welcome to the Pacific Market Registry**

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
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

Run the app: `npm run dev`

**Deploy on Netlify**

Netlify is configured via `netlify.toml`. Make sure environment variables from `.env.example` are set in Netlify.
