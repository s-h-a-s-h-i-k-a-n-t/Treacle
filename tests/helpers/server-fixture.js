import assert from "node:assert/strict";
import { createApp } from "../../server/app.js";
export async function fixture(options = {}) {
  const service = createApp(options);
  const server = service.app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const request = (path, options = {}) => fetch(base + path, options);
  const login = async () => {
    const response = await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@sentry.app",
        password: "Warehouse123!",
      }),
    });
    assert.equal(response.status, 200);
    return response.headers.get("set-cookie").split(";")[0];
  };
  return {
    request,
    login,
    close: async () => {
      service.close();
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
    },
  };
}
