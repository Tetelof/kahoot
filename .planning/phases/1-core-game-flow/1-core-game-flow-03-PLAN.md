---
phase: 1-core-game-flow
plan: 03
type: execute
wave: 2
depends_on: [01, 02]
files_modified:
  - app/play/[pin]/page.tsx
  - components/QuestionCard.tsx
  - lib/useGameSocket.ts
  - server/websocket.ts
autonomous: true
requirements:
  - Game presents questions to all players simultaneously
  - Players submit answers in real time
must_haves:
  truths:
    - All players see the same question at the same time
    - Players can select and submit answers
    - Backend receives and processes answers in real time
  artifacts:
    - path: "app/play/[pin]/page.tsx"
      provides: "Game play UI for answering questions"
    - path: "components/QuestionCard.tsx"
      provides: "Reusable question/answer component"
    - path: "lib/useGameSocket.ts"
      provides: "Client hook for question/answer flow"
    - path: "server/websocket.ts"
      provides: "Backend logic for question/answer events"
  key_links:
    - from: "app/play/[pin]/page.tsx"
      to: "components/QuestionCard.tsx"
      via: "<QuestionCard /> usage"
    - from: "components/QuestionCard.tsx"
      to: "lib/useGameSocket.ts"
      via: "onAnswerSelect prop"
    - from: "lib/useGameSocket.ts"
      to: "server/websocket.ts"
      via: "WebSocket question_start/answer_submit/reveal_answer messages"
---

<objective>
Implement game play flow: question presentation, answer selection, and real-time answer submission.
Purpose: Enable all players to answer questions in sync, with backend processing and feedback.
Output: Game play UI, reusable question component, and backend answer logic.
</objective>

<execution_context>
@.planning/1-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
</execution_context>

<context>
@lib/shared/types.ts
@server/websocket.ts
@app/play/[pin]/page.tsx
@components/QuestionCard.tsx
@lib/useGameSocket.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Implement question presentation and answer submission</name>
  <files>app/play/[pin]/page.tsx, components/QuestionCard.tsx, lib/useGameSocket.ts, server/websocket.ts</files>
  <action>
    - Add UI for displaying questions and answers to all players (app/play/[pin]/page.tsx)
    - Use QuestionCard for answer selection and feedback (components/QuestionCard.tsx)
    - Update useGameSocket for question/answer events and real-time updates (lib/useGameSocket.ts)
    - Update backend to handle answer submission, correctness, and scoring (server/websocket.ts)
  </action>
  <verify>
    <automated>pnpm dev:all & curl -X POST http://localhost:3001/ws -d '{"type":"answer_submit","payload":{"playerId":"player1","answerId":"a"}}' | grep 'reveal_answer'</automated>
  </verify>
  <done>
    Players see questions, select answers, and backend processes answers in real time.
  </done>
</task>
</tasks>

<verification>
- All players see questions and can submit answers in real time.
- Automated test returns reveal_answer after answer submission.
</verification>

<success_criteria>
- Game play UI and answer flow work
- Backend processes answers and updates state
</success_criteria>

<output>
After completion, create `.planning/phases/1-core-game-flow/1-core-game-flow-03-SUMMARY.md`
</output>
