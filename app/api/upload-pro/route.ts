import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/getUser';
import * as mammoth from 'mammoth';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const user = await getUser();
        const userId = user?.id;

        if (!user) {
            return NextResponse.json(
                { error: 'User must be logged in' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Check if file is a Word document
        const isWordDoc = file.type.includes('openxmlformats-officedocument.wordprocessingml') || 
                         file.type.includes('msword') ||
                         file.name.endsWith('.docx') || 
                         file.name.endsWith('.doc');

        if (!isWordDoc) {
            return NextResponse.json(
                { error: 'Only Word documents (.docx, .doc) are supported' },
                { status: 400 }
            );
        }

        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Extract text from Word document using mammoth
        let extractedText: string;
        try {
            // Convert ArrayBuffer to Buffer-like object that mammoth expects
            const buffer = Buffer.from(arrayBuffer);
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value;
        } catch (extractError) {
            console.error('Text extraction error:', extractError);
            return NextResponse.json(
                { error: 'Failed to extract text from document. Please ensure the file is a valid Word document.' },
                { status: 500 }
            );
        }

        // Insert into files_pro table
        const { data, error } = await supabase
            .from('files_pro')
            .insert({
                user_id: userId,
                content: extractedText,
                opened_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to save document to database' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            fileId: data.id,
            textLength: extractedText.length
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to process document' },
            { status: 500 }
        );
    }
}