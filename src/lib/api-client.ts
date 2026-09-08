import { useDashboardStore } from "../stores/dashboard.store";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch("/api" + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (res.status === 401 && !path.includes("/login")) {
    useDashboardStore.getState().clear();
    throw Error("Session expired. Please sign in again.");
  }
  const data = await res.json();
  if (!res.ok) throw Error(data.message || "Request failed");
  return data;
}
