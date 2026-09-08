import { randomBytes, timingSafeEqual } from "node:crypto";
import { DEMO_USER, DEMO_PASSWORD } from "../config/constants.js";
const matches = (value, expected) =>
  typeof value === "string" &&
  Buffer.byteLength(value) === Buffer.byteLength(expected) &&
  timingSafeEqual(Buffer.from(value), Buffer.from(expected));

// Each application instance owns its sessions; no shared global mutable state.
export function createSessionService(sessionMs) {
  const sessions = new Map();
  return {
    verifyCredentials(email, password) {
      return (
        matches(email, DEMO_USER.email) && matches(password, DEMO_PASSWORD)
      );
    },
    create() {
      const token = randomBytes(32).toString("hex");
      const createdAt = Date.now();
      const session = {
        user: { ...DEMO_USER },
        createdAt,
        expiresAt: createdAt + sessionMs,
      };
      sessions.set(token, session);
      return { token, session };
    },
    get(token) {
      const session = sessions.get(token);
      if (!session || session.expiresAt <= Date.now()) {
        sessions.delete(token);
        return null;
      }
      return session;
    },
    revoke(token) {
      sessions.delete(token);
    },
    prune() {
      for (const [token, session] of sessions) {
        if (session.expiresAt <= Date.now()) sessions.delete(token);
      }
    },
  };
}
