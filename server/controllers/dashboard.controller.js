import { COINS } from "../config/constants.js";
export function createDashboardController(simulator, stream) {
  return {
    summary(req, res) {
      const coin = req.query.coin;
      if (
        coin !== undefined &&
        (typeof coin !== "string" || !COINS.some((c) => c.id === coin))
      ) {
        return res
          .status(400)
          .json({ message: "Invalid coin; use BTC, ETH, or DOGE" });
      }
      res.json(simulator.summary(coin));
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
