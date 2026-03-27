import { requireAdmin } from '@/lib/server-auth';
import { extractTemplateVariables } from '@/constants/emailConstants';

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

export async function GET(request) {
  try {
    // Authenticate admin and get user client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient, serviceClient } = auth;

    // Fetch templates using service client (bypasses RLS temporarily)
    const { data: templates, error } = await serviceClient
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }

    return Response.json({ templates });

  } catch (error) {
    console.error('Templates API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Authenticate admin and get user client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user, serviceClient } = auth;
    const { name, subject, html_content, variables } = await request.json();

    // Validate required fields
    if (!name || !subject || !html_content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract variables from HTML content if not provided
    let templateVariables = variables;
    if (!templateVariables) {
      templateVariables = extractTemplateVariables(html_content);
    }

    // Create template using service client (bypasses RLS temporarily)
    const { data: template, error } = await serviceClient
      .from('email_templates')
      .insert({
        name,
        subject,
        html_content,
        variables: templateVariables,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      const errorResponse = handleSupabaseError(error, 'create template', { 
        templateData: { name, subject, variables: templateVariables }
      });
      return Response.json(errorResponse, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      template,
      message: 'Template created successfully'
    });

  } catch (error) {
    console.error('Create template error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Authenticate admin and get user client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;
    const { templateId, name, subject, html_content, variables } = await request.json();

    if (!templateId) {
      return Response.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Update template using service client (bypasses RLS temporarily)
    const updateData = {};
    if (name) updateData.name = name;
    if (subject) updateData.subject = subject;
    if (html_content) {
      updateData.html_content = html_content;
      // Extract variables from HTML content if not provided
      let templateVariables = variables;
      if (!templateVariables) {
        templateVariables = extractTemplateVariables(html_content);
      }
      updateData.variables = templateVariables;
    }
    if (variables) updateData.variables = variables;
    
    // Always set updated_at on template updates
    updateData.updated_at = new Date().toISOString();

    const { data: template, error } = await serviceClient
      .from('email_templates')
      .update(updateData)
      .eq('id', templateId)
      .select()
      .single();

    if (error) {
      const errorResponse = handleSupabaseError(error, 'update template', { templateId, updateData });
      return Response.json(errorResponse, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      template,
      message: 'Template updated successfully'
    });

  } catch (error) {
    console.error('Update template error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Authenticate admin and get user client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;
    const { templateId } = await request.json();

    if (!templateId) {
      return Response.json({ error: 'Template ID required' }, { status: 400 });
    }

    const { error } = await serviceClient
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      const errorResponse = handleSupabaseError(error, 'delete template', { templateId });
      return Response.json(errorResponse, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Delete template error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
