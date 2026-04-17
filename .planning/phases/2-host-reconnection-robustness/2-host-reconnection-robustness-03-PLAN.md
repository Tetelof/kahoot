---
phase: 2-host-reconnection-robustness
plan: 03
type: execute
wave: 2
depends_on: [01]
files_modified:
  - server/websocket.ts
  - lib/useGameSocket.ts
  - app/play/[pin]/page.tsx
autonomous: true
requirements:
  - Handle player disconnects gracefully
must_haves:
  truths:
    - Player disconnects are detected and handled
    - Player can reconnect with same name and PIN, regaining state
    - Disconnected players are removed from active player list
  artifacts:
    - path: "server/websocket.ts"
      provides: "Backend logic for player disconnect/reconnect"
    - path: "lib/useGameSocket.ts"
      provides: "Client logic for player reconnect"
    - path: "app/play/[pin]/page.tsx"
      provides: "UI for player reconnect and state update"
  key_links:
    - from: "app/play/[pin]/page.tsx"
      to: "lib/useGameSocket.ts"
      via: "useGameSocket({ isHost: false }) reconnect logic"
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket join/player_left/player_joined messages"
---

<objective>
Handle player disconnects and allow seamless reconnect with state restoration.
Purpose: Ensure players can rejoin games after disconnects and are removed from the active list when gone.
Output: Backend and client logic for player disconnect/reconnect, and UI for reconnect flow.
</objective>

<execution_context>
@.planning/2-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@server/websocket.ts
@lib/useGameSocket.ts
@app/play/[pin]/page.tsx
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement player disconnect/reconnect handling</name>
  <files>server/websocket.ts, lib/useGameSocket.ts, app/play/[pin]/page.tsx</files>
  <action>
    - Update backend to mark players as disconnected on WebSocket close
    - Allow players to reconnect with same name and PIN, restoring state
    - Update client to handle reconnect and update UI accordingly
    - Remove disconnected players from active list in UI
  </action>
  <verify>
    <automated>pnpm dev:all & (disconnect/reconnect player browser with same name and PIN) & curl -X POST http://localhost:3001/ws -d '{"type":"join","payload":{"gamePin":"123456","playerName":"Alice","isHost":false}}' | grep 'game_state'</automated>
  </verify>
  <done>
    Players can disconnect and reconnect, regaining state; disconnected players are removed from active list.
  </done>
</task>
</tasks>

<verification>
- Player disconnects are handled and state is updated
- Automated test returns correct game_state after player reconnect
</verification>

<success_criteria>
- Player disconnect/reconnect works as described
- UI and backend update player state correctly
</success_criteria>

<output>
After completion, create `.planning/phases/2-host-reconnection-robustness/2-host-reconnection-robustness-03-SUMMARY.md`
</output>
