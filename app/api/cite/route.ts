import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUser } from '@/app/auth/getUser';

export async function POST(request: Request) {
    const supabase = await createClient();
    const user = await getUser();
    const userId = user?.id;

    if (!user) {
        return NextResponse.json(
            { error: 'User must be logged in' },
            { status: 400 }
        );
    }

    const { fileUrl, fileId, fullText } = await request.json()

    const { data: fileData, error: fileError } = await supabase
          .from('files')
          .select('file_url, file_path')
          .eq('id', fileId)
          .single();
    
    

}