import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient();
    
    try {
        const { userId, paperId } = await request.json();
        
        if (!userId || !paperId) {
            return NextResponse.json(
                { error: 'Both userId and paperId are required' },
                { status: 400 }
            );
        }

        // Get current bibliography
        const { data: bibliography } = await supabase
            .from('bibliography')
            .select('references')
            .eq('user_id', userId)
            .single();

        const isSaved = bibliography?.references?.some(
            (ref: any) => ref.id === paperId
        ) || false;

        return NextResponse.json(
            { isSaved },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}