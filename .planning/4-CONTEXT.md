# 4-CONTEXT.md

## Phase 4: Deployment & Scaling — Implementation Decisions

### 1. Vercel Deployment Strategy
- **Frontend:** The Next.js frontend is designed to be deployed on Vercel using standard `next.config.ts` settings. No custom server or serverless handler patterns are present.
- **Backend:** The WebSocket backend (`server/websocket.ts`) is a standalone Node.js server, not compatible with Vercel serverless functions. It must be hosted separately (e.g., on a VM, container, or another PaaS).
- **Environment Variables:** The client uses `NEXT_PUBLIC_WS_URL` to connect to the backend WebSocket server.

### 2. WebSocket Backend Hosting
- **Hosting:** The backend must run as a persistent Node.js process, with PostgreSQL as the database. Docker Compose is provided for local development, but production hosting requires a separate service (e.g., DigitalOcean, AWS, Railway).
- **Scaling:** The backend is single-process and uses in-memory state for WebSocket clients. Scaling horizontally (multiple backend instances) is not supported without additional work (e.g., Redis pub/sub for state sync).

### 3. Error Handling & Resilience
- **Current State:** Error handling is limited to `console.log` and `console.error`. There is no structured logging, external monitoring, or error reporting integration.
- **Resilience:** The client auto-reconnects to the WebSocket server, but all in-memory state is lost on backend restart. Users will be disconnected if the backend restarts or scales horizontally.
- **Recommendation:** For production, add structured logging, monitoring (e.g., Sentry, Datadog), and consider sticky sessions or distributed state for real-time reliability.

---

**This file locks implementation decisions for phase 4. Downstream agents should not re-ask these unless requirements change.**
