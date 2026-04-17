---
phase: 2-host-reconnection-robustness
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/useGameSocket.ts
  - app/game/host/page.tsx
  - server/websocket.ts
autonomous: true
requirements:
  - Host can reconnect to the room if disconnected
must_haves:
  truths:
    - Host can disconnect and reconnect to the same game using the same PIN
    - Host session is restored if PIN is retained
    - Backend updates host connection status and reattaches session
  artifacts:
    - path: "lib/useGameSocket.ts"
      provides: "WebSocket reconnect logic for host"
    - path: "app/game/host/page.tsx"
      provides: "Host UI for reconnection flow"
    - path: "server/websocket.ts"
      provides: "Backend logic for host reconnection and session reattachment"
  key_links:
    - from: "app/game/host/page.tsx"
      to: "lib/useGameSocket.ts"
      via: "useGameSocket({ isHost: true }) with PIN from sessionStorage"
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket join/reconnect messages"
---

<objective>
Implement host reconnection logic for robustness.
Purpose: Allow the host to disconnect and reconnect to the same game room using the same PIN, restoring session and control.
Output: Host reconnection UI, frontend reconnect logic, and backend session handling.
</objective>

<execution_context>
@.planning/2-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@lib/useGameSocket.ts
@app/game/host/page.tsx
@server/websocket.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement host reconnection flow</name>
  <files>lib/useGameSocket.ts, app/game/host/page.tsx, server/websocket.ts</files>
  <action>
    - Update useGameSocket to support reconnecting as host using stored PIN
    - Update host UI to attempt reconnection if sessionStorage has hostGamePin
    - Update backend to recognize host reconnection and reattach session to game
    - Ensure host regains control and game state is restored
  </action>
  <verify>
    <automated>pnpm dev:all & (disconnect/reconnect host browser with same PIN) & curl -X POST http://localhost:3001/ws -d '{"type":"join","payload":{"gamePin":"123456","playerName":"Host","isHost":true}}' | grep 'game_state'</automated>
  </verify>
  <done>
    Host can disconnect and reconnect to the same game, regaining control if PIN is retained.
  </done>
</task>
</tasks>

<verification>
- Host can disconnect and reconnect to the same game using the same PIN
- Automated test returns game_state with host session restored
</verification>

<success_criteria>
- Host reconnection works as described in context
- Session and control are restored on reconnect
</success_criteria>

<output>
After completion, create `.planning/phases/2-host-reconnection-robustness/2-host-reconnection-robustness-01-SUMMARY.md`
</output>
