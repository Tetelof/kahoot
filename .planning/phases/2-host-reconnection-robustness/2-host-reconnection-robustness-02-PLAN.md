---
phase: 2-host-reconnection-robustness
plan: 02
type: execute
wave: 2
depends_on: [01]
files_modified:
  - server/websocket.ts
  - lib/useGameSocket.ts
  - lib/shared/types.ts
autonomous: true
requirements:
  - Persist game state in database
must_haves:
  truths:
    - Game state (players, questions, progress) is persisted in PostgreSQL
    - Game can be recovered after backend restart
  artifacts:
    - path: "server/websocket.ts"
      provides: "Backend logic for loading/saving game state from database"
    - path: "lib/useGameSocket.ts"
      provides: "Client logic for reconnecting and restoring state"
    - path: "lib/shared/types.ts"
      provides: "Type definitions for persistent game state"
  key_links:
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket join/game_state messages"
---

<objective>
Ensure game state is persisted and recoverable after backend restart.
Purpose: Prevent loss of game progress and allow reconnection after server restarts.
Output: Backend and client logic for state persistence and recovery.
</objective>

<execution_context>
@.planning/2-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@server/websocket.ts
@lib/useGameSocket.ts
@lib/shared/types.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement game state persistence and recovery</name>
  <files>server/websocket.ts, lib/useGameSocket.ts, lib/shared/types.ts</files>
  <action>
    - Ensure all game state (players, questions, progress) is saved to PostgreSQL
    - On backend restart, load game state from database for reconnecting clients
    - Update types as needed for persistent state
    - Update client to handle state restoration after reconnect
  </action>
  <verify>
    <automated>pnpm dev:all & (restart backend, reconnect client) & curl -X POST http://localhost:3001/ws -d '{"type":"join","payload":{"gamePin":"123456","playerName":"Host","isHost":true}}' | grep 'game_state'</automated>
  </verify>
  <done>
    Game state is persisted and can be recovered after backend restart.
  </done>
</task>
</tasks>

<verification>
- Game state is not lost after backend restart
- Automated test returns correct game_state after reconnect
</verification>

<success_criteria>
- Game state is persisted and recoverable
- Clients can reconnect and resume game
</success_criteria>

<output>
After completion, create `.planning/phases/2-host-reconnection-robustness/2-host-reconnection-robustness-02-SUMMARY.md`
</output>
