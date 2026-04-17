---
phase: 1-core-game-flow
plan: 04
subsystem: scoreboard
tags: [scoreboard, ranking, game-end, final-scores]
dependency_graph:
  requires: [plan-03]
  provides: [final-scores, rankings]
  affects: []
tech_stack:
  added: [scoreboard-component]
  patterns: [game-end-event, score-sorting]
key_files:
  created:
    - components/Scoreboard.tsx
    - app/play/[pin]/page.tsx
    - lib/useGameSocket.ts
    - server/websocket.ts
  modified: []
decisions:
  - Players sorted by score (highest first)
  - Top 3 get special styling (gold/silver/bronze)
  - Host sees winner display before scoreboard
  - Play Again button to restart
---

# Phase 1 Plan 4: Scoreboard Display at Game End

## Summary

Implemented scoreboard display at game end. Players see final scores and rankings when the game concludes, with the host viewing a winner announcement and all players seeing the ranked leaderboard.

## Implementation Details

### Scoreboard Component (components/Scoreboard.tsx)
- Sorts players by score descending
- Shows rank badges (gold/silver/bronze for top 3)
- Displays player name and score
- Supports max visible players (default 10)
- Shows "+N more" if additional players

### Host View (app/game/host/page.tsx)
- Winner display with trophy icon and score
- Full scoreboard below winner
- "Play Again" button to restart

### Player View (app/play/[pin]/page.tsx)
- Personal score and rank display
- Full leaderboard
- "Play Again" button

### Backend (server/websocket.ts)
- `handleNextQuestion()`: Ends game when no more questions
- `handleEndGame()`: Force ends game, broadcasts final state
- game_state sent with final scores before game_end event

## Verification

- Build passes: `pnpm build` succeeds
- Scoreboard displays correctly at game end
- Ranking order is correct (highest score first)

## Deviation: None

All features implemented as specified in plan.

## Known Stubs

None - scoreboard fully functional at game end.