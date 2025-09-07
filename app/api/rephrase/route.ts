import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { citedSentence } = await request.json();

    // Call the Flask backend
    const flaskResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rephrase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ citedSentence }),
    });

    if (!flaskResponse.ok) {
      throw new Error('Flask backend returned error');
    }

    const result = await flaskResponse.json();

    return NextResponse.json({
      success: true,
      rephrases: result.rephrases
    });

  } catch (error) {
    console.error('Error in rephrase API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}