# External Integrations

**Analysis Date:** 2026-03-27

## APIs & External Services

**Database:**
- PostgreSQL - Primary data storage
  - SDK/Client: `pg` (`package.json`)
  - Auth: via environment variables (see `.env` file present)

**WebSockets:**
- Custom WebSocket server
  - SDK/Client: `ws` (`package.json`)
  - Used in: `server/websocket.ts`

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: via env vars (not shown)
  - Client: `pg`

**File Storage:**
- Not detected (no S3, GCS, or similar found)

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Not detected (no OAuth, Auth0, or similar found)

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Not detected (likely console or custom)

## CI/CD & Deployment

**Hosting:**
- Not detected (no Vercel, Netlify, or similar found)

**CI Pipeline:**
- Not detected

## Environment Configuration

**Required env vars:**
- Database connection (likely `DATABASE_URL` or similar, see `.env` file present)

**Secrets location:**
- `.env` file (present, not read)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-03-27*