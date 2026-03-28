import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { notifyNewBusinessCreated, notifyNewBusinessClaim } from "../../src/utils/notifyAdmin.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError) throw authError

    // This is called by database webhook/trigger
    const { type, business_id, claim_id, user_id, created_via } = await req.json()

    console.log('Processing notification:', { type, business_id, claim_id, user_id, created_via })

    // Only process user-originated notifications
    if (!['user_claim_modal', 'user_portal'].includes(created_via)) {
      console.log('Skipping admin-created notification:', created_via)
      return new Response(JSON.stringify({ skipped: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      })
    }

    if (type === 'business_created') {
      // Fetch business and user details
      const { data: business } = await supabaseClient
        .from('businesses')
        .select('*')
        .eq('id', business_id)
        .single()

      const { data: userData } = await supabaseClient.auth.admin.getUserById(user_id)

      if (business && userData) {
        await notifyNewBusinessCreated(business, userData.user)
        console.log('Business notification sent:', business.business_name)
      }
    } else if (type === 'claim_created') {
      // Fetch claim, business, and user details
      const { data: claim } = await supabaseClient
        .from('claim_requests')
        .select('*')
        .eq('id', claim_id)
        .single()

      const { data: business } = await supabaseClient
        .from('businesses')
        .select('*')
        .eq('id', business_id)
        .single()

      const { data: userData } = await supabaseClient.auth.admin.getUserById(user_id)

      if (claim && business && userData) {
        await notifyNewBusinessClaim(claim, business, userData.user)
        console.log('Claim notification sent:', business.business_name)
      }
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    console.error('Notification error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
