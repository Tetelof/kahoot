'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  Game, Player, Question, QuestionAnswer,
  WSMessage, GameStatePayload, PlayerJoinedPayload, QuestionStartPayload
} from './shared/types';

interface UseGameSocketOptions {
  gamePin?: string;
  playerName?: string;
  isHost?: boolean;
  onMessage?: (message: WSMessage) => void;
}

interface GameState {
  game: Game | null;
  questions: (Question & { answers: QuestionAnswer[] })[];
  players: Player[];
  currentQuestion: (Question & { answers: QuestionAnswer[] }) | null;
  currentQuestionIndex: number;
  gameStatus: 'waiting' | 'active' | 'ended';
  isConnected: boolean;
  error: string | null;
  selectedAnswerId: string | null;
  showResult: boolean;
  correctAnswerId: string | null;
}

export function useGameSocket(options: UseGameSocketOptions) {
  const { gamePin, playerName, isHost = false, onMessage } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectInProgressRef = useRef(false);
  const connectFnRef = useRef<() => void>(() => {});
  
  const [gameState, setGameState] = useState<GameState>({
    game: null,
    questions: [],
    players: [],
    currentQuestion: null,
    currentQuestionIndex: -1,
    gameStatus: 'waiting',
    isConnected: false,
    error: null,
    selectedAnswerId: null,
    showResult: false,
    correctAnswerId: null,
  });

  const send = useCallback((message: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const startGame = useCallback(() => {
    send({ type: 'game_start' });
  }, [send]);

  const nextQuestion = useCallback(() => {
    send({ type: 'next_question' });
  }, [send]);

  const revealAnswer = useCallback(() => {
    send({ type: 'reveal_answer' });
  }, [send]);

  const endGame = useCallback(() => {
    send({ type: 'end_game' });
  }, [send]);

  const submitAnswer = useCallback((answerId: string, playerId: string) => {
    setGameState(prev => ({ ...prev, selectedAnswerId: answerId }));
    send({
      type: 'answer_submit',
      payload: { playerId, answerId },
    });
  }, [send]);

  const connect = useCallback(() => {
    if (connectInProgressRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    connectInProgressRef.current = true;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(`${wsUrl}/ws`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      connectInProgressRef.current = false;
      setGameState(prev => ({ ...prev, isConnected: true, error: null }));
      
      // Join the game
      if (gamePin && playerName) {
        ws.send(JSON.stringify({ 
          type: 'join', 
          payload: { gamePin, playerName, isHost }
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        console.log('Received:', message.type);
        
        switch (message.type) {
          case 'game_state': {
            const payload = message.payload as GameStatePayload;
            setGameState(prev => ({
              ...prev,
              game: payload.game,
              questions: payload.questions,
              players: payload.players,
              currentQuestion: payload.currentQuestion,
              currentQuestionIndex: payload.game.current_question_index,
              gameStatus: payload.game.status,
              selectedAnswerId: null,
              showResult: false,
              correctAnswerId: null,
            }));
            break;
          }
          case 'player_joined': {
            const { players } = message.payload as PlayerJoinedPayload;
            setGameState(prev => ({ ...prev, players }));
            break;
          }
          case 'player_left': {
            const { playerId } = message.payload as { playerId: string };
            setGameState(prev => ({
              ...prev,
              players: prev.players.filter(p => p.id !== playerId),
            }));
            break;
          }
          case 'game_start': {
            setGameState(prev => ({ ...prev, gameStatus: 'active' }));
            break;
          }
          case 'question_start': {
            const payload = message.payload as QuestionStartPayload;
            setGameState(prev => ({
              ...prev,
              currentQuestion: payload.question,
              currentQuestionIndex: payload.questionIndex,
              selectedAnswerId: null,
              showResult: false,
              correctAnswerId: null,
            }));
            break;
          }
          case 'reveal_answer': {
            const { correctAnswerId } = message.payload as { correctAnswerId: string };
            setGameState(prev => ({ ...prev, showResult: true, correctAnswerId }));
            break;
          }
          case 'game_end': {
            setGameState(prev => ({ ...prev, gameStatus: 'ended' }));
            break;
          }
          case 'error': {
            const { message: errorMessage } = message.payload as { message: string };
            setGameState(prev => ({ ...prev, error: errorMessage }));
            break;
          }
        }
        
        onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      connectInProgressRef.current = false;
      setGameState(prev => ({ ...prev, isConnected: false }));
      
      // Attempt to reconnect
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectFnRef.current();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      connectInProgressRef.current = false;
      setGameState(prev => ({ ...prev, error: 'Connection error' }));
    };

    wsRef.current = ws;
  }, [gamePin, playerName, isHost, onMessage]);

  // Store connect function in ref for use in callbacks
  useEffect(() => {
    connectFnRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return {
    gameState,
    send,
    startGame,
    nextQuestion,
    revealAnswer,
    endGame,
    submitAnswer,
    connect,
  };
}
