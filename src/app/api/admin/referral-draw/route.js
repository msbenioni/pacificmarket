import { createClient } from '@supabase/supabase-js';
import { selectMonthlyWinner } from '@/utils/referrals';

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

    // Select monthly winner
    const winner = await selectMonthlyWinner();

    if (!winner) {
      return Response.json({ 
        error: 'No participants found for this month\'s draw' 
      }, { status: 404 });
    }

    // In a real implementation, you would:
    // 1. Save the draw result to a draws_history table
    // 2. Send notification email to winner
    // 3. Maybe notify all participants about the draw result

    return Response.json({
      success: true,
      winner: winner,
      drawDate: new Date().toISOString(),
      message: 'Monthly winner selected successfully'
    });

  } catch (error) {
    console.error('Referral draw error:', error);
    return Response.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

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

    // Get current month's stats
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const { data: referrals } = await supabase
      .from('referrals')
      .select('referrer_business_id, created_at')
      .eq('status', 'approved')
      .gte('created_at', `${currentMonth}-01`)
      .lt('created_at', `${currentMonth}-31`);

    // Count unique participants and total referrals
    const participantCount = new Set(referrals?.map(r => r.referrer_business_id)).size;
    const totalReferrals = referrals?.length || 0;

    // Get recent draw history (mock data for now)
    const drawHistory = [
      {
        id: 1,
        date: "2026-02-01T00:00:00Z",
        winner_name: "Island Pepe",
        referral_count: 3,
        total_entries: 3
      },
      {
        id: 2,
        date: "2026-01-01T00:00:00Z",
        winner_name: "Tangata Whenua Carving",
        referral_count: 1,
        total_entries: 1
      }
    ];

    return Response.json({
      stats: {
        totalParticipants: participantCount,
        totalReferrals: totalReferrals,
        thisMonthEntries: totalReferrals
      },
      drawHistory: drawHistory
    });

  } catch (error) {
    console.error('Referral draw stats error:', error);
    return Response.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
