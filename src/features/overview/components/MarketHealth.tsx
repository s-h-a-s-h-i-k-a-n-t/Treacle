import { Activity, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Frame } from "../../../types/market";
export function MarketHealth({ frame }: { frame: Frame | null }) {
  return (
    <section className="panel health">
      <div className="panel-heading">
        <div>
          <h2>Market conditions</h2>
          <p>Spread status across three coins</p>
        </div>
        <Activity size={19} />
      </div>
      <div
        className="health-ring"
        style={{
          background: `conic-gradient(#6d8961 0 ${(frame?.readings.filter((r) => r.status === "OK").length ?? 0) * (100 / 3)}%, #e6d3a0 0 100%)`,
        }}
      >
        <div>
          <strong>
            {frame?.readings.filter((r) => r.status === "OK").length ?? "—"}
            <small>/ 3</small>
          </strong>
          <span>coins within range</span>
        </div>
      </div>
      <div className="health-legend">
        <span>
          <i className="dot" /> Normal{" "}
          <b>{frame?.readings.filter((r) => r.status === "OK").length ?? 0}</b>
        </span>
        <span>
          <i className="dot amber" /> Attention{" "}
          <b>{frame?.readings.filter((r) => r.status !== "OK").length ?? 0}</b>
        </span>
      </div>
      <NavLink to="/alerts" className="text-link">
        Review market alerts <ChevronRight size={15} />
      </NavLink>
    </section>
  );
}
