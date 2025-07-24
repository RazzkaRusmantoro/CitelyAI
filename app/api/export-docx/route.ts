import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import PizZip from 'pizzip'
import xmldom from '@xmldom/xmldom'
import xpath from 'xpath'

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
    
    // Parse document XML with error handling
    let doc: Document
    try {
      const xmlContent = zip.files['word/document.xml'].asText()
      doc = new xmldom.DOMParser().parseFromString(xmlContent)
    } catch (e) {
      console.error('Error parsing DOCX XML:', e)
      throw new Error('Failed to parse document XML')
    }
    
    // Define namespaces for WordprocessingML
    const namespaces = {
      w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    }
    const select = xpath.useNamespaces(namespaces)
    
    // Extract all text nodes with full context
    const textNodes = select('//w:t', doc) as Element[]
    
    // Parse edited HTML to get text segments
    const editedTexts = extractTextSequenceFromHTML(html)

    console.log('Original text nodes:', textNodes.length)
    console.log('Edited text segments:', editedTexts.length)
    
    // Replace text content while preserving formatting and structure
    let editIndex = 0
    for (const node of textNodes) {
      if (editIndex >= editedTexts.length) break
      
      // Skip if node is in protected structure
      if (isProtectedStructure(node)) continue
      
      const originalText = node.textContent || ''
      const newText = editedTexts[editIndex] || ''
      
      // Preserve original whitespace structure
      const leadingWhitespace = originalText.match(/^\s*/)?.[0] || ''
      const trailingWhitespace = originalText.match(/\s*$/)?.[0] || ''
      
      // Only replace text content while preserving whitespace
      node.textContent = leadingWhitespace + newText.trim() + trailingWhitespace
      editIndex++
    }
    
    // Update document XML with error handling
    let updatedXml: string
    try {
      updatedXml = new xmldom.XMLSerializer().serializeToString(doc)
    } catch (e) {
      console.error('Error serializing XML:', e)
      throw new Error('Failed to update document XML')
    }
    
    zip.file('word/document.xml', updatedXml)
    
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

// Check if node is in protected structure (TOC, table, header, etc.)
function isProtectedStructure(node: Element): boolean {
  let parent: Node | null = node.parentNode
  while (parent) {
    const parentName = parent.nodeName.toLowerCase()
    
    // Protected elements
    if (parentName === 'w:tbl' ||       // Table
        parentName === 'w:sdt' ||       // Structured document tag (TOC)
        parentName === 'w:fldsimple' || // Field (TOC)
        parentName === 'w:hdr' ||       // Header
        parentName === 'w:ftr' ||       // Footer
        parentName === 'w:footnote' ||  // Footnote
        parentName === 'w:endnote' ||   // Endnote
        parentName === 'w:drawing') {   // Drawing (images)
      return true
    }
    
    // Check for TOC field
    if (parentName === 'w:fldchar' || parentName === 'w:instrtext') {
      const instrText = (parent as Element).textContent || ''
      if (instrText.includes('TOC') || instrText.includes('Table of Contents')) {
        return true
      }
    }
    
    parent = parent.parentNode
  }
  return false
}

// Robust HTML text extraction preserving structure markers
function extractTextSequenceFromHTML(html: string): string[] {
  // Create a new DOM parser with error handling
  const parser = new xmldom.DOMParser()
  let doc: Document
  
  try {
    // Wrap in div to ensure single root element
    doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  } catch (e) {
    console.error('Error parsing HTML:', e)
    return []
  }

  const texts: string[] = []
  const skipTags = new Set(['table', 'thead', 'tbody', 'tr', 'td', 'th', 'img', 'svg'])
  
  function traverse(node: Node) {
    if (node.nodeType === 3) { // Text node
      const text = node.nodeValue || ''
      if (text.trim()) {
        texts.push(text.trim())
      }
    } else if (node.nodeType === 1) { // Element node
      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      
      // Skip protected structures
      if (skipTags.has(tagName)) return
      
      // Handle special elements
      if (tagName === 'br') {
        texts.push('\n')
      } else if (tagName === 'li') {
        texts.push('• ') // Preserve bullet indicator
      }
      
      // Process children
      for (let child = element.firstChild; child; child = child.nextSibling) {
        traverse(child)
      }
      
      // Add newline after block elements
      if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tagName)) {
        texts.push('\n')
      }
    }
  }
  
  // Start traversal from body or first div
  const body = doc.getElementsByTagName('body')[0] || 
               doc.getElementsByTagName('div')[0] || 
               doc.documentElement
  
  if (body) {
    traverse(body)
  } else {
    console.error('No root element found in HTML')
  }
  
  return texts.filter(text => text.trim().length > 0)
}