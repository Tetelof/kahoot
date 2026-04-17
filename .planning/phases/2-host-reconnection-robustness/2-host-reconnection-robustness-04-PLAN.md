---
phase: 2-host-reconnection-robustness
plan: 04
type: execute
wave: 3
depends_on: [02, 03]
files_modified:
  - server/websocket.ts
  - lib/useGameSocket.ts
autonomous: true
requirements:
  - Improve transaction/consistency for robustness
must_haves:
  truths:
    - Multi-step updates (e.g., game end, mass disconnects) are atomic
    - Partial failures do not cause inconsistent state
  artifacts:
    - path: "server/websocket.ts"
      provides: "Backend logic for transaction management"
    - path: "lib/useGameSocket.ts"
      provides: "Client logic for error handling and state sync"
  key_links:
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket error handling and state sync"
---

<objective>
Add transaction management and error handling for robustness.
Purpose: Ensure multi-step updates are atomic and state remains consistent even on errors.
Output: Backend transaction logic and improved client error handling.
</objective>

<execution_context>
@.planning/2-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@server/websocket.ts
@lib/useGameSocket.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement transaction management and error handling</name>
  <files>server/websocket.ts, lib/useGameSocket.ts</files>
  <action>
    - Refactor backend to wrap multi-step updates (e.g., game end, mass disconnects) in database transactions
    - Add error handling to rollback on failure
    - Update client to handle error messages and sync state accordingly
  </action>
  <verify>
    <automated>pnpm dev:all & (simulate error during game end or disconnect) & check database for consistent state</automated>
  </verify>
  <done>
    Multi-step updates are atomic; errors do not cause inconsistent state; client handles errors gracefully.
  </done>
</task>
</tasks>

<verification>
- Multi-step updates are atomic and consistent
- Automated test confirms no partial state on error
</verification>

<success_criteria>
- Transaction management and error handling work as described
- State remains consistent on errors
</success_criteria>

<output>
After completion, create `.planning/phases/2-host-reconnection-robustness/2-host-reconnection-robustness-04-SUMMARY.md`
</output>
