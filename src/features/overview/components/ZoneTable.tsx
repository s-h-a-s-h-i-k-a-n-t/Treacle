import { ChevronRight, Radio, Warehouse } from "lucide-react";
import { Status } from "../../../components/ui/Status";
import type { Reading } from "../../../types/warehouse";
export function ZoneTable({
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
            Warehouse zones <span className="count">{rows.length}</span>
          </h2>
          <p>Explore individual zones and their latest readings.</p>
        </div>
        <span className="subtle-badge">
          <Radio size={12} /> Connected sensors
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ZONE</th>
              <th>TEMPERATURE</th>
              <th>HUMIDITY</th>
              <th>POWER</th>
              <th>STATUS</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <button className="zone-button" onClick={() => onSelect(r)}>
                    <span className="zone-icon">
                      <Warehouse size={18} />
                    </span>
                    <div>
                      <strong>{r.name}</strong>
                      <small>ZONE 0{r.id + 1}</small>
                    </div>
                  </button>
                </td>
                <td>
                  {r.temperature} <span>°C</span>
                </td>
                <td>
                  {r.humidity} <span>%</span>
                </td>
                <td>
                  {r.power} <span>kW</span>
                </td>
                <td>
                  <Status value={r.status} />
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={"Details for " + r.name}
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
          <div className="empty">Connecting to warehouse sensors…</div>
        )}
      </div>
    </section>
  );
}
