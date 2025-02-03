export interface FuriganaResponse {
  result: {
    word: Array<{
      surface: string;
      furigana?: string;
    }>;
  };
}

export async function getFurigana(text: string): Promise<string> {
  if (!text || text.trim() === '') {
    return text;
  }

  const url = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana";
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': `Yahoo AppID: ${process.env.NEXT_PUBLIC_YAHOO_API_KEY}`
    },
    body: JSON.stringify({
      id: "1234-1",
      jsonrpc: "2.0",
      method: "jlp.furiganaservice.furigana",
      params: { q: text, grade: 1 }
    })
  });
  
  try {
    const data: FuriganaResponse = await response.json();
    return data.result.word.map(w => 
      w.furigana ? `<ruby>${w.surface}<rt>${w.furigana}</rt></ruby>` : w.surface
    ).join('');
  } catch (error) {
    console.error('Error processing furigana:', error);
    return text;
  }
}
