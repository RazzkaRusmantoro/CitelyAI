import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import PizZip from 'pizzip'
import xmldom from '@xmldom/xmldom'
import xpath from 'xpath'
import { JSDOM } from 'jsdom'

class StructurePreservingEditor {
  private doc: Document
  private select: xpath.XPathSelect

  constructor(docXml: string) {
    this.doc = new xmldom.DOMParser().parseFromString(docXml, 'text/xml')
    this.select = xpath.useNamespaces({
      w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    })
  }

  applyEdits(html: string) {
    const dom = new JSDOM(html)
    const htmlDoc = dom.window.document
    const htmlParagraphs = Array.from(htmlDoc.querySelectorAll('p, h1, h2, h3, li'))
    
    // Get all paragraphs in document order
    const docParagraphs = this.select('//w:p', this.doc) as Element[]
    
    for (let i = 0; i < Math.min(htmlParagraphs.length, docParagraphs.length); i++) {
      const htmlParagraph = htmlParagraphs[i]
      const docParagraph = docParagraphs[i]
      
      // Get all text runs in this paragraph
      const runs = this.select('./w:r', docParagraph) as Element[]
      const htmlText = htmlParagraph.textContent || ''
      
      // Preserve the exact run structure while updating text
      this.preserveRunStructure(runs, htmlText)
    }
  }

  private preserveRunStructure(runs: Element[], newText: string) {
    if (runs.length === 0) return; // No runs to process
    
    let currentPosition = 0
    let runIndex = 0
    
    // 1. First pass: distribute text to existing runs
    while (runIndex < runs.length && currentPosition < newText.length) {
      const run = runs[runIndex]
      
      // Find the first w:t element using DOM methods
      const textElements = run.getElementsByTagNameNS(
        'http://schemas.openxmlformats.org/wordprocessingml/2006/main', 
        't'
      );
      
      if (textElements.length > 0) {
        const textNode = textElements[0];
        const originalText = textNode.textContent || ''
        const lengthToTake = Math.min(originalText.length, newText.length - currentPosition)
        
        textNode.textContent = newText.substring(currentPosition, currentPosition + lengthToTake)
        currentPosition += lengthToTake
      }
      
      runIndex++
    }
    
    // 2. Handle remaining text
    if (currentPosition < newText.length) {
      // Add remaining text to last run
      const lastRun = runs[runs.length - 1]
      const textElements = lastRun.getElementsByTagNameNS(
        'http://schemas.openxmlformats.org/wordprocessingml/2006/main', 
        't'
      );
      
      if (textElements.length > 0) {
        const lastTextNode = textElements[0]
        lastTextNode.textContent += newText.substring(currentPosition)
      } else {
        // Create a new text node if none exists
        const textNode = this.doc.createElementNS(
          'http://schemas.openxmlformats.org/wordprocessingml/2006/main', 
          'w:t'
        )
        textNode.textContent = newText.substring(currentPosition)
        lastRun.appendChild(textNode)
      }
    }
    
    // 3. Handle case where we have more runs than needed
    while (runIndex < runs.length) {
      const run = runs[runIndex]
      const textElements = run.getElementsByTagNameNS(
        'http://schemas.openxmlformats.org/wordprocessingml/2006/main', 
        't'
      );
      
      if (textElements.length > 0) {
        textElements[0].textContent = '' // Clear but preserve the run
      }
      runIndex++
    }
  }

  serialize(): string {
    return new xmldom.XMLSerializer().serializeToString(this.doc)
  }
}

export async function POST(request: Request) {
  try {
    const { html, fileName, fileId } = await request.json()
    const supabase = createClient()

    // 1. Get the original file
    const { data: fileData, error: fetchError } = await supabase
      .from('files')
      .select('filename, processed_file_path')
      .eq('id', fileId)
      .single()

    if (fetchError || !fileData) {
      throw new Error('Original file not found')
    }

    const filePath = fileData.processed_file_path || fileData.filename
    const { data: originalFile } = await supabase.storage
      .from('user-uploads')
      .download(filePath)

    if (!originalFile) {
      throw new Error('Failed to download original file')
    }

    // 2. Process document with structure preservation
    const arrayBuffer = await originalFile.arrayBuffer()
    const zip = new PizZip(arrayBuffer)
    const docXml = zip.files['word/document.xml']?.asText()
    
    if (!docXml) {
      throw new Error('Failed to extract document.xml from DOCX')
    }
    
    const editor = new StructurePreservingEditor(docXml)
    editor.applyEdits(html)
    
    // 3. Save with all original components
    zip.file('word/document.xml', editor.serialize())
    const outputBuffer = zip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName || 'edited'}.docx"`,
      },
    })

  } catch (error) {
    console.error('Structure-preserving DOCX export error:', error)
    return NextResponse.json(
      { error: 'Failed to process document while preserving structure' },
      { status: 500 }
    )
  }
}