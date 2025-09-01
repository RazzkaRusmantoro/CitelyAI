import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/getUser';


export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log("This is user Id", user.id)

    // Check the subscription in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('Subscriptions')
      .select('subscription')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching subscription:', profileError)
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
    }

    return NextResponse.json({ 
      subscription: profile.subscription || 'Free' 
    })

  } catch (error) {
    console.error('Error in check-subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}