---
phase: 1-core-game-flow
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/game/host/page.tsx
  - server/websocket.ts
  - lib/shared/types.ts
  - lib/useGameSocket.ts
autonomous: true
requirements:
  - Host can create a game room and define questions/answers
  - System generates a unique pin code for each room
  - Host can start the game after a waiting period
must_haves:
  truths:
    - Host can create a new game room and define questions
    - Unique pin code is generated and displayed
    - Host can start the game when ready
  artifacts:
    - path: "app/game/host/page.tsx"
      provides: "Host UI for room creation, question setup, and game start"
    - path: "server/websocket.ts"
      provides: "Backend logic for game creation and pin generation"
    - path: "lib/shared/types.ts"
      provides: "Type definitions for Game, Question, etc."
    - path: "lib/useGameSocket.ts"
      provides: "Client hook for host actions"
  key_links:
    - from: "app/game/host/page.tsx"
      to: "lib/useGameSocket.ts"
      via: "useGameSocket({ isHost: true })"
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket join/game_start messages"
---

<objective>
Implement host room creation, question setup, and game start logic.
Purpose: Enable the host to create a game, define questions, and start the game when ready.
Output: Host UI, backend logic, and shared types for game creation and start.
</objective>

<execution_context>
@.planning/1-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@lib/shared/types.ts
@server/websocket.ts
@app/game/host/page.tsx
@lib/useGameSocket.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement host room creation and question setup</name>
  <files>app/game/host/page.tsx, server/websocket.ts, lib/shared/types.ts, lib/useGameSocket.ts</files>
  <action>
    - Add UI for host to create a new game room and define questions/answers (app/game/host/page.tsx)
    - Generate a unique 6-digit pin code on game creation (server/websocket.ts)
    - Update shared types for Game, Question, etc. as needed (lib/shared/types.ts)
    - Ensure useGameSocket supports host actions (lib/useGameSocket.ts)
    - Display pin code to host and allow editing questions before starting
  </action>
  <verify>
    <automated>pnpm dev:all & curl -X POST http://localhost:3001/ws -d '{"type":"join","payload":{"gamePin":"123456","playerName":"Host","isHost":true}}' | grep 'game_state'</automated>
  </verify>
  <done>
    Host can create a room, define questions, see pin, and start the game.
  </done>
</task>
</tasks>

<verification>
- Host can create a room, define questions, see pin, and start the game.
- Automated test returns game_state with correct structure.
</verification>

<success_criteria>
- Host UI for room creation and question setup works
- Backend creates game and pin, returns correct state
- Host can start the game
</success_criteria>

<output>
After completion, create `.planning/phases/1-core-game-flow/1-core-game-flow-01-SUMMARY.md`
</output>
