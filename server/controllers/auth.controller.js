import { SESSION_COOKIE } from "../config/constants.js";
import {
  getSessionToken,
  sessionCookieOptions,
} from "../utils/session-cookie.js";
export function createAuthController(sessions, sessionMs) {
  return {
    login(req, res) {
      if (!sessions.verifyCredentials(req.body?.email, req.body?.password)) {
        return res
          .status(401)
          .json({ message: "Check your email and password." });
      }
      const { token, session } = sessions.create();
      res
        .cookie(SESSION_COOKIE, token, sessionCookieOptions(sessionMs))
        .json(session);
    },
    logout(req, res) {
      sessions.revoke(getSessionToken(req));
      res.clearCookie(SESSION_COOKIE, { path: "/" }).json({ ok: true });
    },
    currentSession(req, res) {
      res.json(req.session);
    },
  };
}
