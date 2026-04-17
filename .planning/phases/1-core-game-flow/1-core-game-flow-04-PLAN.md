---
phase: 1-core-game-flow
plan: 04
type: execute
wave: 3
depends_on: [03]
files_modified:
  - components/Scoreboard.tsx
  - app/play/[pin]/page.tsx
  - lib/useGameSocket.ts
  - server/websocket.ts
autonomous: true
requirements:
  - Scoreboard is shown at the end of the game
must_haves:
  truths:
    - Players see a final scoreboard with scores and ranks
    - Scoreboard updates in real time as game ends
  artifacts:
    - path: "components/Scoreboard.tsx"
      provides: "Reusable scoreboard component"
    - path: "app/play/[pin]/page.tsx"
      provides: "Game play UI for scoreboard display"
    - path: "lib/useGameSocket.ts"
      provides: "Client hook for scoreboard state"
    - path: "server/websocket.ts"
      provides: "Backend logic for game end and scoreboard"
  key_links:
    - from: "app/play/[pin]/page.tsx"
      to: "components/Scoreboard.tsx"
      via: "<Scoreboard /> usage"
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket game_end/game_state messages"
---

<objective>
Implement final scoreboard display and real-time updates at game end.
Purpose: Show all players their final scores and ranks when the game ends.
Output: Scoreboard UI, backend logic, and real-time updates for game end.
</objective>

<execution_context>
@.planning/1-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@lib/shared/types.ts
@server/websocket.ts
@components/Scoreboard.tsx
@app/play/[pin]/page.tsx
@lib/useGameSocket.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement scoreboard display and game end flow</name>
  <files>components/Scoreboard.tsx, app/play/[pin]/page.tsx, lib/useGameSocket.ts, server/websocket.ts</files>
  <action>
    - Add UI for displaying final scoreboard to all players (components/Scoreboard.tsx, app/play/[pin]/page.tsx)
    - Update useGameSocket for game_end and scoreboard state (lib/useGameSocket.ts)
    - Update backend to broadcast final scores and game end (server/websocket.ts)
  </action>
  <verify>
    <automated>pnpm dev:all & curl -X POST http://localhost:3001/ws -d '{"type":"game_end","payload":{}}' | grep 'game_state'</automated>
  </verify>
  <done>
    Players see final scoreboard with scores and ranks at game end.
  </done>
</task>
</tasks>

<verification>
- Players see final scoreboard and ranks at game end.
- Automated test returns game_state with final scores.
</verification>

<success_criteria>
- Scoreboard UI and backend logic work for game end
- Real-time updates for all players
</success_criteria>

<output>
After completion, create `.planning/phases/1-core-game-flow/1-core-game-flow-04-SUMMARY.md`
</output>
