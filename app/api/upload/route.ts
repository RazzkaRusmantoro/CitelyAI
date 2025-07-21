
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { getUser } from "@/app/auth/getUser";

export async function POST(request: Request) {
    const cookieStore = cookies()
    
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const validTypes = ['application/pdf', 
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']



}