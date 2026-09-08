import { ZONES } from "../config/constants.js";
export function createDashboardController(simulator, stream) {
  return {
    summary(req, res) {
      const zone =
        req.query.zone === undefined ? undefined : Number(req.query.zone);
      if (
        zone !== undefined &&
        (!Number.isInteger(zone) || zone < 0 || zone >= ZONES.length)
      ) {
        return res.status(400).json({ message: "Invalid zone" });
      }
      res.json(simulator.summary(zone));
    },
    alerts(req, res) {
      res.json({ timestamp: Date.now(), alerts: simulator.alerts });
    },
    acknowledgeAlert(req, res) {
      const alert = simulator.alerts.find(
        (alert) => alert.id === req.params.id,
      );
      if (!alert)
        return res.status(404).json({ message: "Alert no longer available" });
      alert.acknowledged = true;
      res.json(alert);
    },
    stream(req, res) {
      stream.connect(req, res);
    },
  };
}
