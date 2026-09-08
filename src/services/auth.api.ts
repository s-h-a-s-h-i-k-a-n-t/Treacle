import { apiRequest } from "../lib/api-client";
import type { Session } from "../types/session";
export const authApi = {
  login(email: string, password: string) {
    return apiRequest<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  session() {
    return apiRequest<Session>("/auth/session");
  },
  logout() {
    return apiRequest<{ ok: boolean }>("/auth/logout", { method: "POST" });
  },
};
