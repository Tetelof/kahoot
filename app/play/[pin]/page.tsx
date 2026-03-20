'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameSocket } from '@/lib/useGameSocket';
import { QuestionCard } from '@/components/QuestionCard';
import { Scoreboard } from '@/components/Scoreboard';

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

export default function PlayGame() {
  const params = useParams();
  const router = useRouter();
  const pin = params.pin as string;

  // Get player name from session storage
  const storedName = useSessionStorage('playerName');
  const [localName, setLocalName] = useState<string>('');
  const [hasJoined, setHasJoined] = useState<boolean>(!!storedName);

  const playerName = storedName || '';

  const {
    gameState,
    submitAnswer,
  } = useGameSocket({
    gamePin: pin,
    playerName: playerName || undefined,
    isHost: false,
  });

  const handleJoin = () => {
    if (localName.trim()) {
      sessionStorage.setItem('playerName', localName.trim());
      setHasJoined(true);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Clear sessionStorage when game ends
  useEffect(() => {
    if (gameState.gameStatus === 'ended') {
      sessionStorage.removeItem('playerName');
    }
  }, [gameState.gameStatus]);

  // Show name input if not joined
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Join Game
          </h1>
          
          <p className="text-gray-500 text-center mb-4">
            Game PIN: <span className="font-bold text-2xl text-purple-600">{pin}</span>
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Enter your name"
                className="w-full text-lg py-4 px-6 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={!localName.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-xl font-bold py-4 px-8 rounded-xl transition-colors"
            >
              Join
            </button>
          </div>

          <button
            onClick={handleBackToHome}
            className="mt-6 w-full text-gray-500 hover:text-gray-700 text-center"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Game ended
  if (gameState.gameStatus === 'ended') {
    const myPlayer = gameState.players.find(p => p.name === playerName);
    // Sort players by score to get accurate ranking
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const playerRank = myPlayer
      ? sortedPlayers.findIndex(p => p.name === playerName) + 1
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex flex-col items-center justify-center p-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4">🎉 Game Over! 🎉</h1>
        </div>

        {/* Your Result */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center max-w-sm">
          <p className="text-gray-500 text-lg mb-2">Your Score</p>
          <p className="text-5xl font-black text-purple-600 mb-4">
            {myPlayer?.score.toLocaleString() || 0}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {playerRank === 1 ? '🏆 1st Place!' : `#${playerRank} of ${gameState.players.length}`}
          </p>
        </div>

        {/* Full Leaderboard */}
        <div className="w-full max-w-md mb-8">
          <Scoreboard players={gameState.players} />
        </div>

        <button
          onClick={handleBackToHome}
          className="bg-white text-gray-900 text-xl font-bold py-4 px-12 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Play Again
        </button>
      </div>
  );
}

// Waiting for game to start
if (gameState.gameStatus === 'waiting' || !gameState.currentQuestion) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="text-8xl mb-8">🎮</div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Hi, {playerName}! 👋
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Waiting for the game to start...
        </p>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 inline-block">
          <p className="text-white">
            Game PIN: <span className="font-bold text-2xl">{pin}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Show question
const currentQuestion = gameState.currentQuestion;
  const hasAnswered = gameState.selectedAnswerId !== null;
  const showResult = gameState.showResult;
  const isCorrect = hasAnswered && gameState.selectedAnswerId === currentQuestion.correct_answer_id;
  const myScore = gameState.players.find(p => p.name === playerName)?.score ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="text-white">
            <span className="font-bold">{playerName}</span> | Score: {myScore.toLocaleString()}
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="text-white font-bold">
            Q {gameState.currentQuestionIndex + 1}/{gameState.questions.length}
          </p>
        </div>
      </div>

      {/* Status messages */}
      {!hasAnswered && (
        <div className="text-white text-2xl mb-8 animate-pulse">
          Choose your answer!
        </div>
      )}

      {hasAnswered && !showResult && (
        <div className="text-white text-2xl mb-8 animate-pulse">
          ⏳ Waiting for result...
        </div>
      )}

      {showResult && (
        <div className={`text-4xl font-black mb-8 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
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
        showCorrectAnswer={showResult}
        correctAnswerId={currentQuestion.correct_answer_id}
        selectedAnswerId={gameState.selectedAnswerId || undefined}
        onAnswerSelect={(answerId) => {
          const myPlayer = gameState.players.find(p => p.name === playerName);
          if (myPlayer) {
            submitAnswer(answerId, myPlayer.id);
          }
        }}
        disabled={hasAnswered}
      />

      {/* Waiting message */}
      {hasAnswered && (
        <div className="mt-8 text-white/80 text-center">
          <p className="text-xl mb-2">Waiting for other players...</p>
          <p className="text-sm">The host will advance to the next question</p>
        </div>
      )}
    </div>
  );
}
