# 2-CONTEXT.md

## Phase 2: Host Reconnection & Robustness — Implementation Decisions

### 1. Host Reconnection Logic
- **Reconnection Mechanism:** Host reconnection is managed by storing the game PIN in sessionStorage (`hostGamePin`). On reconnect, the frontend attempts to rejoin as host using this PIN. The backend identifies the host by a special `host_id` and `isHost` flag.
- **WebSocket Handling:** The `useGameSocket` hook implements automatic WebSocket reconnection. If the host disconnects and reconnects, the backend updates the host's connection status and reattaches the session to the correct game.
- **Edge Cases:** If the host's session is lost (e.g., browser closed), reconnection is only possible if the PIN is retained. If the PIN is lost, the game cannot be resumed by the original host.

### 2. Game State Persistence and Recovery
- **Database Persistence:** All game state (games, players, questions, answers, scores) is persisted in PostgreSQL using the `query` and `queryOne` helpers. On reconnect, the backend loads the latest state from the database.
- **Recovery:** If the server restarts, the game state can be recovered from the database, allowing both host and players to reconnect and resume the game.

### 3. Player Disconnect/Reconnect Handling
- **Player Disconnect:** When a player disconnects (WebSocket close), the backend marks them as `is_connected = false` in the database and broadcasts a `player_left` event.
- **Player Reconnect:** If a player rejoins with the same name and game PIN, their `is_connected` status is set to true, and they are re-added to the game state.

### 4. Security for Host Reconnection
- **Current State:** Host reconnection is based solely on possession of the correct PIN and session context. There is no additional authentication or token for host identity.
- **Risks:** If a PIN is leaked, another user could potentially take over as host. This is a known limitation and should be addressed in future phases (e.g., with host tokens or authentication).

### 5. Database Transaction/Consistency Strategies
- **Atomicity:** All state changes (player join/leave, answer submission, game progress) are performed via SQL queries. There is no explicit transaction management for multi-step updates, so partial failures could cause inconsistencies.
- **Recommendation:** For robustness, consider wrapping multi-step updates (e.g., game end, mass disconnects) in database transactions to ensure atomicity.

---

**This file locks implementation decisions for phase 2. Downstream agents should not re-ask these unless requirements change.**
