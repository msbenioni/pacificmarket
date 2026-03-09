import { requireAdmin } from '@/lib/server-auth';

export async function GET(request) {
  try {
    // Authenticate admin and get user client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;

    // Fetch templates using user client (respects RLS)
    const { data: templates, error } = await userClient
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

    const { user, userClient } = auth;
    const { name, subject, html_content, variables } = await request.json();

    // Validate required fields
    if (!name || !subject || !html_content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract variables from HTML content if not provided
    let templateVariables = variables;
    if (!templateVariables) {
      const variableRegex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;  // Allows spaces inside braces
      const matches = html_content.match(variableRegex) || [];
      templateVariables = matches.map(match => match.replace(/[{}]/g, ''));
    }

    // Create template using user client (respects RLS)
    const { data: template, error } = await userClient
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
      return Response.json({ error: 'Failed to create template' }, { status: 500 });
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

    const { userClient } = auth;
    const { templateId, name, subject, html_content, variables } = await request.json();

    if (!templateId) {
      return Response.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Update template using user client (respects RLS)
    const updateData = {};
    if (name) updateData.name = name;
    if (subject) updateData.subject = subject;
    if (html_content) {
      updateData.html_content = html_content;
      // Extract variables from HTML content if not provided
      if (!variables) {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const matches = html_content.match(variableRegex) || [];
        updateData.variables = matches.map(match => match.replace(/[{}]/g, ''));
      }
    }
    if (variables) updateData.variables = variables;

    const { data: template, error } = await userClient
      .from('email_templates')
      .update(updateData)
      .eq('id', templateId)
      .select()
      .single();

    if (error) {
      return Response.json({ error: 'Failed to update template' }, { status: 500 });
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

    const { userClient } = auth;
    const { templateId } = await request.json();

    if (!templateId) {
      return Response.json({ error: 'Template ID required' }, { status: 400 });
    }

    const { error } = await userClient
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      return Response.json({ error: 'Failed to delete template' }, { status: 500 });
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
