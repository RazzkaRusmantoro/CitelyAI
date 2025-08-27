// app/api/cite-pro/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUser } from '@/app/auth/getUser'

export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Get file content from Supabase
    const { fileId } = await request.json()
    const { data: fileData, error: fileError } = await supabase
      .from('files_pro')
      .select('content, id')
      .eq('id', fileId)
      .single()

    if (fileError || !fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // 2. Parse the plain text content into paragraphs and sentences
    const textContent = fileData.content
    
    // Split into paragraphs (double newlines)
    const paragraphs = textContent.split(/\n\s*\n/).filter((p: any) => p.trim().length > 0)
    const sentences: Array<{
      text: string
      paragraph_index: number
    }> = []

    paragraphs.forEach((paragraph: string, paraIndex: number) => {
      // Clean up paragraph text
      const cleanParagraph = paragraph.replace(/\s+/g, ' ').trim()
      
      // Split into sentences
      const sentenceMatches = cleanParagraph.match(/[^.!?]*[.!?]/g) || []
      
      sentenceMatches.forEach(sentence => {
        const trimmed = sentence.trim()
        if (trimmed.length > 8) { // Only include sentences longer than 8 characters
          sentences.push({
            text: trimmed,
            paragraph_index: paraIndex
          })
        }
      })
    })

    console.log(`Found ${sentences.length} sentences in ${paragraphs.length} paragraphs`)
    
    if (sentences.length === 0) {
      console.log("No sentences found to cite. Full content:", textContent)
      return NextResponse.json({ 
        success: true,
        message: 'No sentences found to cite',
        fileId
      })
    }

    // 3. Call Flask API for citations
    const flaskResponse = await fetch('http://localhost:5000/api/cite-openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentences })
    })

    if (!flaskResponse.ok) {
      throw new Error('Citation API failed')
    }

    const { results: citations } = await flaskResponse.json()
    const citedSentences = citations.map((c: any) => ({
      original: c.original_sentence,
      text: c.cited_sentence,
      paper_id: c.paper_id
    })).filter((c: any) => c.text)
    const citationTexts = citations.map((c: any) => c.citation).filter(Boolean)

    // 4. Apply citations to the original content
    let modifiedContent = textContent
    const replacements: Array<{
      original: string
      cited: string
    }> = []

    // Process citations by paragraph
    paragraphs.forEach((originalPara: string, paraIndex: number) => {
      const paraCitations = citations.filter((c: any) => c.paragraph_index === paraIndex)
      if (paraCitations.length === 0) return

      let modifiedPara = originalPara

      // Apply all citations to this paragraph
      for (const citation of paraCitations) {
        const { original_sentence, cited_sentence } = citation
        
        // Find the sentence in the paragraph text
        const index = modifiedPara.indexOf(original_sentence)
        if (index === -1) {
          console.log(`Could not find: "${original_sentence}" in paragraph ${paraIndex}`)
          continue
        }

        // Replace the original with cited version
        modifiedPara = 
          modifiedPara.substring(0, index) + 
          cited_sentence + 
          modifiedPara.substring(index + original_sentence.length)
        
        replacements.push({
          original: original_sentence,
          cited: cited_sentence
        })
      }

      // Replace in the full content
      modifiedContent = modifiedContent.replace(originalPara, modifiedPara)
    })

    // 5. Save the cited content back to Supabase
    const { error: updateError } = await supabase
      .from('files_pro')
      .update({ 
        content: modifiedContent,
        completion: 'complete',
        citations: citationTexts,
        cited_sentences: citedSentences,
        references: citations.map((c: any) => ({
          cited_sentence: c.cited_sentence,
          paper_id: c.paper_id,
          paper_title: c.paper_title
        }))
      })
      .eq('id', fileId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true,
      fileId,
      replacementsCount: replacements.length,
      citedSentences,
      citationTexts
    })

  } catch (error) {
    console.error('Citation processing error:', error)
    return NextResponse.json(
      { 
        error: 'Citation processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}