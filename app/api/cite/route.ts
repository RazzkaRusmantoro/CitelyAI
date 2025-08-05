// app/api/process-docx/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUser } from '@/app/auth/getUser';
import PizZip from 'pizzip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import fs from 'fs/promises';
import path from 'path';

interface SentenceData {
  text: string;
  paragraphIndex?: number;
  paragraphNode: Element;
  startNode: Element;
  endNode: Element;
  startPos: number;
  endPos: number;
  fullText: string;
}

// Helper function to properly serialize XML
function serializeXml(xmlDoc: Document): string {
    const serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);
    
    // Fix XML declaration and namespaces
    xmlString = xmlString.replace(/<\?xml.*?\?>/, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    xmlString = xmlString.replace(/<w:document[^>]*>/, 
        `<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" 
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
        xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
        xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" 
        xmlns:v="urn:schemas-microsoft-com:vml" 
        xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" 
        xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" 
        xmlns:w10="urn:schemas-microsoft-com:office:word" 
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" 
        xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" 
        xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" 
        xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" 
        xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" 
        xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" 
        mc:Ignorable="w14 w15 wp14">`);
    
    return xmlString;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Get file metadata from Supabase
        const { fileId } = await request.json();
        const { data: fileData, error: fileError } = await supabase
            .from('files')
            .select('file_path_docx, id, filename, file_path_pdf')
            .eq('id', fileId)
            .single();

        if (fileError || !fileData) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // 2. Download and parse DOCX
        const { data: { publicUrl } } = await supabase
            .storage
            .from('user-uploads')
            .getPublicUrl(fileData.file_path_docx);

        const response = await fetch(publicUrl);
        if (!response.ok) throw new Error('Failed to download file');
        
        const arrayBuffer = await response.arrayBuffer();
        const zip = new PizZip(arrayBuffer);
        
        // Load document XML with proper namespace handling
        const xmlString = zip.files['word/document.xml'].asText();
        const xmlDoc = new DOMParser().parseFromString(
            xmlString, 
            'application/xml'
        );

        // Debug: Save original XML
        await fs.writeFile(
            path.join(process.cwd(), 'temp', 'original_document.xml'), 
            xmlString
        );

        // 3. Enhanced sentence extraction with precise node tracking
        const paragraphs = xmlDoc.getElementsByTagName('w:p');
        const sentences: SentenceData[] = [];
        
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            const textNodes = Array.from(paragraph.getElementsByTagName('w:t'));
            let currentText = '';
            let currentNodes: Element[] = [];
            
            // Build full paragraph text while tracking nodes
            for (const node of textNodes) {
                const nodeText = node.textContent || '';
                currentText += nodeText;
                currentNodes.push(node);
            }

            // Split into sentences with position tracking
            const sentenceMatches = currentText.match(/[^.!?]*[.!?]/g) || [];
            let charPos = 0;
            
            for (const sentenceText of sentenceMatches.filter(s => s.trim())) {
                const sentenceEnd = charPos + sentenceText.length;
                
                // Find start and end nodes
                let startNode: Element | null = null;
                let endNode: Element | null = null;
                let startNodePos = 0;
                let endNodePos = 0;
                let accumulatedLength = 0;
                
                for (const node of currentNodes) {
                    const nodeText = node.textContent || '';
                    const nodeLength = nodeText.length;
                    const nodeStart = accumulatedLength;
                    const nodeEnd = accumulatedLength + nodeLength;
                    
                    if (!startNode && nodeEnd > charPos) {
                        startNode = node;
                        startNodePos = charPos - nodeStart;
                    }
                    
                    if (!endNode && nodeEnd >= sentenceEnd) {
                        endNode = node;
                        endNodePos = sentenceEnd - nodeStart;
                        break;
                    }
                    
                    accumulatedLength += nodeLength;
                }
                
                if (startNode && endNode) {
                    sentences.push({
                        text: sentenceText.trim(),
                        paragraphIndex: i,
                        paragraphNode: paragraph,
                        startNode,
                        endNode,
                        startPos: startNodePos,
                        endPos: endNodePos,
                        fullText: currentText
                    });
                }
                
                charPos = sentenceEnd;
            }
        }

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
        const citedSentences = citations.map((c: any) => c.cited_sentence).filter(Boolean);
        const citationTexts = citations.map((c: any) => c.citation).filter(Boolean);

        const referencesData = citations.map((citation: any) => ({
            cited_sentence: citation.cited_sentence,
            paper_id: citation.paper_id,
            paper_title: citation.paper_title
        }));

        const { error: supabaseError } = await supabase
            .from('files')
            .update({ 
                references: referencesData 
            })
            .eq('id', fileId);

        if (supabaseError) {
            console.error('Error saving references to Supabase:', supabaseError);
        }

                
        // 5. Add citations by reconstructing paragraphs
        let modificationsMade = 0;
        const failedMatches: string[] = [];

        // Group citations by paragraph
        const citationsByParagraph: Record<number, any[]> = {};
        for (const citation of citations) {
            const paraIndex = citation.paragraph_index;
            if (paraIndex === undefined) continue;
            
            if (!citationsByParagraph[paraIndex]) {
                citationsByParagraph[paraIndex] = [];
            }
            citationsByParagraph[paraIndex].push(citation);
        }

        // Process each paragraph that has citations
        for (const [paraIndexStr, paraCitations] of Object.entries(citationsByParagraph)) {
            const paraIndex = parseInt(paraIndexStr);
            const paragraph = paragraphs[paraIndex];
            
            // Get all text nodes in the paragraph
            const textNodes = Array.from(paragraph.getElementsByTagName('w:t'));
            if (textNodes.length === 0) continue;
            
            // Reconstruct the original paragraph text
            let fullParagraphText = '';
            const nodeMap: {node: Element, start: number, end: number}[] = [];
            let currentPos = 0;
            
            for (const node of textNodes) {
                const nodeText = node.textContent || '';
                const nodeLength = nodeText.length;
                nodeMap.push({
                    node,
                    start: currentPos,
                    end: currentPos + nodeLength
                });
                fullParagraphText += nodeText;
                currentPos += nodeLength;
            }
            
            // Apply all citations to the paragraph text
            let modifiedParagraphText = fullParagraphText;
            const replacements = [];
            
            for (const citation of paraCitations) {
                const { original_sentence, cited_sentence } = citation;
                
                // Find the best matching position in the paragraph
                const index = modifiedParagraphText.indexOf(original_sentence);
                if (index === -1) {
                    console.warn(`Could not find: "${original_sentence}" in paragraph ${paraIndex}`);
                    failedMatches.push(original_sentence);
                    continue;
                }
                
                // Replace the original sentence with the cited version
                modifiedParagraphText = 
                    modifiedParagraphText.substring(0, index) + 
                    cited_sentence + 
                    modifiedParagraphText.substring(index + original_sentence.length);
                
                replacements.push({
                    original: original_sentence,
                    cited: cited_sentence,
                    position: index
                });
                
                modificationsMade++;
            }
            
            // Only update if we made changes
            if (replacements.length > 0) {
                // Clear all text nodes
                for (const { node } of nodeMap) {
                    node.textContent = '';
                }
                
                // Rebuild paragraph content
                const firstNode = nodeMap[0].node;
                firstNode.textContent = modifiedParagraphText;
                
                // Remove other text nodes to prevent duplication
                for (let i = 1; i < nodeMap.length; i++) {
                    const parent = nodeMap[i].node.parentNode;
                    if (parent) {
                        parent.removeChild(nodeMap[i].node);
                    }
                }
            }
        }

        console.log(`Added ${modificationsMade} citations to the document`);
        if (failedMatches.length > 0) {
            console.warn(`Failed to match ${failedMatches.length} sentences:`);
            failedMatches.forEach(m => console.warn(`- ${m}`));
        }

        // 6. Serialize and update the DOCX with proper XML declaration
        const updatedXml = serializeXml(xmlDoc);
        
        // Debug: Save modified XML
        await fs.writeFile(
            path.join(process.cwd(), 'temp', 'modified_document.xml'), 
            updatedXml
        );

        // Update the zip with proper file structure
        zip.file('word/document.xml', updatedXml);

        // Ensure all required files are present
        const requiredFiles = [
            '[Content_Types].xml',
            '_rels/.rels',
            'word/_rels/document.xml.rels'
        ];

        requiredFiles.forEach(file => {
            if (!zip.files[file]) {
                // Add minimal versions of required files if missing
                if (file === '[Content_Types].xml') {
                    zip.file(file, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
                } else if (file === '_rels/.rels') {
                    zip.file(file, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
                } else if (file === 'word/_rels/document.xml.rels') {
                    zip.file(file, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);
                }
            }
        });

        // 7. Generate the new file content
        const zipBlob = zip.generate({
            type: 'blob',
            compression: 'DEFLATE',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        // Convert to array buffer for Supabase
        const newFileBuffer = await new Response(zipBlob).arrayBuffer();
        const modifiedDocxFile = new Blob([newFileBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        
        // 8. Save to local file system for debugging
        const localFilePath = path.join(process.cwd(), 'temp', `${fileData.filename || 'modified'}_${Date.now()}.docx`);
        await fs.mkdir(path.dirname(localFilePath), { recursive: true });
        await fs.writeFile(localFilePath, Buffer.from(newFileBuffer));
        console.log(`Saved modified DOCX to: ${localFilePath}`);

        // 9. Upload with error recovery
        let uploadError = null;
        try {
            const { error } = await supabase.storage
                .from('user-uploads')
                .update(fileData.file_path_docx, newFileBuffer, {
                    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    upsert: true
                });
            uploadError = error;
        } catch (e) {
            uploadError = e;
        }

        if (uploadError) {
            console.log('Update failed, trying delete-then-upload...');
            await supabase.storage
                .from('user-uploads')
                .remove([fileData.file_path_docx]);
                
            await supabase.storage
                .from('user-uploads')
                .upload(fileData.file_path_docx, newFileBuffer, {
                    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    upsert: true
                });
        }

        

        // 10. Supbase Adjustments
        try {
            const pdfFileName = fileData.file_path_pdf.split('/').pop() || 
                            `${fileData.filename.replace('.docx', '') || 'document'}.pdf`;

            await supabase.storage
                .from('user-uploads')
                .remove([fileData.file_path_pdf]); // Note: changed to array

            console.log(`Removed old PDF!`);

            const convertApiUrl = 'https://v2.convertapi.com/convert/docx/to/pdf';
            const convertApiToken = process.env.CONVERTAPI_KEY;

            const convertFormData = new FormData();
            convertFormData.append('File', modifiedDocxFile, fileData.filename);
            convertFormData.append('StoreFile', 'true');

            const conversionResponse = await fetch(`${convertApiUrl}?Secret=${convertApiToken}`, {
                method: 'POST',
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
            const filePDF = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

            // Upload the new PDF (using upsert to handle potential conflicts)
            const { error: uploadError } = await supabase.storage
                .from('user-uploads')
                .upload(fileData.file_path_pdf, filePDF, {
                    contentType: 'application/pdf',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL for the new PDF
            const { data: { publicUrl } } = await supabase.storage
                .from('user-uploads')
                .getPublicUrl(fileData.file_path_pdf);

            // Update the file record in the database
            const { error: updateError } = await supabase
                .from('files')
                .update({ 
                    file_path_pdf: fileData.file_path_pdf,
                    file_url: publicUrl,
                })
                .eq('id', fileData.id);

            if (updateError) {
                throw updateError;
            }

            console.log('Successfully updated file record with new PDF information');

        } catch (error) {
            console.error('PDF Conversion Error:', error);
            // Consider adding error to the response or handling it appropriately
        }

        

        return NextResponse.json({ 
            success: true,
            fileId: fileData.id,
            filePath: fileData.file_path_docx,
            localFilePath: localFilePath,
            modificationsMade: modificationsMade,
            failedMatches: failedMatches,
            citedSentences: citedSentences,
            citationTexts: citationTexts,
            results: citations,
            message: 'Document processing complete'
        });

    } catch (error) {
        console.error('DOCX Processing Error:', error);
        return NextResponse.json(
            { 
                error: 'Processing failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}