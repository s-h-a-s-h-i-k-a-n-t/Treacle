import {
  Bell,
  ChevronRight,
  Radio,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { navigationItems } from "../../config/navigation";
import { useDashboardStore } from "../../stores/dashboard.store";
import { Brand } from "../ui/Brand";

export function DashboardLayout() {
  const { session, alerts, error } = useDashboardStore();
  if (!session) return <Navigate to="/login" replace />;
  const count = alerts.filter((a) => !a.acknowledged).length;
  return (
    <div className="shell">
      <aside>
        <Brand />
        <div className="workspace">
          <span className="workspace-icon">
            <Warehouse size={20} />
          </span>
          <div>
            <strong>Northside warehouse</strong>
            <small>Chicago, IL · WH-001</small>
          </div>
        </div>
        <span className="nav-label">WORKSPACE</span>
        <nav>
          {navigationItems.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} end>
              <Icon size={19} />
              {label}
              {label === "Alerts" && count > 0 && (
                <b className="nav-count">{count}</b>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="simulation">
            <Radio size={18} />
            <strong>Simulation running</strong>
            <small>Sensor readings update every 2s</small>
          </div>
          <NavLink to="/profile" className="user">
            <span className="avatar">AM</span>
            <div>
              <strong>Alex Morgan</strong>
              <small>Warehouse operator</small>
            </div>
            <ChevronRight size={16} />
          </NavLink>
        </div>
      </aside>
      <div className="main">
        <header>
          <div className="breadcrumb">
            Workspace <ChevronRight size={13} />
            <span>Northside warehouse</span>
          </div>
          <div className="header-right">
            <span className="demo-tag">DEMO ENVIRONMENT</span>
            <NavLink
              to="/alerts"
              aria-label="View alerts"
              className="icon-button"
            >
              <Bell size={19} />
              {count > 0 && <i />}
            </NavLink>
            <NavLink
              to="/profile"
              aria-label="View profile"
              className="avatar small"
            >
              AM
            </NavLink>
          </div>
        </header>
        <main>
          {error && (
            <div role="alert" className="error banner">
              Unable to refresh summaries: {error}. Retrying automatically.
            </div>
          )}
          <Outlet />
        </main>
        <footer>
          <span>
            <ShieldCheck size={13} /> Sentry warehouse intelligence
          </span>
          <span>
            WH-001 <i /> Simulated sensor network
          </span>
        </footer>
      </div>
    </div>
  );
}
