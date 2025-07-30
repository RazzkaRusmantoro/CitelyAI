import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUser } from '@/app/auth/getUser';
import PizZip from 'pizzip';
import { DOMParser } from '@xmldom/xmldom';

export async function POST(request: Request) {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Get file from Supabase
        const { fileId } = await request.json();
        const { data: fileData } = await supabase
            .from('files')
            .select('file_path_docx')
            .eq('id', fileId)
            .single();

        if (!fileData) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // 2. Download and parse DOCX
        const { data: signedUrl } = await supabase
            .storage
            .from('user-uploads')
            .createSignedUrl(fileData.file_path_docx, 3600);

        if (!signedUrl) {
            return NextResponse.json({ error: 'Failed to access file' }, { status: 500 });
        }

        const response = await fetch(signedUrl.signedUrl);
        const zip = new PizZip(await response.arrayBuffer());
        const xmlDoc = new DOMParser().parseFromString(
            zip.files['word/document.xml'].asText(),
            'text/xml'
        );

        // 3. Extract sentences with positions
        const paragraphs = xmlDoc.getElementsByTagName('w:p');
        const sentences = Array.from(paragraphs).flatMap((paragraph, i) => {
            const text = Array.from(paragraph.getElementsByTagName('w:t'))
                .map(node => node.textContent)
                .join('');
            
            return text.split(/(?<=[.!?])\s+/)
                .filter(s => s.trim())
                .map(sentence => ({
                    text: sentence,
                    paragraphIndex: i,
                    node: paragraph // Keep reference for later editing
                }));
        });

        // 4. Call Flask API for citations
        const flaskResponse = await fetch('http://localhost:5000/api/cite-openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sentences: sentences.map(s => ({
                    text: s.text,
                    paragraph_index: s.paragraphIndex
                }))
            }),
        });

        if (!flaskResponse.ok) {
            throw new Error('Citation API failed');
        }

        const { results: citations } = await flaskResponse.json();
        
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('DOCX processing error:', error);
        return NextResponse.json(
            { error: 'Processing failed' },
            { status: 500 }
        );
    }
}