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
    const { email } = await request.json()
    const supabase = await createClient()

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      console.error('Error resending verification:', error)
      return NextResponse.json(
        { error: 'Failed to resend verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}