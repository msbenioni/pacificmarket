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

export async function POST(request, context) {
  try {
    const params = await context.params;
    const campaignId = params?.id;
    
    // Authenticate admin
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
    const { name, subject, audience_type, audience_value } = await request.json();

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Fetch the original campaign - only select the fields we need
    const { data: originalCampaign, error: fetchError } = await userClient
      .from('email_campaigns')
      .select('name, subject, html_content, audience_type, audience_value')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Fetch original campaign error:', {
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint,
        code: fetchError.code,
        campaignId
      });
      return Response.json({ 
        error: 'Campaign not found', 
        details: fetchError.message 
      }, { status: 404 });
    }

    if (!originalCampaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Validate that original campaign has required audience fields
    if (!originalCampaign.audience_type) {
      return Response.json({ 
        error: 'Original campaign has invalid audience structure',
        details: 'Missing audience_type field'
      }, { status: 400 });
    }

    // Create new campaign with copied data - only copy safe fields
    const newCampaignData = {
      name: name || `${originalCampaign.name} (Copy)`,
      subject: subject || originalCampaign.subject,
      html_content: originalCampaign.html_content,
      audience_type: audience_type || originalCampaign.audience_type,
      audience_value: audience_value !== undefined ? audience_value : originalCampaign.audience_value,
      status: 'draft',
      created_by: auth.user.id, // Use current authenticated user
      updated_at: new Date().toISOString()
    };

    console.log('Creating duplicate campaign:', {
      originalId: campaignId,
      newData: { ...newCampaignData, html_content: '[CONTENT]' } // Don't log HTML content
    });

    const { data: newCampaign, error: createError } = await userClient
      .from('email_campaigns')
      .insert(newCampaignData)
      .select()
      .single();

    if (createError) {
      console.error('Create duplicate campaign error:', {
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
        code: createError.code,
        campaignId,
        insertData: { ...newCampaignData, html_content: '[CONTENT]' }
      });
      
      // Return more specific error information
      const errorResponse = {
        error: 'Failed to duplicate campaign',
        details: createError.message,
        hint: createError.hint,
        code: createError.code
      };
      return Response.json(errorResponse, { status: 500 });
    }

    console.log('Campaign duplicated successfully:', { 
      newId: newCampaign.id,
      newName: newCampaign.name 
    });

    return Response.json({ 
      success: true, 
      campaign: newCampaign,
      message: 'Campaign duplicated successfully'
    });

  } catch (error) {
    console.error('Duplicate campaign unexpected error:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const campaignId = params?.id;
    
    // Authenticate admin
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
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
    const { data: existingCampaign, error: fetchError } = await userClient
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

    // Update campaign
    const updateData = {
      name,
      subject,
      html_content,
      audience_type,
      audience_value,
      updated_at: new Date().toISOString()
    };

    const { data: campaign, error } = await userClient
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

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const campaignId = params?.id;
    
    // Authenticate admin
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Check if campaign exists and can be deleted
    const { data: existingCampaign, error: fetchError } = await userClient
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

    // Delete campaign (will cascade delete recipients)
    const { error } = await userClient
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
