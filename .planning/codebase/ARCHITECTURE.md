# Architecture

**Analysis Date:** 2026-03-27

## Pattern Overview

**Overall:** Modular Monolithic (Next.js Custom)

**Key Characteristics:**
- Separation of frontend (React/Next.js) and backend (Node.js/Express-style server)
- Modular organization by feature (game, play, join, host)
- Shared types and logic between client and server

## Layers

**Frontend (App):**
- Purpose: Handles UI, routing, and user interaction
- Location: `app/`
- Contains: Page components, layouts, client-side hooks
- Depends on: `lib/` for shared logic, `components/` for UI
- Used by: End users via browser

**UI Components:**
- Purpose: Reusable presentational components
- Location: `components/`
- Contains: Stateless and stateful React components (e.g., Timer, Scoreboard, QuestionCard)
- Depends on: None or `lib/` for types
- Used by: Pages in `app/`

**Shared Logic & Types:**
- Purpose: Business logic, hooks, and type definitions
- Location: `lib/`
- Contains: Custom hooks (e.g., `useGameSocket`), game state management, shared TypeScript types
- Depends on: None or external packages
- Used by: Both frontend and backend

**Backend (Server):**
- Purpose: Real-time game logic, database access, WebSocket communication
- Location: `server/`
- Contains: WebSocket server, database access layer, backend types
- Depends on: `pg` for Postgres, `ws` for WebSocket
- Used by: Frontend via WebSocket/API

## Data Flow

**Game Session Flow:**
1. User navigates to `app/page.tsx` (home)
2. User creates or joins a game (handled in `app/game/host/page.tsx` or `app/join/page.tsx`)
3. Game state and actions flow through `useGameSocket` (in `lib/useGameSocket.ts`), which communicates with the backend via WebSocket (`server/websocket.ts`)
4. Backend updates state in Postgres (`server/db.ts`) and broadcasts updates
5. UI updates in real time via WebSocket events

**State Management:**
- Client: React state/hooks, sessionStorage for persistence
- Server: In-memory for connections, Postgres for persistent game data

## Key Abstractions

**Game State:**
- Purpose: Represents the current state of a game session
- Examples: `lib/gameStore.tsx`, `lib/shared/types.ts`, `server/types.ts`
- Pattern: TypeScript interfaces, context, and hooks

**WebSocket Communication:**
- Purpose: Real-time updates between client and server
- Examples: `lib/useGameSocket.ts`, `server/websocket.ts`
- Pattern: Custom hook on client, event-driven server

**Database Access:**
- Purpose: Persistent storage of games, players, questions
- Examples: `server/db.ts`
- Pattern: Query functions using `pg` Pool

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: All page loads
- Responsibilities: HTML structure, global styles

**Home Page:**
- Location: `app/page.tsx`
- Triggers: `/` route
- Responsibilities: Game creation/join UI

**Game Host Page:**
- Location: `app/game/host/page.tsx`
- Triggers: `/game/host` route
- Responsibilities: Host game session, control flow

**Game Play Page:**
- Location: `app/play/[pin]/page.tsx`
- Triggers: `/play/:pin` route
- Responsibilities: Player game session

**WebSocket Server:**
- Location: `server/websocket.ts`
- Triggers: Server start
- Responsibilities: Real-time communication

## Error Handling

**Strategy:**
- Client: Try/catch in async functions, error state in hooks
- Server: Error events on database pool, try/catch in async handlers

**Patterns:**
- Log and exit on fatal server errors (`server/db.ts`)
- Set error state in React for user feedback

## Cross-Cutting Concerns

**Logging:** Console logging in server and client
**Validation:** Input validation in UI and backend (basic)
**Authentication:** Not detected (open join, no auth)

---

*Architecture analysis: 2026-03-27*
