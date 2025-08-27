// app/api/apply-rephrase/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { originalSentence, rephrasedSentence, fileId } = await request.json();
    const supabase = await createClient();

    // Update the cited_sentences array in Supabase
    const { data: fileData, error: fetchError } = await supabase
      .from('files_pro')
      .select('cited_sentences, content')
      .eq('id', fileId)
      .single();

    if (fetchError) throw fetchError;

    // Update cited_sentences
    const updatedCitedSentences = fileData.cited_sentences.map((item: any) => 
      item.text === originalSentence ? { ...item, text: rephrasedSentence } : item
    );

    // Update content (replace the sentence in the full text)
    const updatedContent = fileData.content.replace(
      new RegExp(originalSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      rephrasedSentence
    );

    // Save both updates to Supabase
    const { error: updateError } = await supabase
      .from('files_pro')
      .update({ 
        cited_sentences: updatedCitedSentences,
        content: updatedContent
      })
      .eq('id', fileId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in apply-rephrase API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}