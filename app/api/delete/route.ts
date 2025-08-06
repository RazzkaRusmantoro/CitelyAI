import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  const supabase = await createClient();
  
  try {
    const { userId, referenceId } = await request.json();
    
    if (!userId || !referenceId) {
      return NextResponse.json(
        { error: 'Both userId and referenceId are required' },
        { status: 400 }
      );
    }

    // Get current bibliography
    const { data: bibliography } = await supabase
      .from('bibliography')
      .select('references')
      .eq('user_id', userId)
      .single();

    if (!bibliography?.references) {
      return NextResponse.json(
        { error: 'Bibliography not found' },
        { status: 404 }
      );
    }

    // Filter out the reference to delete
    const updatedReferences = bibliography.references.filter(
      (ref: any) => ref.id !== referenceId
    );

    const { error } = await supabase
      .from('bibliography')
      .update({ references: updatedReferences })
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}