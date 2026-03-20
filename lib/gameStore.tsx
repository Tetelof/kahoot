'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Answer {
  id: string;
  text: string;
  color: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerId: string;
  timeLimit: number; // seconds
}

export interface Player {
  id: string;
  name: string;
  score: number;
  streak: number;
}

export interface GameState {
  pin: string;
  questions: Question[];
  currentQuestionIndex: number;
  players: Player[];
  gameStatus: 'waiting' | 'active' | 'ended';
  questionStartTime: number | null;
}

// Generate a random 6-digit PIN
function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Sample questions
const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    answers: [
      { id: 'a', text: 'London', color: 'bg-blue-500' },
      { id: 'b', text: 'Paris', color: 'bg-yellow-500' },
      { id: 'c', text: 'Berlin', color: 'bg-pink-500' },
      { id: 'd', text: 'Madrid', color: 'bg-green-500' },
    ],
    correctAnswerId: 'b',
    timeLimit: 20,
  },
  {
    id: '2',
    text: 'Which planet is known as the Red Planet?',
    answers: [
      { id: 'a', text: 'Venus', color: 'bg-blue-500' },
      { id: 'b', text: 'Jupiter', color: 'bg-yellow-500' },
      { id: 'c', text: 'Mars', color: 'bg-pink-500' },
      { id: 'd', text: 'Saturn', color: 'bg-green-500' },
    ],
    correctAnswerId: 'c',
    timeLimit: 20,
  },
  {
    id: '3',
    text: 'What is 7 × 8?',
    answers: [
      { id: 'a', text: '54', color: 'bg-blue-500' },
      { id: 'b', text: '56', color: 'bg-yellow-500' },
      { id: 'c', text: '64', color: 'bg-pink-500' },
      { id: 'd', text: '48', color: 'bg-green-500' },
    ],
    correctAnswerId: 'b',
    timeLimit: 15,
  },
  {
    id: '4',
    text: 'Who painted the Mona Lisa?',
    answers: [
      { id: 'a', text: 'Van Gogh', color: 'bg-blue-500' },
      { id: 'b', text: 'Picasso', color: 'bg-yellow-500' },
      { id: 'c', text: 'Da Vinci', color: 'bg-pink-500' },
      { id: 'd', text: 'Michelangelo', color: 'bg-green-500' },
    ],
    correctAnswerId: 'c',
    timeLimit: 20,
  },
  {
    id: '5',
    text: 'What is the largest ocean on Earth?',
    answers: [
      { id: 'a', text: 'Atlantic', color: 'bg-blue-500' },
      { id: 'b', text: 'Indian', color: 'bg-yellow-500' },
      { id: 'c', text: 'Arctic', color: 'bg-pink-500' },
      { id: 'd', text: 'Pacific', color: 'bg-green-500' },
    ],
    correctAnswerId: 'd',
    timeLimit: 20,
  },
];

interface GameContextType {
  gameState: GameState | null;
  createGame: () => string;
  joinGame: (pin: string, playerName: string) => string | null;
  addPlayer: (name: string) => string;
  submitAnswer: (playerId: string, answerId: string) => void;
  nextQuestion: () => void;
  endGame: () => void;
  resetGame: () => void;
  getCurrentQuestion: () => Question | null;
  getPlayer: (playerId: string) => Player | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const createGame = (): string => {
    const pin = generatePin();
    const shuffledQuestions = shuffleArray(sampleQuestions);
    
    setGameState({
      pin,
      questions: shuffledQuestions,
      currentQuestionIndex: -1, // -1 means waiting to start
      players: [],
      gameStatus: 'waiting',
      questionStartTime: null,
    });
    
    return pin;
  };

  const joinGame = (pin: string, playerName: string): string | null => {
    // For simplicity, validate PIN exists in state
    if (!gameState || gameState.pin !== pin) {
      return null;
    }
    
    const playerId = addPlayer(playerName);
    return playerId;
  };

  const addPlayer = (name: string): string => {
    const playerId = `player_${Date.now()}`;
    
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: [
          ...prev.players,
          { id: playerId, name, score: 0, streak: 0 },
        ],
      };
    });
    
    return playerId;
  };

  const submitAnswer = (playerId: string, answerId: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      
      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      if (!currentQuestion) return prev;
      
      const isCorrect = answerId === currentQuestion.correctAnswerId;
      const basePoints = 1000;
      const timeBonus = 100;
      
      // Calculate time-based bonus
      let pointsEarned = 0;
      if (isCorrect && prev.questionStartTime) {
        const elapsed = (Date.now() - prev.questionStartTime) / 1000;
        const remaining = currentQuestion.timeLimit - elapsed;
        pointsEarned = basePoints + Math.floor((remaining / currentQuestion.timeLimit) * timeBonus);
      }
      
      return {
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                score: player.score + pointsEarned,
                streak: isCorrect ? player.streak + 1 : 0,
              }
            : player
        ),
      };
    });
  };

  const nextQuestion = () => {
    setGameState((prev) => {
      if (!prev) return prev;
      
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, gameStatus: 'ended' };
      }
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        gameStatus: 'active',
        questionStartTime: Date.now(),
      };
    });
  };

  const endGame = () => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, gameStatus: 'ended' };
    });
  };

  const resetGame = () => {
    setGameState(null);
  };

  const getCurrentQuestion = (): Question | null => {
    if (!gameState || gameState.currentQuestionIndex < 0) return null;
    return gameState.questions[gameState.currentQuestionIndex] || null;
  };

  const getPlayer = (playerId: string): Player | null => {
    if (!gameState) return null;
    return gameState.players.find((p) => p.id === playerId) || null;
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        createGame,
        joinGame,
        addPlayer,
        submitAnswer,
        nextQuestion,
        endGame,
        resetGame,
        getCurrentQuestion,
        getPlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
