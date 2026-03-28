/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const providedSecret = req.headers.get("X-Webhook-Secret");
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");

    if (!webhookSecret) {
      throw new Error("WEBHOOK_SECRET not configured");
    }

    if (!providedSecret || providedSecret !== webhookSecret) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const body = await req.json();
    const { table, record } = body;

    console.log("Processing webhook:", {
      table,
      record_id: record?.id,
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const created_via = record?.created_via;
    const business_id = record?.business_id || record?.id;
    const _user_id = record?.user_id || record?.owner_user_id;

    if (!["user_claim_modal", "user_portal"].includes(created_via)) {
      return new Response(JSON.stringify({ skipped: true, reason: "admin-created" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (table === "claim_requests" && record?.claim_type === "direct") {
      return new Response(JSON.stringify({ skipped: true, reason: "direct-claim" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // TODO: move these helpers into supabase/functions/_shared/notifyAdmin.ts
    // import from there instead of ../../src/utils/notifyAdmin.js

    if (table === "businesses") {
      console.log("Business webhook received for:", record?.business_name);

      // TODO: Add user fetch when implementing notifications
      // const { data: _userData, error: userError } =
      //   await supabaseClient.auth.admin.getUserById(user_id);
      // if (userError) throw userError;

      // await notifyNewBusinessCreated(record, _userData.user)
    }

    if (table === "claim_requests") {
      const { data: business, error: businessError } = await supabaseClient
        .from("businesses")
        .select("*")
        .eq("id", business_id)
        .single();

      if (businessError) throw businessError;

      console.log("Claim webhook received for:", business?.business_name);

      // TODO: Add user fetch when implementing notifications
      // const { data: _userData, error: userError } =
      //   await supabaseClient.auth.admin.getUserById(user_id);
      // if (userError) throw userError;

      // await notifyNewBusinessClaim(record, business, _userData.user)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
