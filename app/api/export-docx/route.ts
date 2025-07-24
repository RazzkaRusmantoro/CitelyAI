import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import PizZip from 'pizzip'
import xmldom from '@xmldom/xmldom'
import xpath from 'xpath'
import { DOMParser } from '@xmldom/xmldom'

export async function POST(request: Request) {
  try {
    const { html, fileId } = await request.json()
    const supabase = createClient()

    // Fetch original DOCX file
    const { data: fileData, error: fetchError } = await supabase
      .from('files')
      .select('filename, content')
      .eq('id', fileId)
      .single()

    if (fetchError || !fileData) throw new Error('Original file not found')

    const { data: originalFile } = await supabase.storage
      .from('user-uploads')
      .download(fileData.filename)

    if (!originalFile) throw new Error('Failed to download original file')

    // Process DOCX file
    const arrayBuffer = await originalFile.arrayBuffer()
    const zip = new PizZip(arrayBuffer)
    
    // Parse document XML with namespace handling
    const xmlContent = zip.files['word/document.xml'].asText()
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlContent)
    
    // Define namespaces for WordprocessingML
    const namespaces = {
      w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    }
    const select = xpath.useNamespaces(namespaces)
    
    // Extract all text nodes with full context
    const textNodes = select('//w:t', doc) as Element[]
    
    // Parse edited HTML to get text segments
    const editedTexts = extractTextSequenceFromHTML(html)

    console.log('Original text nodes count:', textNodes.length)
    console.log('Edited text segments count:', editedTexts.length)
    
    // Replace text content while preserving formatting
    let editIndex = 0
    for (const node of textNodes) {
      if (editIndex >= editedTexts.length) break
      
      const originalText = node.textContent || ''
      const newText = editedTexts[editIndex] || ''
      
      // Only replace if we have new text
      if (newText.trim().length > 0) {
        // Preserve whitespace structure
        const leadingWhitespace = originalText.match(/^\s*/)?.[0] || ''
        const trailingWhitespace = originalText.match(/\s*$/)?.[0] || ''
        
        node.textContent = leadingWhitespace + newText.trim() + trailingWhitespace
      }
      
      editIndex++
    }
    
    // Update document XML
    zip.file('word/document.xml', new xmldom.XMLSerializer().serializeToString(doc))
    
    // Generate output file
    const outputBuffer = zip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="edited_${fileData.filename}"`
      }
    })

  } catch (error) {
    console.error('DOCX export error:', error)
    return NextResponse.json(
      { error: 'Failed to export DOCX: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

// Improved HTML text extraction that preserves structure
function extractTextSequenceFromHTML(html: string): string[] {
  // Create a new DOM parser
  const parser = new DOMParser()
  
  // Parse the HTML with proper error handling
  let doc: Document
  try {
    doc = parser.parseFromString(html, 'text/html')
  } catch (e) {
    console.error('Error parsing HTML:', e)
    return []
  }

  const texts: string[] = []
  
  function traverse(node: Node) {
    if (node.nodeType === 3) { // Text node
      const text = node.nodeValue?.trim() || ''
      if (text) {
        texts.push(text)
      }
    } else if (node.nodeType === 1) { // Element node
      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      
      // Handle different element types
      switch (tagName) {
        case 'br':
        case 'p':
        case 'div':
          texts.push('\n')
          break
        case 'li':
          texts.push('• ') // Add bullet point
          break
      }
      
      // Process children
      for (let child = element.firstChild; child; child = child.nextSibling) {
        traverse(child)
      }
      
      // Add newline after block elements
      if (['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        texts.push('\n')
      }
    }
  }
  
  // Start traversal from body or document element
  const body = doc.body || doc.documentElement
  if (body) {
    traverse(body)
  } else {
    console.error('No body element found in HTML')
  }
  
  return texts.filter(text => text.trim().length > 0)
}