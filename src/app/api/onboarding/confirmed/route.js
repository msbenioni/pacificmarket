import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNotification, NOTIFICATION_TYPES } from "@/lib/notifications";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Verify the caller is authenticated and matches the userId
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in onboarding table
    const { data: userRow, error: userError } = await supabaseAdmin
      .from("user_onboarding_status")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (userError) {
      console.error("Database error checking onboarding status:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const now = new Date().toISOString();

    // If no record exists, create one and send welcome email
    if (!userRow) {
      // Get user data from auth
      const { data: authUser, error: authUserError } =
        await supabaseAdmin.auth.admin.getUserById(userId);

      if (authUserError || !authUser?.user?.email) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const email = authUser.user.email;
      const userData = {
        email,
        id: userId,
        name: authUser.user.user_metadata?.name || email,
      };

      // Create onboarding record without welcome_email_sent_at initially
      const { error: insertError } = await supabaseAdmin
        .from("user_onboarding_status")
        .insert({
          user_id: userId,
          email,
          confirmed_at: now,
        });

      if (insertError) {
        console.error("Error creating onboarding record:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      // Send welcome email first, then update if successful
      try {
        await sendNotification(
          NOTIFICATION_TYPES.WELCOME_CONFIRMED,
          { email },
          [email]
        );

        // Only mark as sent after successful email delivery
        await supabaseAdmin
          .from("user_onboarding_status")
          .update({
            welcome_email_sent_at: now,
          })
          .eq("user_id", userId);

      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the request, but don't mark as sent either
      }

      return NextResponse.json({ success: true, created: true });
    }

    // If record exists but welcome email not sent, send it
    if (!userRow.welcome_email_sent_at) {
      try {
        await sendNotification(
          NOTIFICATION_TYPES.WELCOME_CONFIRMED,
          { email: userRow.email },
          [userRow.email]
        );

        // Only mark as sent after successful email delivery
        await supabaseAdmin
          .from("user_onboarding_status")
          .update({
            confirmed_at: userRow.confirmed_at || now,
            welcome_email_sent_at: now,
          })
          .eq("user_id", userId);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the request, just log it
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding confirmed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
