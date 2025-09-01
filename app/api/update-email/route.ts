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
    const { email } = await request.json();

    if (!email || email.trim() === '') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Update user email in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      email: trimmedEmail
    });

    if (authError) {
      console.error('Email update error:', authError);
      return NextResponse.json({ 
        error: authError.message || 'Failed to update email' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email update initiated. Please check your new email for confirmation.' 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}