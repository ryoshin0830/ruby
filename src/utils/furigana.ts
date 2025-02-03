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

  try {
    const response = await fetch('/api/furigana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params: { q: text, grade: 1 }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch furigana');
    }

    const data: FuriganaResponse = await response.json();
    return data.result.word.map(w => 
      w.furigana ? `<ruby>${w.surface}<rt>${w.furigana}</rt></ruby>` : w.surface
    ).join('');
  } catch (error) {
    console.error('Error processing furigana:', error);
    return text;
  }
}
