/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { createHmac } from "https://deno.land/std/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .toString('hex')
  
  return signature === expectedSignature
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('X-Webhook-Secret')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      throw new Error('WEBHOOK_SECRET not configured')
    }

    const body = await req.text()
    
    if (!verifyWebhookSignature(body, signature || '', webhookSecret)) {
      console.error('Invalid webhook signature')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401 
      })
    }

    // Parse webhook payload
    const webhookData = JSON.parse(body)
    const { type, table, record } = webhookData

    console.log('Processing webhook:', { type, table, record_id: record?.id })

    // Use service role for server-to-server calls
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract relevant data from webhook payload
    const created_via = record?.created_via
    const business_id = record?.business_id || record?.id
    const user_id = record?.user_id || record?.owner_user_id

    // Only process user-originated notifications
    if (!['user_claim_modal', 'user_portal'].includes(created_via)) {
      console.log('Skipping admin-created notification:', created_via)
      return new Response(JSON.stringify({ skipped: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      })
    }

    // Skip direct claims to avoid duplicate notifications
    if (table === 'claim_requests' && record?.claim_type === 'direct') {
      console.log('Skipping direct claim notification to avoid duplicates')
      return new Response(JSON.stringify({ skipped: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      })
    }

    // Import notification functions
    const { notifyNewBusinessCreated, notifyNewBusinessClaim } = await import(
      "../../src/utils/notifyAdmin.js"
    )

    if (table === 'businesses') {
      // Fetch user details
      const { data: userData } = await supabaseClient.auth.admin.getUserById(user_id)

      if (record && userData) {
        await notifyNewBusinessCreated(record, userData.user)
        console.log('✅ Business notification sent:', record.business_name)
      }
    } else if (table === 'claim_requests') {
      // Fetch business and user details
      const { data: business } = await supabaseClient
        .from('businesses')
        .select('*')
        .eq('id', business_id)
        .single()

      const { data: userData } = await supabaseClient.auth.admin.getUserById(user_id)

      if (record && business && userData) {
        await notifyNewBusinessClaim(record, business, userData.user)
        console.log('✅ Claim notification sent:', business.business_name)
      }
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
