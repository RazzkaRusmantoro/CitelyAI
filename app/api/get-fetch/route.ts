import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { fileId } = await request.json()
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'fileId is required' },
        { status: 400 }
      )
    }

    console.log(`API received fileId: ${fileId}`)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('files_pro')
      .select('content')
      .eq('id', fileId)
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, fileId, data },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Error in get-fetch API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}