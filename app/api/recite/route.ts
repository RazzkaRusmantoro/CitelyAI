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
    const { citedSentence, fileId } = await request.json()

    console.log(citedSentence, fileId)
    
    // Call the Flask backend
    const flaskResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        citedSentence
      })
    })

    if (!flaskResponse.ok) {
      throw new Error(`Flask API returned ${flaskResponse.status}`)
    }

    const { new_citation, new_paper_id, new_paper_title } = await flaskResponse.json()

    console.log("Fetched: ")
    console.log(new_citation, new_paper_id, new_paper_title)

    // Update the cited_sentences array in Supabase
    const { data: fileData, error: fetchError } = await supabase
      .from('files_pro')
      .select('cited_sentences')
      .eq('id', fileId)
      .single()

    if (fetchError) throw fetchError

    const updatedCitedSentences = fileData.cited_sentences.map((item: any) => {
        if (item.text === citedSentence) {
            console.log('✅ Match found! Updating item:', item);
            console.log('New citation:', new_citation);
            console.log('New paper ID:', new_paper_id);
            console.log('New paper title:', new_paper_title);
            
            // Replace the old citation with the new one in the text
            // Remove any existing citation (with optional period) and replace with new citation
            const updatedText = item.text.replace(/\s*\([^)]*\)\.?\s*$/, ` ${new_citation}.`);
            
            return {
            ...item,
            text: updatedText,
            citation: new_citation,
            paper_id: new_paper_id,
            paper_title: new_paper_title
            }
        }
        return item
    })

    console.log('📝 Updated cited_sentences array:', updatedCitedSentences);

    // Update the database
    const { error: updateError } = await supabase
      .from('files_pro')
      .update({ cited_sentences: updatedCitedSentences })
      .eq('id', fileId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      newCitation: new_citation,
      newPaperId: new_paper_id,
      newPaperTitle: new_paper_title
    })

  } catch (error) {
    console.error('Error in recite API:', error)
    return NextResponse.json(
      { error: 'Failed to process recite request' },
      { status: 500 }
    )
  }
}