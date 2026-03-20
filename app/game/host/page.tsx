'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/lib/useGameSocket';
import { QuestionCard } from '@/components/QuestionCard';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';

// Custom hook to sync sessionStorage
function useSessionStorage(key: string, initialValue: string | null = null) {
  const subscribe = (callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  };
  
  const getSnapshot = () => sessionStorage.getItem(key);
  
  const getServerSnapshot = () => initialValue;
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function HostGame() {
  const router = useRouter();
  const storedPin = useSessionStorage('hostGamePin');
  const [localPin, setLocalPin] = useState<string | null>(null);
  
  // Use either session storage or local state
  const gamePin = localPin || storedPin;
  
  const {
    gameState,
    startGame,
    nextQuestion,
    revealAnswer,
    endGame,
  } = useGameSocket({
    gamePin: gamePin || undefined,
    playerName: 'Host',
    isHost: true,
  });

  const handleCreate = () => {
    // Generate a new game PIN for hosting
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('hostGamePin', pin);
    setLocalPin(pin);
  };

  const handleBackToHome = () => {
    sessionStorage.removeItem('hostGamePin');
    setLocalPin(null);
    router.push('/');
  };

  // Game not created yet
  if (!gamePin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create a New Game</h1>
          <button
            onClick={handleCreate}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8 rounded-xl transition-colors"
          >
            Create Game
          </button>
          <button
            onClick={handleBackToHome}
            className="mt-4 text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Waiting for players
  if (gameState.gameStatus === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">Waiting for players...</h1>
          <p className="text-white/80">Share the game PIN with your players</p>
        </div>

        {/* Game PIN Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 text-center">
          <p className="text-gray-500 text-lg mb-2">Game PIN</p>
          <p className="text-6xl md:text-8xl font-black text-blue-600 tracking-widest">
            {gamePin}
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 mb-8">
          <p className="text-white text-xl">
            <span className="font-bold">{gameState.players.length}</span> player
            {gameState.players.length !== 1 ? 's' : ''} connected
          </p>
        </div>

        {/* Players List */}
        {gameState.players.length > 0 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-sm w-full">
            <h3 className="text-white font-bold mb-4">Connected Players:</h3>
            <ul className="space-y-2">
              {gameState.players.map((player) => (
                <li key={player.id} className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={startGame}
          disabled={gameState.players.length === 0}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-2xl font-bold py-6 px-16 rounded-2xl transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          Start Game 🎮
        </button>

        <button
          onClick={handleBackToHome}
          className="mt-6 text-white/80 hover:text-white"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // Game ended
  if (gameState.gameStatus === 'ended') {
    // Sort players by score to ensure winner is the top scorer
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex flex-col items-center justify-center p-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4">🎉 Game Over! 🎉</h1>
        </div>

        {/* Winner */}
        {winner && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 text-center max-w-md">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-500 text-lg mb-2">Winner</p>
            <p className="text-4xl font-black text-gray-900 mb-4">{winner.name}</p>
            <p className="text-3xl font-bold text-yellow-500">
              {winner.score.toLocaleString()} pts
            </p>
          </div>
        )}

        {/* Final Scores */}
        <div className="w-full max-w-md">
          <Scoreboard players={gameState.players} />
        </div>

        {/* Play Again */}
        <button
          onClick={handleBackToHome}
          className="mt-8 bg-white text-gray-900 text-xl font-bold py-4 px-12 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  // Game is active - show question
  if (!gameState.currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const currentQuestion = gameState.currentQuestion;
  const showAnswer = gameState.showResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="text-white text-xl font-bold">PIN: {gamePin}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="text-white">
            <span className="font-bold">{gameState.players.length}</span> players
          </p>
        </div>
      </div>

      {/* Timer */}
      {!showAnswer && (
        <div className="mb-8">
          <Timer
            timeLimit={currentQuestion.time_limit}
            onTimeUp={() => {}}
            isActive={true}
            questionKey={gameState.currentQuestionIndex}
          />
        </div>
      )}

      {/* Question */}
      <QuestionCard
        question={{
          text: currentQuestion.text,
          answers: currentQuestion.answers.map(a => ({
            id: a.answer_id,
            text: a.text,
            color: a.color,
          })),
          timeLimit: currentQuestion.time_limit,
        }}
        questionNumber={gameState.currentQuestionIndex + 1}
        totalQuestions={gameState.questions.length}
        showCorrectAnswer={showAnswer}
        correctAnswerId={currentQuestion.correct_answer_id}
      />

      {/* Controls */}
      <div className="mt-8 flex gap-4">
        {!showAnswer ? (
          <button
            onClick={revealAnswer}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-xl transition-colors"
          >
            Reveal Answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-8 rounded-xl transition-colors"
          >
            {gameState.currentQuestionIndex < gameState.questions.length - 1
              ? 'Next Question →'
              : 'See Results 🏆'}
          </button>
        )}
        <button
          onClick={endGame}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-4 px-8 rounded-xl transition-colors"
        >
          End Game
        </button>
      </div>
    </div>
  );
}
