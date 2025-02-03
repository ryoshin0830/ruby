'use client';

import { useState, useCallback } from 'react';
import { getFurigana } from '@/utils/furigana';

export default function FuriganaInput() {
  const [text, setText] = useState('');
  const [furigana, setFurigana] = useState('');
  
  const updateFurigana = useCallback(async (value: string) => {
    if (!value.trim()) {
      setFurigana('');
      return;
    }
    const result = await getFurigana(value);
    setFurigana(result);
  }, []);

  return (
    <div className="relative w-full max-w-2xl">
      <div 
        className="absolute w-full pointer-events-none text-gray-600 px-4 pt-2"
        dangerouslySetInnerHTML={{ __html: furigana }}
      />
      <textarea
        value={text}
        onChange={e => {
          setText(e.target.value);
          updateFurigana(e.target.value);
        }}
        className="w-full p-4 border rounded-lg resize-none bg-transparent"
        rows={4}
        placeholder="漢字を入力してください"
      />
    </div>
  );
}
