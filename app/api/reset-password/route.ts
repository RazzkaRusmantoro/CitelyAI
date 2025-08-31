// app/api/auth/reset-password/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log("Route called")
    const supabase = await createClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log("This is the email", email)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/update-password`,
    })

    if (error) {
      console.error('Supabase reset password error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Password reset instructions sent successfully' },
      { status: 200 }
    )

  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}