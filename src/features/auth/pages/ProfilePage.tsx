import { LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeading } from "../../../components/ui/PageHeading";
import { formatTime } from "../../../lib/format-time";
import { authApi } from "../../../services/auth.api";
import { useDashboardStore } from "../../../stores/dashboard.store";

export function ProfilePage() {
  const { session, clear } = useDashboardStore();
  const [now, setNow] = useState(Date.now()),
    [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!session) return null;
  return (
    <>
      <PageHeading
        eyebrow="ACCOUNT & ACCESS"
        title="Your session"
        description="Review your operator profile and current workspace access."
      />
      <div className="profile-grid">
        <section className="panel profile-card">
          <span className="avatar large">AM</span>
          <h2>{session.user.name}</h2>
          <p>{session.user.role}</p>
          <span className="subtle-badge">Crypto markets</span>
          <div className="detail-row">
            <span>Email</span>
            <strong>{session.user.email}</strong>
          </div>
          <div className="detail-row">
            <span>Access</span>
            <strong>Crypto market monitoring</strong>
          </div>
        </section>
        <section className="panel session-card">
          <h2>
            <ShieldCheck size={20} /> Session activity
          </h2>
          <div className="detail-row">
            <span>Signed in</span>
            <strong>{formatTime(session.createdAt)}</strong>
          </div>
          <div className="detail-row">
            <span>Expires at</span>
            <strong>{formatTime(session.expiresAt)}</strong>
          </div>
          <div className="detail-row">
            <span>Time remaining</span>
            <strong>
              {Math.max(0, Math.ceil((session.expiresAt - now) / 60000))}{" "}
              minutes
            </strong>
          </div>
          <p>
            Your session expires automatically after 30 minutes. Dashboard
            connections close when you sign out or your session expires.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button
            className="danger"
            onClick={async () => {
              try {
                await authApi.logout();
                clear();
                navigate("/login");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </section>
      </div>
    </>
  );
}
