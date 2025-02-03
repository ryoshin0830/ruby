'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFurigana, FuriganaResponse } from '../utils/furigana';

interface CharacterData {
  surface: string;
  furigana?: string;
}

interface WordData {
  surface: string;
  furigana?: string;
}

export default function FuriganaInput() {
  const [text, setText] = useState('');
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const updateFurigana = useCallback(async (value: string) => {
    if (!value.trim()) {
      setCharacters([]);
      return;
    }
    try {
      const result = await getFurigana(value);
      const data = JSON.parse(result) as FuriganaResponse;
      setCharacters(data.result.word.flatMap((w: WordData) => 
        w.surface.split('').map((char: string) => ({
          surface: char,
          furigana: w.furigana
        }))
      ));
    } catch (error) {
      console.error('Error processing furigana:', error);
    }
  }, []);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent || '';
    setText(value);
    updateFurigana(value);
  }, [updateFurigana]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <div className="furigana-input">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div
          ref={editorRef}
          contentEditable="true"
          onInput={handleInput}
          onPaste={handlePaste}
          className="editor min-h-[120px] text-xl"
          data-placeholder="漢字を入力してください"
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6">
          <AnimatePresence>
            {characters.map((char, index) => (
              <motion.ruby
                key={`${index}-${char.surface}`}
                className="inline-block mx-[0.5px] relative"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                {char.surface}
                {char.furigana && (
                  <rt className="text-xs text-blue-500/75 font-normal absolute -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {char.furigana}
                  </rt>
                )}
              </motion.ruby>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
