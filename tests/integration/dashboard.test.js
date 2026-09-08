import test from "node:test";
import assert from "node:assert/strict";
import { fixture } from "../helpers/server-fixture.js";
test("authentication protects APIs, rejects invalid credentials and revokes sessions on logout", async () => {
  const f = await fixture();
  try {
    for (const p of [
      "/dashboard/summary",
      "/dashboard/alerts",
      "/dashboard/stream",
      "/auth/session",
    ])
      assert.equal((await f.request(p)).status, 401);
    assert.equal(
      (
        await f.request("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "bad", password: "bad" }),
        })
      ).status,
      401,
    );
    const cookie = await f.login(),
      headers = { cookie };
    assert.equal((await f.request("/auth/session", { headers })).status, 200);
    assert.equal(
      (await f.request("/dashboard/summary?zone=99", { headers })).status,
      400,
    );
    const summary = await (
      await f.request("/dashboard/summary", { headers })
    ).json();
    assert.ok(summary.averages);
    assert.ok(summary.deltas);
    const data = await (
      await f.request("/dashboard/alerts", { headers })
    ).json();
    assert.ok(data.alerts.length);
    const alert = await (
      await f.request("/dashboard/alerts/" + data.alerts[0].id, {
        method: "PATCH",
        headers,
      })
    ).json();
    assert.equal(alert.acknowledged, true);
    await f.request("/auth/logout", { method: "POST", headers });
    assert.equal(
      (await f.request("/dashboard/summary", { headers })).status,
      401,
    );
  } finally {
    await f.close();
  }
});
test("stream sends multiple frames and expires existing connections", async () => {
  const f = await fixture({ sessionMs: 180, tickMs: 25 });
  try {
    const cookie = await f.login();
    const response = await f.request("/dashboard/stream", {
      headers: { cookie },
    });
    assert.match(response.headers.get("content-type"), /text\/event-stream/);
    const output = await response.text();
    assert.ok((output.match(/sequence/g) || []).length >= 2);
    assert.match(output, /event: expired/);
    assert.equal(
      (await f.request("/dashboard/summary", { headers: { cookie } })).status,
      401,
    );
  } finally {
    await f.close();
  }
});
