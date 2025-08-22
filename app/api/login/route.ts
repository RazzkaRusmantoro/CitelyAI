import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 415 }
    )
  }

  try {
    const formData = await request.json()
    const supabase = await createClient()
    
    console.log(formData.email)

    // First check if the email exists
    const { data: userData, error: userError } = await supabase
      .from('users_view')
      .select('email')
      .eq('email', formData.email)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 401 }
      )
    }

    // If email exists, attempt to sign in
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    // Check if there's an error related to email verification
    if (error) {
      // Check if the error is due to email not being verified
      if (error.message?.includes('Email not confirmed') || error.message?.includes('not verified')) {
        // Resend verification email automatically
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: formData.email,
        })

        if (resendError) {
          console.error('Error resending verification:', resendError)
          return NextResponse.json(
            { error: 'Email not verified. Failed to resend verification email.' },
            { status: 401 }
          )
        }

        return NextResponse.json(
          { 
            error: 'Email not verified',
            message: 'A new verification email has been sent to your email address.'
          },
          { status: 401 }
        )
      }

      console.log(error.message)
      
      return NextResponse.json(
        { error: 'Invalid login credentials' },
        { status: 401 }
      )
    }

    // If we reach here, login was successful and email is verified
    return NextResponse.json({ user })

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}