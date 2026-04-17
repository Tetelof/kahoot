# Technology Stack

**Analysis Date:** 2026-03-27

## Languages

**Primary:**
- TypeScript (ES2017+) - Used throughout the codebase (`tsconfig.json`, `*.ts`, `*.tsx`)

**Secondary:**
- JavaScript (allowed, but TypeScript is primary)

## Runtime

**Environment:**
- Node.js (version not pinned, but required for Next.js 16+)

**Package Manager:**
- pnpm (lockfile: `pnpm-lock.yaml` present)

## Frameworks

**Core:**
- Next.js 16.2.0 - Fullstack React framework (`package.json`, `next.config.ts`)
- React 19.2.4 - UI library (`package.json`)

**Testing:**
- Not detected (no test dependencies in `package.json`)

**Build/Dev:**
- tailwindcss ^4 - Utility-first CSS framework (`package.json`, `postcss.config.mjs`)
- postcss (via Tailwind plugin)
- tsx ^4.0.0 - TypeScript execution for scripts (`package.json`)
- concurrently ^9.0.0 - Run multiple dev scripts (`package.json`)

## Key Dependencies

**Critical:**
- next 16.2.0 - App framework
- react 19.2.4, react-dom 19.2.4 - UI

**Infrastructure:**
- pg ^8.20.0 - PostgreSQL client
- ws ^8.19.0 - WebSocket server

## Configuration

**Environment:**
- Environment variables via `.env` (file present, not read)
- `next.config.ts` for Next.js config

**Build:**
- `tsconfig.json` for TypeScript
- `postcss.config.mjs` for CSS
- `eslint.config.mjs` for linting

## Platform Requirements

**Development:**
- Node.js, pnpm, TypeScript

**Production:**
- Node.js server (Next.js app)

---

*Stack analysis: 2026-03-27*