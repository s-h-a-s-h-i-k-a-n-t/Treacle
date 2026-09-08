import { ChevronRight, ShieldCheck, Warehouse } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Brand } from "../../../components/ui/Brand";
import { authApi } from "../../../services/auth.api";
import { useDashboardStore } from "../../../stores/dashboard.store";

export function LoginPage() {
  const { session, set } = useDashboardStore();
  const [email, setEmail] = useState("demo@sentry.app"),
    [password, setPassword] = useState("Warehouse123!"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (session) return <Navigate to="/" replace />;
  return (
    <div className="login">
      <div className="login-story">
        <Brand />
        <div>
          <span className="eyebrow">WAREHOUSE INTELLIGENCE</span>
          <h1>
            Every zone.
            <br />
            Every signal.
            <br />
            <em>In sync.</em>
          </h1>
          <p>
            A clearer view of your operations, from the receiving dock to the
            last dispatch.
          </p>
          <div className="login-grid">
            {["Receiving", "Storage", "Packing", "Dispatch"].map((z, i) => (
              <div key={z}>
                <Warehouse size={30} />
                <span>
                  0{i + 1} / {z}
                </span>
                <i className="dot" />
              </div>
            ))}
          </div>
        </div>
        <small>CONNECTED OPERATIONS. CONFIDENT DECISIONS.</small>
      </div>
      <div className="login-form">
        <span className="eyebrow">WELCOME TO SENTRY</span>
        <h2>Your operations, at a glance.</h2>
        <p>Sign in to your warehouse command center.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              set({
                session: await authApi.login(email, password),
              });
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Email address
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in to dashboard"}
            <ChevronRight size={17} />
          </button>
        </form>
        <div className="demo">
          <ShieldCheck size={20} />
          <div>
            <strong>Ready to explore</strong>
            <p>Demo credentials are filled in. Sessions last 30 minutes.</p>
            <code>demo@sentry.app · Warehouse123!</code>
          </div>
        </div>
        <small>Simulated warehouse data · Full-stack assessment</small>
      </div>
    </div>
  );
}
