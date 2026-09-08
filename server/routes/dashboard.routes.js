import { Router } from "express";
export function createDashboardRouter(controller, authorize) {
  const router = Router();
  router.use(authorize);
  router.get("/summary", controller.summary);
  router.get("/alerts", controller.alerts);
  router.patch("/alerts/:id", controller.acknowledgeAlert);
  router.get("/stream", controller.stream);
  return router;
}
