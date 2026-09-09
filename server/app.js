import express from "express";
import {
  SESSION_DURATION_MS,
  TELEMETRY_INTERVAL_MS,
} from "./config/constants.js";
import { createAuthController } from "./controllers/auth.controller.js";
import { createDashboardController } from "./controllers/dashboard.controller.js";
import { requireSession } from "./middleware/require-session.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { createDashboardRouter } from "./routes/dashboard.routes.js";
import { createSessionService } from "./services/session.service.js";
import { createSimulator } from "./services/simulator.service.js";
import { createStreamService } from "./services/stream.service.js";

// Composition root: dependencies are created once and injected into routes/services.
export function createApp({
  sessionMs = SESSION_DURATION_MS,
  tickMs = TELEMETRY_INTERVAL_MS,
} = {}) {
  const app = express();
  const sessions = createSessionService(sessionMs);
  const simulator = createSimulator();
  const stream = createStreamService(simulator, sessions, tickMs);
  const authorize = requireSession(sessions);
  app.use(express.json({ limit: "10kb" }));
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use(
    ["/api/auth", "/auth"],
    createAuthRouter(createAuthController(sessions, sessionMs), authorize),
  );
  app.use(
    ["/api/dashboard", "/dashboard"],
    createDashboardRouter(
      createDashboardController(simulator, stream),
      authorize,
    ),
  );
  app.use(["/api", "/"], (req, res) =>
    res.status(404).json({ message: "Endpoint not found" }),
  );
  return { app, close: stream.close, simulator };
}
