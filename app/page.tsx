'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [joinPin, setJoinPin] = useState('');
  const router = useRouter();

  const handleCreate = () => {
    router.push('/game/host');
  };

  const handleJoin = () => {
    if (joinPin.length === 6) {
      router.push(`/play/${joinPin}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tight">
          KAHOOT!
        </h1>
        <p className="text-xl text-white/80">Create fun learning games in seconds</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Create Game */}
        <button
          onClick={handleCreate}
          className="group bg-white text-gray-900 text-2xl font-bold py-6 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a game
          </span>
        </button>

        {/* Join Game */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
          <p className="text-white text-lg font-semibold mb-4 text-center">
            Join a game
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={joinPin}
              onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Game PIN"
              className="flex-1 text-2xl font-mono text-center py-4 px-6 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              disabled={joinPin.length !== 6}
              className="bg-yellow-400 text-gray-900 text-xl font-bold py-4 px-8 rounded-xl hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-white/60 text-sm">
        <p>Enter a game PIN to join an existing game</p>
      </div>
    </div>
  );
}
