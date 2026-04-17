# Codebase Structure

**Analysis Date:** 2026-03-27

## Directory Layout

```
[project-root]/
├── app/                # Next.js app directory (pages, layouts, routes)
├── components/         # Reusable React UI components
├── lib/                # Shared logic, hooks, and types
├── server/             # Backend logic (WebSocket server, DB access)
├── public/             # Static assets
├── scripts/            # Utility scripts
├── .planning/          # GSD planning artifacts
├── .next/              # Next.js build output (generated)
├── node_modules/       # Dependencies (generated)
├── package.json        # Project manifest
├── tsconfig.json       # TypeScript config
├── next.config.ts      # Next.js config
├── docker-compose.yml  # Docker orchestration
└── README.md           # Project overview
```

## Directory Purposes

**app/**
- Purpose: Main application code (routing, pages, layouts)
- Contains: Page components, layouts, route handlers
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/play/[pin]/page.tsx`, `app/game/host/page.tsx`, `app/join/page.tsx`

**components/**
- Purpose: Reusable UI components
- Contains: Stateless/stateful React components (e.g., Timer, Scoreboard, QuestionCard)
- Key files: Not detected (no .ts files found)

**lib/**
- Purpose: Shared logic, hooks, and TypeScript types
- Contains: `useGameSocket.ts`, `gameStore.tsx`, `shared/types.ts`
- Key files: `lib/useGameSocket.ts`, `lib/gameStore.tsx`, `lib/shared/types.ts`

**server/**
- Purpose: Backend logic (WebSocket server, DB access, backend types)
- Contains: `websocket.ts`, `db.ts`, `types.ts`
- Key files: `server/websocket.ts`, `server/db.ts`, `server/types.ts`

**public/**
- Purpose: Static assets (images, icons, etc.)
- Contains: Publicly served files
- Key files: Not analyzed

**scripts/**
- Purpose: Utility scripts for development/ops
- Contains: Not analyzed

**.planning/**
- Purpose: GSD planning and codebase documentation
- Contains: Codebase analysis docs
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout for all pages
- `app/page.tsx`: Home page
- `app/game/host/page.tsx`: Host game session
- `app/play/[pin]/page.tsx`: Player game session
- `app/join/page.tsx`: Join game page

**Configuration:**
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project manifest

**Core Logic:**
- `lib/useGameSocket.ts`: WebSocket client logic
- `lib/gameStore.tsx`: Game state management
- `server/websocket.ts`: WebSocket server
- `server/db.ts`: Database access

**Testing:**
- Not detected (no test files found)

## Naming Conventions

**Files:**
- Page files: `page.tsx` for route entry
- Layout files: `layout.tsx` for layout
- Type files: `types.ts` for TypeScript interfaces
- Hooks: `use*.ts` for custom hooks

**Directories:**
- Feature-based subfolders under `app/` (e.g., `play/[pin]`, `game/host`)

## Where to Add New Code

**New Feature:**
- Primary code: `app/[feature]/[subroute]/`
- Tests: Not detected (suggest `__tests__/` or co-located)

**New Component/Module:**
- Implementation: `components/` for UI, `lib/` for logic/hooks

**Utilities:**
- Shared helpers: `lib/`

## Special Directories

**.next/**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No

**.planning/**
- Purpose: GSD planning and documentation
- Generated: Yes (by GSD)
- Committed: Yes

---

*Structure analysis: 2026-03-27*
