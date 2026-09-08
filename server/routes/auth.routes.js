import { Router } from "express";
export function createAuthRouter(controller, authorize) {
  const router = Router();
  router.post("/login", controller.login);
  router.post("/logout", controller.logout);
  router.get("/session", authorize, controller.currentSession);
  return router;
}
