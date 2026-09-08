import { Bell, ChevronRight, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { PageHeading } from "../../../components/ui/PageHeading";
import { Status } from "../../../components/ui/Status";
import { formatTime } from "../../../lib/format-time";
import { dashboardApi } from "../../../services/dashboard.api";
import { useDashboardStore } from "../../../stores/dashboard.store";
import type { Alert } from "../../../types/warehouse";

export function AlertsPage() {
  const { alerts, pollTime, set } = useDashboardStore();
  const [severity, setSeverity] = useState("all"),
    [search, setSearch] = useState(""),
    [detail, setDetail] = useState<Alert | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const filtered = alerts.filter(
    (a) =>
      (severity === "all" || a.severity === severity) &&
      (a.zone + " " + a.title).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="STAY ONE STEP AHEAD"
        title="Alerts & events"
        description="Threshold-based alerts derived from warehouse telemetry."
      >
        <span className="subtle-badge">
          Last updated {formatTime(pollTime)}
        </span>
      </PageHeading>
      <div className="alert-summary">
        {[
          ["Open alerts", alerts.filter((a) => !a.acknowledged).length],
          [
            "Critical",
            alerts.filter((a) => a.severity === "CRITICAL" && !a.acknowledged)
              .length,
          ],
          ["Acknowledged", alerts.filter((a) => a.acknowledged).length],
        ].map(([l, v]) => (
          <div className="panel" key={l}>
            <span>{l}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="filter-bar">
          <label className="search">
            <Search size={17} />
            <input
              aria-label="Search alerts"
              placeholder="Search alerts or zones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="all">All severities</option>
            <option value="WARN">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        {filtered.map((a) => (
          <button
            className="alert-row"
            key={a.id}
            onClick={() => {
              setDetail(a);
              setError("");
            }}
          >
            <span className={"alert-icon " + a.severity.toLowerCase()}>
              <Bell size={18} />
            </span>
            <div>
              <strong>{a.title}</strong>
              <p>
                {a.zone} <span>·</span> {a.value} °C measured / {a.threshold} °C
                threshold
              </p>
            </div>
            <div className="alert-meta">
              <Status value={a.severity} />
              <small>
                {formatTime(a.timestamp)}
                {a.acknowledged ? " · Acknowledged" : ""}
              </small>
            </div>
            <ChevronRight size={16} />
          </button>
        ))}
        {!filtered.length && (
          <div className="empty">
            <ShieldCheck />
            <h3>No matching alerts</h3>
            <p>Try another filter, or wait for the next refresh.</p>
          </div>
        )}
      </section>
      {detail && (
        <Modal title="Alert details" onClose={() => setDetail(null)}>
          <Status value={detail.severity} />
          <h3>{detail.title}</h3>
          <p>
            {detail.zone} reported {detail.value} °C at{" "}
            {formatTime(detail.timestamp)}, above its {detail.threshold} °C
            warning threshold.
          </p>
          <p>
            Acknowledging records that this alert has been reviewed. New
            threshold transitions will still generate alerts.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button
            className="primary"
            disabled={detail.acknowledged || busy}
            onClick={async () => {
              setBusy(true);
              try {
                const updated = await dashboardApi.acknowledgeAlert(detail.id);
                if (useDashboardStore.getState().session) {
                  set({
                    alerts: useDashboardStore
                      .getState()
                      .alerts.map((a) => (a.id === updated.id ? updated : a)),
                  });
                  setDetail(updated);
                }
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {detail.acknowledged
              ? "Acknowledged"
              : busy
                ? "Saving…"
                : "Acknowledge alert"}
          </button>
        </Modal>
      )}
    </>
  );
}
