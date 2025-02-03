import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch("https://jlp.yahooapis.jp/FuriganaService/V2/furigana", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `Yahoo AppID: ${process.env.YAHOO_API_KEY}`
      },
      body: JSON.stringify({
        id: "1234-1",
        jsonrpc: "2.0",
        method: "jlp.furiganaservice.furigana",
        params: body.params
      })
    });

    if (!response.ok) {
      throw new Error(`Yahoo API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process furigana' },
      { status: 500 }
    );
  }
}
