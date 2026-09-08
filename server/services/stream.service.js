import { getSessionToken } from "../utils/session-cookie.js";
export function createStreamService(simulator, sessions, tickMs) {
  const clients = new Set();
  const sendFrame = (res, frame) =>
    res.write(`data: ${JSON.stringify(frame)}\n\n`);
  const timer = setInterval(() => {
    const frame = simulator.tick();
    for (const client of clients) {
      if (!sessions.get(client.token)) {
        client.res.write("event: expired\ndata: {}\n\n");
        client.res.end();
        clients.delete(client);
      } else sendFrame(client.res, frame);
    }
    sessions.prune();
  }, tickMs);
  timer.unref();
  return {
    connect(req, res) {
      res.set({
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });
      res.flushHeaders();
      sendFrame(res, simulator.history.at(-1));
      const client = { res, token: getSessionToken(req) };
      clients.add(client);
      req.on("close", () => clients.delete(client));
    },
    close() {
      clearInterval(timer);
      for (const client of clients) client.res.end();
      clients.clear();
    },
  };
}
