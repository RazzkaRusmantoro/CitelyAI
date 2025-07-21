import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Verify content type
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

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}