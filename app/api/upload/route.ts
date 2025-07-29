import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { NextRequest } from 'next/server';
import { getUser } from '@/app/auth/getUser';

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

        const fileExt = file.name.split('.').pop();
        const originalName = file.name;
        const baseName = originalName.replace(/\.[^/.]+$/, "");
        const fileName = `${baseName}_${userId}_${Date.now()}_citely.${fileExt}`;
        const fileType = file.type;
        
        // File Path for Word Docs
        const docxFileName = `${baseName}_${userId}_${Date.now()}_citely.docx`;
        const filePathDOCX = `files/${userId}/${baseName}/DOCX_${docxFileName}`;
        

        const pdfFileName = `${baseName}_${userId}_${Date.now()}_citely.pdf`;
        const filePathPDF = `files/${userId}/${baseName}/PDF_${pdfFileName}`;

        // PDF File
        let filePDF: File | null = null;
        let fileDOCX: File | null = null;

        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.type === 'application/msword') {

            try {
                // Word to PDF
                const convertApiUrl = 'https://v2.convertapi.com/convert/docx/to/pdf';
                const convertApiToken = process.env.CONVERTAPI_KEY;
                
                // Read the file as array buffer
                const fileBuffer = await file.arrayBuffer();
                
                // Create FormData for the conversion request
                const convertFormData = new FormData();
                convertFormData.append('File', new Blob([fileBuffer]), file.name);
                convertFormData.append('StoreFile', 'true');
                
                // Call ConvertAPI
                const conversionResponse = await fetch(convertApiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${convertApiToken}`,
                    },
                    body: convertFormData
                });
                
                if (!conversionResponse.ok) {
                    throw new Error(`Conversion failed: ${conversionResponse.statusText}`);
                }
                
                // Parse the API response
                const conversionResult = await conversionResponse.json();
                
                if (!conversionResult.Files || conversionResult.Files.length === 0) {
                    throw new Error('No files returned from conversion');
                }
                
                // Get the PDF URL from the response
                const pdfUrl = conversionResult.Files[0].Url;
                
                // Download the PDF file
                const pdfResponse = await fetch(pdfUrl);
                if (!pdfResponse.ok) {
                    throw new Error(`Failed to download PDF: ${pdfResponse.statusText}`);
                }
                
                // Convert the PDF to a File object
                const pdfBlob = await pdfResponse.blob();
                filePDF = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

                // Upload PDF File to Bucket
                const { data: dataPDF, error: errorPDF } = await supabase.storage
                    .from('user-uploads')
                    .upload(filePathPDF, filePDF);

                if (errorPDF) {
                    throw errorPDF;
                }

                // Upload Word File to Bucket
                const { data: dataDOCX, error: errorDOCX } = await supabase.storage
                    .from('user-uploads')
                    .upload(filePathDOCX, file);

                if (errorDOCX) {
                    throw errorDOCX;
                }

                const { data: urlData } = supabase.storage
                    .from('user-uploads')
                    .getPublicUrl(filePathPDF);

                const { data: fileRecord, error: insertError } = await supabase
                    .from('files')
                    .insert({
                        user_id: userId,
                        filename: fileName,
                        file_type: fileType,
                        file_url: urlData.publicUrl,
                        file_path_docx: filePathDOCX,
                        file_path_pdf: filePathPDF
                    })
                    .select()
                    .single();
                
                if (insertError) {
                    // Clean up uploaded files if DB insert fails
                    await supabase.storage
                        .from('user-uploads')
                        .remove([filePathDOCX, filePathPDF]);
                    throw insertError;
                }

                return NextResponse.json({
                    path: dataDOCX.path,
                    publicUrl: urlData.publicUrl,
                    fileRecord,
                    fileId: fileRecord.id,
                }); 

            } catch (error) {
                console.error('Error:', error);
                return NextResponse.json(
                    { error: 'Failed to upload and convert file' },
                    { status: 500 }
                );
            }
        } else if (file.type === 'application/pdf') {
            try {
                const convertApiUrl = 'https://v2.convertapi.com/convert/pdf/to/docx';
                const convertApiToken = process.env.CONVERTAPI_KEY;

                const fileBuffer = await file.arrayBuffer();

                const convertFormData = new FormData();
                convertFormData.append('File', new Blob([fileBuffer]), file.name);
                convertFormData.append('StoreFile', 'true');

                const conversionResponse = await fetch(convertApiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${convertApiToken}`,
                    },
                    body: convertFormData
                });

                if (!conversionResponse.ok) {
                    throw new Error(`Conversion failed: ${conversionResponse.statusText}`);
                }
                
                // Parse the API response
                const conversionResult = await conversionResponse.json();
                
                if (!conversionResult.Files || conversionResult.Files.length === 0) {
                    throw new Error('No files returned from conversion');
                }

                const docxUrl = conversionResult.Files[0].Url;
                
                // Download the PDF file
                const docxResponse = await fetch(docxUrl);
                if (!docxResponse.ok) {
                    throw new Error(`Failed to download DOCX: ${docxResponse.statusText}`);
                }
                
                // Convert the PDF to a File object
                const docxBlob = await docxResponse.blob();
                fileDOCX = new File([docxBlob], docxFileName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

                const { data: dataDOCX, error: errorDOCX } = await supabase.storage
                    .from('user-uploads')
                    .upload(filePathDOCX, fileDOCX);

                if (errorDOCX) {
                    throw errorDOCX;
                }

                const { data: dataPDF, error: errorPDF } = await supabase.storage
                    .from('user-uploads')
                    .upload(filePathPDF, file);

                if (errorPDF) {
                    throw errorPDF;
                }

                const { data: urlData } = supabase.storage
                    .from('user-uploads')
                    .getPublicUrl(filePathPDF);

                const { data: fileRecord, error: insertError } = await supabase
                    .from('files')
                    .insert({
                        user_id: userId,
                        filename: fileName,
                        file_type: fileType,
                        file_url: urlData.publicUrl,
                        file_path_docx: filePathDOCX,
                        file_path_pdf: filePathPDF
                    })
                    .select()
                    .single();
                
                if (insertError) {
                    // Clean up uploaded files if DB insert fails
                    await supabase.storage
                        .from('user-uploads')
                        .remove([filePathDOCX, filePathPDF]);
                    throw insertError;
                }

                return NextResponse.json({
                    path: dataDOCX.path,
                    publicUrl: urlData.publicUrl,
                    fileRecord,
                    fileId: fileRecord.id,
                }); 



            } catch (error) {
                console.error('Error:', error);
                return NextResponse.json(
                    { error: 'Failed to upload and convert file' },
                    { status: 500 }
                );

            }
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}