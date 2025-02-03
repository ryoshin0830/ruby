import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const allowedOrigins = [
    'https://ruby-rho.vercel.app',
    'https://ruby-77tq0n06w-fyuneru0830s-projects.vercel.app',
    'https://ruby-fyuneru0830s-projects.vercel.app',
    'http://localhost:3000'
  ];
  const origin = request.headers.get('origin');
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : null;

  if (!allowedOrigin) {
    return new NextResponse(null, { status: 403 });
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

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
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to process furigana' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      }
    );
  }
}
