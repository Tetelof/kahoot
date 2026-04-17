---
phase: 1-core-game-flow
plan: 02
subsystem: player-join
tags: [player, join, waiting-room, real-time-updates]
dependency_graph:
  requires: [plan-01]
  provides: [player-list, join-validation]
  affects: [plan-03]
tech_stack:
  added: [real-time-broadcast]
  patterns: [player-joined-event, player-left-event]
key_files:
  created:
    - app/join/page.tsx
    - server/websocket.ts
    - lib/useGameSocket.ts
  modified: []
decisions:
  - Player name stored in sessionStorage for persistence
  - Duplicate player names prevented in same game
  - Real-time player list updates via player_joined/player_left events
---

# Phase 1 Plan 2: Player Join Flow, Waiting Room

## Summary

Implemented player join flow and real-time waiting room. Players can join a room using the 6-digit PIN and their name, with the connected player list updating in real-time for all participants.

## Implementation Details

### Frontend (app/join/page.tsx)
- Name input (max 20 characters)
- 6-digit PIN input with validation
- Error messages for invalid input
- Redirects to play page after joining

### Backend (server/websocket.ts)
- `handleJoin()`: Creates player in database, handles reconnection
- `addPlayer()`: Adds new player or reconnects existing
- `broadcastToGame()`: Sends updates to all clients in game room
- Player_joined/player_left events for real-time updates

### Client Hook (lib/useGameSocket.ts)
- Listens for player_joined, player_left events
- Updates player list in game state

## Verification

- Build passes: `pnpm build` succeeds
- Player join UI functional at /join
- Player list updates in real-time in host waiting room

## Deviation: None

All features implemented as specified in plan.

## Known Stubs

None - player join fully wired to backend.