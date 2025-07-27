import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;

    if (!query) {
        return NextResponse.json(
            { error: 'No search query provided' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=100&fields=title,authors,abstract,url,year,citationCount,fieldsOfStudy,publicationDate`,
            {
                headers: {
                    'x-api-key': apiKey || '',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Semantic Scholar API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error searching Semantic Scholar:', error);
        return NextResponse.json(
            { error: 'Failed to fetch search results' },
            { status: 500 }
        );
    }
}