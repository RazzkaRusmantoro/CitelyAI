import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { NextRequest } from 'next/server';
import { getUser } from '@/app/auth/getUser';
import mammoth from 'mammoth';
import { TextDecoder } from 'util';
import xmldom from '@xmldom/xmldom'
import xpath from 'xpath'
import PizZip from 'pizzip'
import { array } from 'zod';


export async function POST(request: Request) {
    
    try {
        const supabase = createClient();
        const user = await getUser();
        const userId = user?.id;

        if (!user) {
            return NextResponse.json(
                { error: 'User must be logged in' },
                { status: 400 }
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

        // const arrayBuffer = await file.arrayBuffer();
        // const buffer = Buffer.from(arrayBuffer);

        // const zip = new PizZip(arrayBuffer);
        // const xmlContent = zip.files['word/document.xml'].asText();

        // const doc = new xmldom.DOMParser().parseFromString(xmlContent)

        // let htmlContent = '';
        // const base64Data = buffer.toString('base64');

        // try {
        //     if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        //         const result = await mammoth.extractRawText({ buffer: buffer });
        //         htmlContent = result.value;
        //     // } else if (file.type === 'application/pdf') {
        //     //     htmlContent = await pdfToText(buffer);
        //     } else {
        //         htmlContent = new TextDecoder().decode(arrayBuffer);
        //     }
        // } catch (error) {
        //     console.error('File processing error:', error);
        //     return NextResponse.json(
        //         { error: 'Failed to process file content' },
        //         { status: 500 }
        //     );
        // }
        
        console.log(file.name, file.type, file.size);

        const fileExt = file.name.split('.').pop();
        const originalName = file.name;
        const baseName = originalName.replace(/\.[^/.]+$/, "");
        const fileName = `${baseName}_${userId}_${Date.now()}_citely.${fileExt}`;
        const fileType = file.type;
        
        const filePath = `files/${userId}/${baseName}/DOCX_${fileName}`;

        // Uploading Original Files into Bucket
        const { data, error } = await supabase.storage
            .from('user-uploads')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        // Uploading Buffer into Bucket
        // const { error: processedUploadError } = await supabase.storage
        //     .from('user-uploads')
        //     .upload(`processed/${userId}/${fileName}`, buffer);


        // if (processedUploadError) {
        //     throw processedUploadError;
        // }

        const { data: urlData } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(filePath);

        const { data: fileRecord, error: insertError } = await supabase
            .from('files')
            .insert({
                user_id: userId,
                filename: fileName,
                file_type: fileType,
                content: '',
                file_url: urlData.publicUrl,
                file_path: filePath,
                // processed_file_path: `processed/${userId}/${fileName}`,
            })
            .select()
            .single();
        
        if (insertError) {
            await supabase.storage
                .from('user-uploads')
                // .remove([fileName, `processed/${userId}/${fileName}`]);
                
            throw insertError;
        }

        return NextResponse.json({
            path: data.path,
            publicUrl: urlData.publicUrl,
            fileRecord,
            fileId: fileRecord.id,
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
