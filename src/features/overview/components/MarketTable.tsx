import { ChevronRight, Coins } from "lucide-react";
import { Status } from "../../../components/ui/Status";
import { formatMetric } from "../../../config/metrics";
import type { Reading } from "../../../types/market";
export function MarketTable({
  rows,
  onSelect,
}: {
  rows: Reading[];
  onSelect: (reading: Reading) => void;
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>
            Market watchlist <span className="count">{rows.length}</span>
          </h2>
          <p>Bitcoin, Ethereum, and Dogecoin · click for a snapshot.</p>
        </div>
        <span className="subtle-badge">Simulated markets</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>COIN</th>
              <th>PRICE (USD)</th>
              <th>VOLUME · 60s</th>
              <th>SPREAD</th>
              <th>STATUS</th>
              <th>EVENT</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <button className="coin-button" onClick={() => onSelect(r)}>
                    <span className="coin-icon">
                      <Coins size={18} />
                    </span>
                    <div>
                      <strong>{r.name}</strong>
                      <small>{r.id} / USD</small>
                    </div>
                  </button>
                </td>
                <td>${formatMetric(r.price, "price", r.id)}</td>
                <td>
                  {formatMetric(r.volume, "volume", r.id)} <span>{r.id}</span>
                </td>
                <td>
                  {formatMetric(r.spread, "spread", r.id)} <span>%</span>
                </td>
                <td>
                  <Status value={r.status} />
                </td>
                <td>
                  <span className={"event-badge " + r.event.toLowerCase()}>
                    {r.event}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`Details for ${r.name}`}
                    onClick={() => onSelect(r)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty">
            Waiting for market updates. Resume the live feed if paused.
          </div>
        )}
      </div>
    </section>
  );
}
