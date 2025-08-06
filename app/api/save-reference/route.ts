import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUser } from '@/app/auth/getUser';

export async function POST(request: Request) {
    const supabase = await createClient();
    const user = await getUser();
    const userId = user?.id;

    if (!user) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.paperId || !data.title) {
        return NextResponse.json(
            { error: 'Both paperId and title are required' },
            { status: 400 }
        );
    }

    try {
        // Check for existing bibliography
        const { data: existingEntry } = await supabase
            .from('bibliography')
            .select('references')
            .eq('user_id', userId)
            .single();

        const newReference = {
            id: data.paperId,
            title: data.title,
            authors: data.authors || [],
            abstract: data.abstract || '',
            year: data.year || null,
            url: data.url || ''
        };

        if (existingEntry?.references) {
            // Check for duplicate
            if (existingEntry.references.some((ref: any) => ref.id === data.paperId)) {
                return NextResponse.json(
                    { success: true, message: 'Reference already exists' },
                    { status: 200 }
                );
            }

            const { error } = await supabase
                .from('bibliography')
                .update({
                    references: [...existingEntry.references, newReference],
                })
                .eq('user_id', userId);

            if (error) throw error;

            return NextResponse.json(
                { success: true, message: 'Reference added' },
                { status: 200 }
            );
        } else {
            const { error } = await supabase
                .from('bibliography')
                .insert({
                    user_id: userId,
                    references: [newReference],
                });

            if (error) throw error;

            return NextResponse.json(
                { success: true, message: 'Bibliography created with reference' },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}