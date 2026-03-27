import { requireAdmin } from '@/lib/server-auth';
import { buildAudienceRecipients, getAudienceLabel } from '@/lib/email/audience';

export async function GET(request, { params }) {
  try {
    const { id: campaignId } = params; // in Next.js App Router
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Fetch campaign details using service client (bypasses RLS temporarily)
    const { data: campaign, error: campaignError } = await serviceClient
      .from('email_campaigns')
      .select('name, audience_type, audience_value, subject')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get audience emails using shared utility (already deduplicated)
    const { recipients, totalRecipients, rawCount } = await buildAudienceRecipients(campaign, serviceClient);

    // Get sample emails for preview
    const sampleEmails = recipients.slice(0, 10).map(e => ({
      email: e.email,
      first_name: e.first_name,
      business_handle: e.business_handle
    }));

    return Response.json({
      success: true,
      campaign: {
        id: campaignId,
        name: campaign.name,
        audience_type: campaign.audience_type,
        audience_value: campaign.audience_value,
        audience_label: getAudienceLabel(campaign),
        subject: campaign.subject
      },
      audience_preview: {
        total_raw: rawCount,
        total_unique: totalRecipients,
        duplicates_removed: rawCount - totalRecipients,
        sample_emails: sampleEmails,
        estimated_recipients: totalRecipients
      }
    });

  } catch (error) {
    console.error('Audience preview error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
