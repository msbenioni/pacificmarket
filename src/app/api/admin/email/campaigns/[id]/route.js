import { requireAdmin } from '@/lib/server-auth';
import { validateAudienceStructure } from '@/lib/email/audience';

// Helper for consistent error logging and responses
const handleSupabaseError = (error, operation, context = {}) => {
  const errorDetails = {
    operation,
    error: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    ...context
  };
  
  console.error(`Failed to ${operation}:`, errorDetails);
  
  return {
    error: `Failed to ${operation}`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
};

export async function PUT(request, { params }) {
  try {
    const { id: campaignId } = params;
    
    // Authenticate admin and get service client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;
    const { name, subject, html_content, audience_type, audience_value } = await request.json();

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Validate required fields
    if (!name || !subject || !html_content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate audience structure
    const validation = validateAudienceStructure({ audience_type, audience_value });
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    // First check if campaign exists and is in draft status
    const { data: existingCampaign, error: fetchError } = await serviceClient
      .from('email_campaigns')
      .select('id, status')
      .eq('id', campaignId)
      .single();

    if (fetchError || !existingCampaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Only allow editing draft campaigns
    if (existingCampaign.status !== 'draft') {
      return Response.json({ 
        error: 'Only draft campaigns can be edited' 
      }, { status: 400 });
    }

    // Update campaign using service client
    const updateData = {
      name,
      subject,
      html_content,
      audience_type,
      audience_value,
      updated_at: new Date().toISOString()
    };

    const { data: campaign, error } = await serviceClient
      .from('email_campaigns')
      .update(updateData)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      const errorResponse = handleSupabaseError(error, 'update campaign', { campaignId });
      return Response.json(errorResponse, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      campaign,
      message: 'Campaign updated successfully'
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: campaignId } = params;
    
    // Authenticate admin and get service client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Check if campaign exists and can be deleted
    const { data: existingCampaign, error: fetchError } = await serviceClient
      .from('email_campaigns')
      .select('id, status')
      .eq('id', campaignId)
      .single();

    if (fetchError || !existingCampaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Only allow deleting draft campaigns (safer approach)
    if (existingCampaign.status !== 'draft') {
      return Response.json({ 
        error: 'Only draft campaigns can be deleted' 
      }, { status: 400 });
    }

    // Delete campaign using service client (will cascade delete recipients)
    const { error } = await serviceClient
      .from('email_campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      const errorResponse = handleSupabaseError(error, 'delete campaign', { campaignId });
      return Response.json(errorResponse, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Delete campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
