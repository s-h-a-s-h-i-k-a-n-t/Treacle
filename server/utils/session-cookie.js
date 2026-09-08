import { SESSION_COOKIE } from "../config/constants.js";
export function getSessionToken(req) {
  return (req.headers.cookie || "")
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
}
export function sessionCookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge,
    path: "/",
  };
}
