import { CircleHelp, Pause, Play } from "lucide-react";
import { PageHeading } from "../../../components/ui/PageHeading";
import { usePreferencesStore } from "../../../stores/preferences.store";

export function SettingsPage() {
  const p = usePreferencesStore();
  return (
    <>
      <PageHeading
        eyebrow="MAKE IT YOURS"
        title="Settings & preferences"
        description="Tune your monitoring experience. Preferences are saved on this device."
      />
      <section className="panel settings-panel">
        <h2>Display & updates</h2>
        <div className="setting">
          <div>
            <strong>Dark appearance</strong>
            <p>A low-light theme across your entire workspace.</p>
          </div>
          <button
            role="switch"
            aria-checked={p.dark}
            aria-label="Dark appearance"
            className={"switch " + (p.dark ? "on" : "")}
            onClick={() => p.set({ dark: !p.dark })}
          >
            <span />
          </button>
        </div>
        <div className="setting">
          <div>
            <strong>Summary refresh interval</strong>
            <p>Controls polling for analytics and derived alerts.</p>
          </div>
          <select
            aria-label="Summary refresh interval"
            value={p.interval}
            onChange={(e) => p.set({ interval: Number(e.target.value) })}
          >
            {[5, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n} seconds
              </option>
            ))}
          </select>
        </div>
        <div className="setting">
          <div>
            <strong>Live market updates</strong>
            <p>Pause incoming market updates. Backend generation continues.</p>
          </div>
          <button onClick={() => p.set({ paused: !p.paused })}>
            {p.paused ? <Play size={16} /> : <Pause size={16} />}{" "}
            {p.paused ? "Resume" : "Pause"}
          </button>
        </div>
      </section>
      <div className="info-box">
        <CircleHelp size={22} />
        <div>
          <strong>Two independent data paths</strong>
          <p>
            Live telemetry streams every 2 seconds. Analytics and alerts use
            periodic API requests, so they keep refreshing even when live market
            updates are paused.
          </p>
        </div>
      </div>
    </>
  );
}
