import { createHmac, timingSafeEqual } from "node:crypto";
import { DEMO_USER, DEMO_PASSWORD } from "../config/constants.js";

const SECRET = process.env.SESSION_SECRET || "sentry-crypto-demo-secret-2026";

const matches = (value, expected) =>
  typeof value === "string" &&
  Buffer.byteLength(value) === Buffer.byteLength(expected) &&
  timingSafeEqual(Buffer.from(value), Buffer.from(expected));

const sign = (data) => {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const hmac = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${hmac}`;
};

const verify = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, hmac] = token.split(".");
  const expectedHmac = createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  if (
    Buffer.byteLength(hmac) !== Buffer.byteLength(expectedHmac) ||
    !timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
};

export function createSessionService(sessionMs) {
  const sessions = new Map();
  const revoked = new Set();

  return {
    verifyCredentials(email, password) {
      return (
        matches(email, DEMO_USER.email) && matches(password, DEMO_PASSWORD)
      );
    },
    create() {
      const createdAt = Date.now();
      const session = {
        user: { ...DEMO_USER },
        createdAt,
        expiresAt: createdAt + sessionMs,
      };
      const token = sign(session);
      sessions.set(token, session);
      return { token, session };
    },
    get(token) {
      if (!token || revoked.has(token)) return null;
      let session = sessions.get(token);
      if (!session) {
        session = verify(token);
        if (session) sessions.set(token, session);
      }
      if (!session || session.expiresAt <= Date.now()) {
        sessions.delete(token);
        return null;
      }
      return session;
    },
    revoke(token) {
      sessions.delete(token);
      if (token) revoked.add(token);
    },
    prune() {
      for (const [token, session] of sessions) {
        if (session.expiresAt <= Date.now()) sessions.delete(token);
      }
    },
  };
}
