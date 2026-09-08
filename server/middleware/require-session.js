import { getSessionToken } from "../utils/session-cookie.js";
export function requireSession(sessions) {
  return (req, res, next) => {
    const session = sessions.get(getSessionToken(req));
    if (!session)
      return res
        .status(401)
        .json({ message: "Your session has expired. Please sign in again." });
    req.session = session;
    next();
  };
}
