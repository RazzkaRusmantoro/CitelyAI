import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/getUser';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const supabase = await createClient();
    const { full_name } = await request.json();

    if (!full_name || full_name.trim() === '') {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }


    // Update auth user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: full_name.trim() }
    });

    if (authError) {
      console.error('Auth update error:', authError);
      // Don't fail the request if auth metadata update fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}