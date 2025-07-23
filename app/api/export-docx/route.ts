import { NextResponse } from 'next/server'
import mammoth from 'mammoth'
import htmlToDocx from 'html-to-docx' // You'll need to install this

export async function POST(request: Request) {
  try {
    const { html, fileName } = await request.json()
    
    // Convert HTML to DOCX
    const fileBuffer = await htmlToDocx(html)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('DOCX export error:', error)
    return NextResponse.json(
      { error: 'Failed to export DOCX' },
      { status: 500 }
    )
  }
}