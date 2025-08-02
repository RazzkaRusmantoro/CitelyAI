// app/api/update-citation/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { metadata, style, url } = await request.json();

    if (!metadata || !style || !url) {
      return NextResponse.json(
        { error: "Missing 'metadata', 'style', or 'url' in request body" },
        { status: 400 }
      );
    }

    // Call your Python backend API
    const pythonResponse = await fetch("http://localhost:5000/update-citation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata, style, url }),
    });

    if (!pythonResponse.ok) {
      const errorBody = await pythonResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorBody.error || "Python backend error" },
        { status: pythonResponse.status }
      );
    }

    const pythonData = await pythonResponse.json();

    if (!pythonData.citation) {
      return NextResponse.json(
        { error: "No citation returned from Python backend" },
        { status: 500 }
      );
    }

    return NextResponse.json({ citation: pythonData.citation });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
