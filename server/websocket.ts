import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { query, queryOne } from './db';
import type {
  Game, Player, Question, QuestionAnswer, PlayerAnswer,
  WSMessage, JoinPayload, PlayerJoinedPayload, QuestionStartPayload,
  GameStatePayload
} from './types';

interface ConnectedClient {
  ws: WebSocket;
  gameId: string | null;
  playerId: string | null;
  isHost: boolean;
}

const clients = new Map<WebSocket, ConnectedClient>();

// Sample questions for new games
const sampleQuestions = [
  {
    text: 'What is the capital of France?',
    answers: [
      { answer_id: 'a', text: 'London', color: 'bg-blue-500' },
      { answer_id: 'b', text: 'Paris', color: 'bg-yellow-500' },
      { answer_id: 'c', text: 'Berlin', color: 'bg-pink-500' },
      { answer_id: 'd', text: 'Madrid', color: 'bg-green-500' },
    ],
    correct_answer_id: 'b',
    time_limit: 20,
  },
  {
    text: 'Which planet is known as the Red Planet?',
    answers: [
      { answer_id: 'a', text: 'Venus', color: 'bg-blue-500' },
      { answer_id: 'b', text: 'Jupiter', color: 'bg-yellow-500' },
      { answer_id: 'c', text: 'Mars', color: 'bg-pink-500' },
      { answer_id: 'd', text: 'Saturn', color: 'bg-green-500' },
    ],
    correct_answer_id: 'c',
    time_limit: 20,
  },
  {
    text: 'What is 7 × 8?',
    answers: [
      { answer_id: 'a', text: '54', color: 'bg-blue-500' },
      { answer_id: 'b', text: '56', color: 'bg-yellow-500' },
      { answer_id: 'c', text: '64', color: 'bg-pink-500' },
      { answer_id: 'd', text: '48', color: 'bg-green-500' },
    ],
    correct_answer_id: 'b',
    time_limit: 15,
  },
  {
    text: 'Who painted the Mona Lisa?',
    answers: [
      { answer_id: 'a', text: 'Van Gogh', color: 'bg-blue-500' },
      { answer_id: 'b', text: 'Picasso', color: 'bg-yellow-500' },
      { answer_id: 'c', text: 'Da Vinci', color: 'bg-pink-500' },
      { answer_id: 'd', text: 'Michelangelo', color: 'bg-green-500' },
    ],
    correct_answer_id: 'c',
    time_limit: 20,
  },
  {
    text: 'What is the largest ocean on Earth?',
    answers: [
      { answer_id: 'a', text: 'Atlantic', color: 'bg-blue-500' },
      { answer_id: 'b', text: 'Indian', color: 'bg-yellow-500' },
      { answer_id: 'c', text: 'Arctic', color: 'bg-pink-500' },
      { answer_id: 'd', text: 'Pacific', color: 'bg-green-500' },
    ],
    correct_answer_id: 'd',
    time_limit: 20,
  },
];

function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function broadcastToGame(gameId: string, message: WSMessage, excludeWs?: WebSocket) {
  clients.forEach((client) => {
    if (client.gameId === gameId && client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

function send(ws: WebSocket, type: WSMessage['type'], payload?: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

async function createGame(pin?: string): Promise<{ game: Game; questions: (Question & { answers: QuestionAnswer[] })[] }> {
  const gamePin = pin || generatePin();
  
  // Create game
  const gameResult = await query<Game>(
    `INSERT INTO games (pin, host_id, status) VALUES ($1, $2, 'waiting') RETURNING *`,
    [gamePin, 'host']
  );
  const game = gameResult[0];

  // Create questions
  const questions: (Question & { answers: QuestionAnswer[] })[] = [];
  
  for (let i = 0; i < sampleQuestions.length; i++) {
    const q = sampleQuestions[i];
    const questionResult = await query<Question>(
      `INSERT INTO questions (game_id, text, correct_answer_id, time_limit, question_order) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [game.id, q.text, q.correct_answer_id, q.time_limit, i]
    );
    const question = questionResult[0];

    // Create answers
    const answers: QuestionAnswer[] = [];
    for (const a of q.answers) {
      const answerResult = await query<QuestionAnswer>(
        `INSERT INTO question_answers (question_id, answer_id, text, color) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [question.id, a.answer_id, a.text, a.color]
      );
      answers.push(answerResult[0]);
    }

    questions.push({ ...question, answers });
  }

  return { game, questions };
}

async function getGameState(gameId: string): Promise<{ game: Game; questions: (Question & { answers: QuestionAnswer[] })[]; players: Player[] } | null> {
  const gameResult = await query<Game>('SELECT * FROM games WHERE id = $1', [gameId]);
  if (!gameResult.length) return null;
  const game = gameResult[0];

  // Get questions with answers
  const questionsResult = await query<Question>(
    'SELECT * FROM questions WHERE game_id = $1 ORDER BY question_order',
    [gameId]
  );
  const questions: (Question & { answers: QuestionAnswer[] })[] = [];
  for (const q of questionsResult) {
    const answersResult = await query<QuestionAnswer>(
      'SELECT * FROM question_answers WHERE question_id = $1',
      [q.id]
    );
    questions.push({ ...q, answers: answersResult });
  }

  // Get connected players
  const playersResult = await query<Player>(
    'SELECT * FROM players WHERE game_id = $1 AND is_connected = true ORDER BY score DESC',
    [gameId]
  );

  return { game, questions, players: playersResult };
}

async function addPlayer(gameId: string, name: string): Promise<Player | null> {
  // Check if player with same name already exists
  const existingResult = await queryOne<Player>(
    'SELECT * FROM players WHERE game_id = $1 AND name = $2',
    [gameId, name]
  );
  
  if (existingResult) {
    // Update connection status
    await query(
      'UPDATE players SET is_connected = true WHERE id = $1',
      [existingResult.id]
    );
    return { ...existingResult, is_connected: true };
  }

  const result = await query<Player>(
    'INSERT INTO players (game_id, name) VALUES ($1, $2) RETURNING *',
    [gameId, name]
  );
  return result[0];
}

async function handleJoin(ws: WebSocket, payload: JoinPayload) {
  const { gamePin, playerName, isHost } = payload;

  let game: Game;
  
  // Find game by PIN or create new one if host
  const gameResult = await queryOne<Game>('SELECT * FROM games WHERE pin = $1', [gamePin]);
  
  if (gameResult) {
    game = gameResult;
  } else if (isHost) {
    // Auto-create game for host
    const { game: newGame } = await createGame(gamePin);
    game = newGame;
    console.log(`Created new game with PIN: ${gamePin}`);
  } else {
    send(ws, 'error', { message: 'Game not found' });
    return;
  }

  // Update client
  const client = clients.get(ws)!;
  client.gameId = game.id;
  client.isHost = isHost || false;

  if (isHost) {
    client.playerId = 'host';
    const state = await getGameState(game.id);
    send(ws, 'game_state', state);
  } else {
    const player = await addPlayer(game.id, playerName);
    if (!player) {
      send(ws, 'error', { message: 'Failed to join game' });
      return;
    }
    client.playerId = player.id;

    // Broadcast to all clients in the game
    const state = await getGameState(game.id);
    if (state) {
      broadcastToGame(game.id, {
        type: 'player_joined',
        payload: { player, players: state.players } as PlayerJoinedPayload
      });
      send(ws, 'game_state', state as GameStatePayload);
    }
  }
}

async function handleGameStart(ws: WebSocket) {
  const client = clients.get(ws)!;
  if (!client.isHost || !client.gameId) return;

  await query('UPDATE games SET status = $1, current_question_index = 0 WHERE id = $2', ['active', client.gameId]);
  
  const state = await getGameState(client.gameId);
  if (state && state.questions.length > 0) {
    broadcastToGame(client.gameId, {
      type: 'game_start',
      payload: null
    });

    // Send first question
    const firstQuestion = state.questions[0];
    broadcastToGame(client.gameId, {
      type: 'question_start',
      payload: {
        questionIndex: 0,
        question: firstQuestion,
        timeLimit: firstQuestion.time_limit
      } as QuestionStartPayload
    });
  }
}

async function handleNextQuestion(ws: WebSocket) {
  const client = clients.get(ws)!;
  if (!client.isHost || !client.gameId) return;

  const state = await getGameState(client.gameId);
  if (!state) return;

  const nextIndex = state.game.current_question_index + 1;
  
  if (nextIndex >= state.questions.length) {
    await query('UPDATE games SET status = $1 WHERE id = $2', ['ended', client.gameId]);
    broadcastToGame(client.gameId, { type: 'game_end', payload: null });
    return;
  }

  await query('UPDATE games SET current_question_index = $1 WHERE id = $2', [nextIndex, client.gameId]);
  
  const nextQuestion = state.questions[nextIndex];
  broadcastToGame(client.gameId, {
    type: 'question_start',
    payload: {
      questionIndex: nextIndex,
      question: nextQuestion,
      timeLimit: nextQuestion.time_limit
    } as QuestionStartPayload
  });
}

async function handleAnswerSubmit(ws: WebSocket, playerId: string, answerId: string) {
  const client = clients.get(ws)!;
  if (!client.gameId) return;
  
  const state = await getGameState(client.gameId);
  if (!state) return;

  const question = state.questions[state.game.current_question_index];
  if (!question) return;

  // Check if already answered
  const existingAnswer = await queryOne<PlayerAnswer>(
    'SELECT * FROM player_answers WHERE player_id = $1 AND question_id = $2',
    [playerId, question.id]
  );
  if (existingAnswer) return;

  const isCorrect = answerId === question.correct_answer_id;
  let points = 0;
  if (isCorrect) {
    points = 1000; // Base points for correct answer
  }

  // Save answer
  await query(
    'INSERT INTO player_answers (player_id, question_id, selected_answer_id, is_correct, points) VALUES ($1, $2, $3, $4, $5)',
    [playerId, question.id, answerId, isCorrect, points]
  );

  // Update player score
  if (points > 0) {
    await query(
      'UPDATE players SET score = score + $1 WHERE id = $2',
      [points, playerId]
    );
  }
}

async function handleRevealAnswer(ws: WebSocket) {
  const client = clients.get(ws)!;
  if (!client.isHost || !client.gameId) return;

  const state = await getGameState(client.gameId);
  if (!state) return;

  broadcastToGame(client.gameId, {
    type: 'reveal_answer',
    payload: { correctAnswerId: state.questions[state.game.current_question_index].correct_answer_id }
  });
}

async function handleEndGame(ws: WebSocket) {
  const client = clients.get(ws)!;
  if (!client.isHost || !client.gameId) return;

  await query('UPDATE games SET status = $1 WHERE id = $2', ['ended', client.gameId]);
  broadcastToGame(client.gameId, { type: 'game_end', payload: null });
}

export function startServer(port: number = 3001) {
  // Create a simple HTTP server that just handles WebSocket upgrades
  const server = createServer();
  
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    
    clients.set(ws, {
      ws,
      gameId: null,
      playerId: null,
      isHost: false
    });

    ws.on('message', async (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        console.log('Received message:', message.type);

        switch (message.type) {
          case 'join': {
            await handleJoin(ws, message.payload as JoinPayload);
            break;
          }
          case 'game_start': {
            await handleGameStart(ws);
            break;
          }
          case 'next_question': {
            await handleNextQuestion(ws);
            break;
          }
          case 'answer_submit': {
            const { playerId, answerId } = message.payload as { playerId: string; answerId: string };
            await handleAnswerSubmit(ws, playerId, answerId);
            break;
          }
          case 'reveal_answer': {
            await handleRevealAnswer(ws);
            break;
          }
          case 'end_game': {
            await handleEndGame(ws);
            break;
          }
        }
      } catch (error) {
        console.error('Error handling message:', error);
        send(ws, 'error', { message: 'Failed to process message' });
      }
    });

    ws.on('close', async () => {
      console.log('Client disconnected');
      const client = clients.get(ws);
      if (client?.gameId && client?.playerId && !client.isHost) {
        // Mark player as disconnected
        await query(
          'UPDATE players SET is_connected = false WHERE id = $1',
          [client.playerId]
        );
        // Broadcast player left
        broadcastToGame(client.gameId, {
          type: 'player_left',
          payload: { playerId: client.playerId }
        });
      }
      clients.delete(ws);
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  });

  server.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
  });

  return server;
}

// Start server if run directly
if (require.main === module) {
  startServer();
}
