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
        className="relative"
      >
        <div
          ref={editorRef}
          contentEditable="true"
          onInput={handleInput}
          onPaste={handlePaste}
          className="editor"
          data-placeholder="漢字を入力してください"
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-4">
          <AnimatePresence>
            {characters.map((char, index) => (
              <motion.span
                key={`${index}-${char.surface}`}
                className="ruby-wrapper inline-block mx-[1px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {char.surface}
                {char.furigana && (
                  <span className="ruby-text text-xs text-blue-500/75">{char.furigana}</span>
                )}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
