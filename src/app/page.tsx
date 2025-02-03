import React from 'react';
import FuriganaInput from '../components/FuriganaInput';

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">ルビふり</h1>
      <FuriganaInput />
    </main>
  );
}
