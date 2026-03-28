# Supabase Webhook Setup Instructions

## Step 1: Create Businesses Webhook

**Webhook Name:** `business-created-notifications`

**Table:** `public.businesses`

**Events:** 
- ✅ INSERT only

**HTTP Method:** POST

**URL:** `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/handle-notifications`

**Secret:** Generate a secure webhook secret (save this for the Edge Function)

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: [YOUR-WEBHOOK-SECRET]
```

**Condition (Optional):** Leave empty (we'll filter in Edge Function)

**Retry Settings:**
- Retry attempts: 3
- Retry delay: 5s

---

## Step 2: Create Claim Requests Webhook

**Webhook Name:** `claim-created-notifications`

**Table:** `public.claim_requests`

**Events:** 
- ✅ INSERT only

**HTTP Method:** POST

**URL:** `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/handle-notifications`

**Secret:** Use the same webhook secret as above

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: [YOUR-WEBHOOK-SECRET]
```

**Condition (Optional):** Leave empty (we'll filter in Edge Function)

**Retry Settings:**
- Retry attempts: 3
- Retry delay: 5s

---

## Step 3: Update Edge Function with Webhook Secret

Add this to your Edge Function environment variables:

**Variable Name:** `WEBHOOK_SECRET`
**Value:** [YOUR-WEBHOOK-SECRET]

---

## Step 4: Test Webhooks

After creating the webhooks, test them by:

1. Creating a new business through the UI
2. Submitting a claim request
3. Check Supabase logs for webhook delivery
4. Check Edge Function logs for processing

---

## Webhook Payload Format

Supabase will send this payload format:

```json
{
  "type": "INSERT",
  "table": "businesses",
  "record": {
    "id": "...",
    "business_name": "...",
    "created_via": "user_claim_modal",
    // ... all other fields
  },
  "schema": "public",
  "old_record": null
}
```

The Edge Function will extract the needed fields and process notifications.
