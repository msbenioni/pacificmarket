import { requireAdmin } from '@/lib/server-auth';

export async function PUT(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
    const { subscriberId } = await request.json();

    if (!subscriberId) {
      return Response.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    // Get subscriber details before deletion
    const { data: subscriber, error: fetchError } = await userClient
      .from('email_subscribers')
      .select('email, first_name, status')
      .eq('id', subscriberId)
      .single();

    if (fetchError || !subscriber) {
      return Response.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Unsubscribe the subscriber while preserving the email record
    const { data: updatedSubscriber, error: updateError } = await userClient
      .from('email_subscribers')
      .update({ 
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriberId)
      .select()
      .single();

    if (updateError) {
      console.error('Error unsubscribing subscriber:', updateError);
      return Response.json({ error: 'Failed to unsubscribe subscriber' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Subscriber unsubscribed successfully',
      subscriber: {
        id: updatedSubscriber.id,
        email: updatedSubscriber.email,
        first_name: updatedSubscriber.first_name,
        status: updatedSubscriber.status,
        updated_at: updatedSubscriber.updated_at
      }
    });

  } catch (error) {
    console.error('Delete subscriber email error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
