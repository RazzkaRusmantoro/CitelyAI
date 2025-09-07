// route.ts (updated)
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, style } = await request.json();

    if (!url || !style) {
      return NextResponse.json(
        { error: "Missing url or style in request body" },
        { status: 400 }
      );
    }

    const pythonRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cite-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, style }),
    });

    if (!pythonRes.ok) {
      const errorData = await pythonRes.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch citation from backend" },
        { status: pythonRes.status }
      );
    }

    const data = await pythonRes.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}