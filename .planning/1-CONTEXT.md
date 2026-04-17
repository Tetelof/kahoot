# 1-CONTEXT.md

## Phase 1: Core Game Flow — Implementation Decisions

### 1. Room Creation and Pin Code Logic
- **Pin Format:** 6-digit numeric string (e.g., 123456). Enforced in both UI and backend.
- **Host Flow:** Host creates a game and its questions, which generates a unique pin. Pin is stored in sessionStorage as 'hostGamePin' for reconnection within the session.
- **Player Flow:** Players join by entering the pin and their name. Pin input is validated for length and numeric format. Player name is stored in sessionStorage as 'playerName'.
- **Backend:** If a host joins with a new pin, a new game is created. If a player joins with an existing pin, they are added to that game. Duplicate player names in the same game are prevented.

### 2. Waiting Room and Player Connection Flow
- **Game Status:** 'waiting' status until host starts the game. All players who join are marked as connected in the database.
- **Player List:** All connected players are visible in the waiting room. Player state is updated in real time via WebSocket events ('player_joined', 'player_left').
- **Host Start:** Host can start the game at any time, which transitions the game to 'active' and sends the first question to all players.
- **Reconnection:** If a player disconnects and rejoins with the same name, their connection status is updated. Host reconnection is not implemented in phase 1 (deferred to phase 2).
- **Editing questions:** While players are connecting, the host can add, update or delete questions.

### 3. Question Presentation and Answer Submission
- **Question Display:** Questions are presented to all players simultaneously. The `QuestionCard` component handles display, answer selection, and disables input after selection or when time expires.
- **Answer Submission:** Players submit answers in real time. Only one answer per player per question is accepted. Correctness and points are calculated on the backend.
- **Reveal & Next:** The correct answer is revealed for 5 seconds after all players answer or countdown time expires. Scoreboard is updated after each question and at the end of the game.

### 4. Real-Time Transport
- **WebSocket:** All game state changes (join, start, answer, reveal, next, end) are communicated via WebSocket events. The `useGameSocket` hook manages client connections and message handling.

## Out of Scope for Phase 1
- Host reconnection after session loss (phase 2)
- Advanced anti-cheat or duplicate session handling
- Custom question sets (uses sample questions for now)

---

**This file locks implementation decisions for phase 1. Downstream agents should not re-ask these unless requirements change.**
