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
    return JSON.stringify({ result: { word: [] } });
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

    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error processing furigana:', error);
    return JSON.stringify({ result: { word: [] } });
  }
}
