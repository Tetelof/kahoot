export interface Game {
  id: string;
  pin: string;
  status: 'waiting' | 'active' | 'ended';
  host_id: string | null;
  current_question_index: number;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: string;
  game_id: string;
  text: string;
  correct_answer_id: string;
  time_limit: number;
  question_order: number;
  created_at: Date;
}

export interface QuestionAnswer {
  id: string;
  question_id: string;
  answer_id: string;
  text: string;
  color: string;
}

export interface Player {
  id: string;
  game_id: string;
  name: string;
  score: number;
  streak: number;
  is_connected: boolean;
  joined_at: Date;
}

export interface PlayerAnswer {
  id: string;
  player_id: string;
  question_id: string;
  selected_answer_id: string | null;
  is_correct: boolean;
  points: number;
  answered_at: Date;
}

// Full game state for API responses
export interface GameState {
  game: Game;
  questions: (Question & { answers: QuestionAnswer[] })[];
  players: Player[];
  currentQuestion: (Question & { answers: QuestionAnswer[] }) | null;
}

// WebSocket message types
export type WSMessageType = 
  | 'join'
  | 'player_joined'
  | 'player_left'
  | 'game_start'
  | 'question_start'
  | 'answer_submit'
  | 'question_end'
  | 'reveal_answer'
  | 'next_question'
  | 'game_end'
  | 'end_game'
  | 'game_state'
  | 'error';

export interface WSMessage {
  type: WSMessageType;
  payload?: unknown;
}

// Specific message payloads
export interface JoinPayload {
  gamePin: string;
  playerName: string;
  isHost?: boolean;
}

export interface PlayerJoinedPayload {
  player: Player;
  players: Player[];
}

export interface QuestionStartPayload {
  questionIndex: number;
  question: Question & { answers: QuestionAnswer[] };
  timeLimit: number;
}

export interface AnswerSubmitPayload {
  playerId: string;
  answerId: string;
  points: number;
}

export interface GameStatePayload {
  game: Game;
  questions: (Question & { answers: QuestionAnswer[] })[];
  players: Player[];
  currentQuestion: (Question & { answers: QuestionAnswer[] }) | null;
}
