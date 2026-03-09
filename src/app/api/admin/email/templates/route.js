import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch templates
    const { data: templates, error } = await supabase
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, subject, html_content, variables } = await request.json();

    // Validate required fields
    if (!name || !subject || !html_content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract variables from HTML content if not provided
    let templateVariables = variables;
    if (!templateVariables) {
      const variableRegex = /\{\{(\w+)\}\}/g;
      const matches = html_content.match(variableRegex) || [];
      templateVariables = matches.map(match => match.replace(/[{}]/g, ''));
    }

    // Create template
    const { data: template, error } = await supabase
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { templateId, name, subject, html_content, variables } = await request.json();

    if (!templateId) {
      return Response.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Update template
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

    const { data: template, error } = await supabase
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { templateId } = await request.json();

    if (!templateId) {
      return Response.json({ error: 'Template ID required' }, { status: 400 });
    }

    const { error } = await supabase
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
