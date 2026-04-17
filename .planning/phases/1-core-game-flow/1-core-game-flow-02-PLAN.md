---
phase: 1-core-game-flow
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - app/join/page.tsx
  - server/websocket.ts
  - lib/useGameSocket.ts
autonomous: true
requirements:
  - Players can join a room using the pin code
  - All players can see who is connected in the room
must_haves:
  truths:
    - Players can join a room by entering the pin and their name
    - Player list updates in real time as players join/leave
  artifacts:
    - path: "app/join/page.tsx"
      provides: "Player join UI and waiting room display"
    - path: "server/websocket.ts"
      provides: "Backend logic for player join and connection tracking"
    - path: "lib/useGameSocket.ts"
      provides: "Client hook for player join and real-time updates"
  key_links:
    - from: "app/join/page.tsx"
      to: "lib/useGameSocket.ts"
      via: "useGameSocket({ isHost: false })"
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket join/player_joined/player_left messages"
---

<objective>
Implement player join flow and real-time waiting room updates.
Purpose: Allow players to join a room with a pin and see who else is connected.
Output: Player join UI, backend join logic, and real-time player list updates.
</objective>

<execution_context>
@.planning/1-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@lib/shared/types.ts
@server/websocket.ts
@app/join/page.tsx
@lib/useGameSocket.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement player join and waiting room flow</name>
  <files>app/join/page.tsx, server/websocket.ts, lib/useGameSocket.ts</files>
  <action>
    - Add UI for players to enter pin and name, join room (app/join/page.tsx)
    - Update backend to handle player join, connection status, and broadcast player list (server/websocket.ts)
    - Ensure useGameSocket supports player join and real-time updates (lib/useGameSocket.ts)
    - Display real-time player list in waiting room
  </action>
  <verify>
    <automated>pnpm dev:all & curl -X POST http://localhost:3001/ws -d '{"type":"join","payload":{"gamePin":"123456","playerName":"Alice","isHost":false}}' | grep 'game_state'</automated>
  </verify>
  <done>
    Players can join a room, see who is connected, and waiting room updates in real time.
  </done>
</task>
</tasks>

<verification>
- Players can join a room and see all connected players in real time.
- Automated test returns game_state with correct player list.
</verification>

<success_criteria>
- Player join UI and waiting room work
- Backend tracks and broadcasts player connections
</success_criteria>

<output>
After completion, create `.planning/phases/1-core-game-flow/1-core-game-flow-02-SUMMARY.md`
</output>
