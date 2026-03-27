import { requireAdmin } from '@/lib/server-auth';

export async function GET(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const status = searchParams.get('status');

    // Build query (RLS policy grants admin access)
    let query = userClient
      .from('email_subscribers')
      .select(`
        *,
        email_subscriber_entities (
          entity_type,
          entity_name,
          relationship_type
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (source && source !== 'all') {
      query = query.eq('source', source);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: subscribers, error } = await query;

    if (error) {
      return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    // Transform data for frontend
    const transformedSubscribers = subscribers.map(subscriber => {
      // Get business names from entity relationships
      const businessEntities = subscriber.email_subscriber_entities?.filter(
        entity => entity.entity_type === 'business'
      ) || [];
      
      const businessNames = businessEntities.map(entity => entity.entity_name).filter(Boolean);
      
      return {
        id: subscriber.id,
        email: subscriber.email,
        first_name: subscriber.first_name,
        business_name: businessNames.length > 0 ? businessNames.join(', ') : 'N/A',
        business_count: businessEntities.length,
        entities: subscriber.email_subscriber_entities || [],
        source: subscriber.source,
        status: subscriber.status,
        created_at: subscriber.created_at
      };
    });

    return Response.json({ subscribers: transformedSubscribers });

  } catch (error) {
    console.error('Subscribers API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
    const { subscribers, source } = await request.json();

    if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
      return Response.json({ error: 'Subscribers array required' }, { status: 400 });
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = subscribers.filter(s => !emailRegex.test(s.email));
    
    if (invalidEmails.length > 0) {
      return Response.json({ 
        error: 'Invalid email addresses', 
        invalidEmails 
      }, { status: 400 });
    }

    // Insert subscribers
    const subscriberRecords = subscribers.map(subscriber => ({
      email: subscriber.email.toLowerCase(),
      first_name: subscriber.first_name || 'Business Owner',
      source: source || 'manual_import',
      status: 'subscribed'
    }));

    const { data, error } = await userClient
      .from('email_subscribers')
      .upsert(subscriberRecords, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      return Response.json({ error: 'Failed to add subscribers' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: `Successfully added ${data.length} subscribers`,
      subscribers: data 
    });

  } catch (error) {
    console.error('Add subscribers error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Authenticate admin and get service client
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
    const { subscriberId, status } = await request.json();

    if (!subscriberId || !status) {
      return Response.json({ error: 'Subscriber ID and status required' }, { status: 400 });
    }

    const validStatuses = ['subscribed', 'unsubscribed', 'bounced'];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await userClient
      .from('email_subscribers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', subscriberId)
      .select()
      .single();

    if (error) {
      return Response.json({ error: 'Failed to update subscriber' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Subscriber updated successfully',
      subscriber: data 
    });

  } catch (error) {
    console.error('Update subscriber error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
