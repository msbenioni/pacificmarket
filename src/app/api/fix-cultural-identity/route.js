import { NextResponse } from 'next/server';
import { fixAllCulturalIdentity } from '@/utils/fixCulturalIdentityConsistency';

export async function POST(request) {
  try {
    // Add security check - only allow admins
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();
    
    // Get auth header to verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    // Run the fix
    const result = await fixAllCulturalIdentity();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cultural identity consistency fix completed',
      result 
    });
    
  } catch (error) {
    console.error('Error in cultural identity fix API:', error);
    return NextResponse.json({ 
      error: 'Failed to fix cultural identity consistency',
      details: error.message 
    }, { status: 500 });
  }
}
