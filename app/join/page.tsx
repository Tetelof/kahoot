'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGame() {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }
    
    // Store player name in sessionStorage for the play page
    sessionStorage.setItem('playerName', name.trim());
    router.push(`/play/${pin}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Join Game
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full text-lg py-4 px-6 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Game PIN
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full text-3xl font-mono text-center py-4 px-6 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              maxLength={6}
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          <button
            onClick={handleJoin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-4 px-8 rounded-xl transition-colors"
          >
            Join
          </button>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-6 w-full text-gray-500 hover:text-gray-700 text-center"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
