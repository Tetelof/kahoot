---
phase: 1-core-game-flow
plan: 03
subsystem: question-presentation
tags: [question, answer-submission, real-time, scoring]
dependency_graph:
  requires: [plan-01, plan-02]
  provides: [question-state, answer-handling]
  affects: [plan-04]
tech_stack:
  added: [question-cards, answer-selection]
  patterns: [question-start-event, reveal-answer-event]
key_files:
  created:
    - app/play/[pin]/page.tsx
    - components/QuestionCard.tsx
    - lib/useGameSocket.ts
    - server/websocket.ts
  modified: []
decisions:
  - All players see same question simultaneously
  - One answer per player per question
  - 1000 base points for correct answer
  - Host controls reveal/next flow
---

# Phase 1 Plan 3: Question Presentation, Answer Submission

## Summary

Implemented question presentation and answer submission flow. All players see questions simultaneously, can select and submit answers in real-time, with the backend processing answers and calculating scores.

## Implementation Details

### Game Play UI (app/play/[pin]/page.tsx)
- Waiting screen when game not started
- Question display with answer selection
- Status messages: "Choose your answer!", "Waiting for result", "Correct!/Wrong!"
- Score display and question progress indicator

### Question Component (components/QuestionCard.tsx)
- Displays question text and 4 answer options
- Color-coded answer buttons (blue/yellow/pink/green)
- Hover effects for selection
- Shows correct answer after reveal
- Disabled state after answering

### Backend (server/websocket.ts)
- `handleGameStart()`: Sends first question to all players
- `handleAnswerSubmit()`: Records answer, calculates points
- `handleRevealAnswer()`: Broadcasts correct answer to all
- `handleNextQuestion()`: Advances to next question or ends game

### Scoring
- 1000 points for correct answer
- One answer allowed per player per question

## Verification

- Build passes: `pnpm build` succeeds
- Question flow works from host and player perspectives
- Answer submission updates player scores

## Deviation: None

All features implemented as specified in plan.

## Known Stubs

None - all question and answer functionality wired.