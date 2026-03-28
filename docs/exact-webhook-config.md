# Exact Webhook Configuration

## Your Project Details
- **Project Ref:** `mnmisjprswpuvcojnbip`
- **Edge Function URL:** `https://mnmisjprswpuvcojnbip.supabase.co/functions/v1/handle-notifications`
- **Webhook Secret:** `pacific-webhook-secret-2024-secure-key`

## Step 1: Create Businesses Webhook

Go to: https://supabase.com/dashboard/project/mnmisjprswpuvcojnbip/database/webhooks

**Webhook Configuration:**
- **Name:** `business-created-notifications`
- **Table:** `public.businesses`
- **Events:** ✅ INSERT only
- **HTTP Method:** POST
- **URL:** `https://mnmisjprswpuvcojnbip.supabase.co/functions/v1/handle-notifications`
- **Secret:** `pacific-webhook-secret-2024-secure-key`

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: pacific-webhook-secret-2024-secure-key
```

**Retry Settings:**
- Retry attempts: 3
- Retry delay: 5s

## Step 2: Create Claim Requests Webhook

**Webhook Configuration:**
- **Name:** `claim-created-notifications`
- **Table:** `public.claim_requests`
- **Events:** ✅ INSERT only
- **HTTP Method:** POST
- **URL:** `https://mnmisjprswpuvcojnbip.supabase.co/functions/v1/handle-notifications`
- **Secret:** `pacific-webhook-secret-2024-secure-key`

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: pacific-webhook-secret-2024-secure-key
```

**Retry Settings:**
- Retry attempts: 3
- Retry delay: 5s

## Step 3: Set Edge Function Environment Variable

Go to: https://supabase.com/dashboard/project/mnmisjprswpuvcojnbip/functions/handle-notifications

**Environment Variables:**
- **WEBHOOK_SECRET:** `pacific-webhook-secret-2024-secure-key`

## Step 4: Deploy Edge Function

```bash
cd supabase/functions/handle-notifications
supabase functions deploy handle-notifications
```

## Step 5: Test

1. Create a test business through the UI
2. Check Edge Function logs: https://supabase.com/dashboard/project/mnmisjprswpuvcojnbip/functions/handle-notifications/logs
3. Check webhook delivery logs in Database > Webhooks

## Database Status
✅ created_via columns exist
✅ Notification functions created
✅ Triggers updated for webhooks

Everything is ready for webhook configuration!
