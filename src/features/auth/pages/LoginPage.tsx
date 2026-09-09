import { ChevronRight, ShieldCheck, Coins } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Brand } from "../../../components/ui/Brand";
import { authApi } from "../../../services/auth.api";
import { useDashboardStore } from "../../../stores/dashboard.store";

export function LoginPage() {
  const { session, set } = useDashboardStore();
  const [email, setEmail] = useState("demo@sentry.app"),
    [password, setPassword] = useState("Crypto123!"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (session) return <Navigate to="/" replace />;
  return (
    <div className="login">
      <div className="login-story">
        <Brand />
        <div>
          <span className="eyebrow">CRYPTO MARKET SIMULATOR</span>
          <h1>
            Every coin.
            <br />
            Every signal.
            <br />
            <em>In sync.</em>
          </h1>
          <p>
            Follow Bitcoin, Ethereum, and Dogecoin through live prices, market
            activity, and spread alerts.
          </p>
          <div className="login-grid">
            {["Bitcoin", "Ethereum", "Dogecoin"].map((z, i) => (
              <div key={z}>
                <Coins size={30} />
                <span>
                  0{i + 1} / {z}
                </span>
                <i className="dot" />
              </div>
            ))}
          </div>
        </div>
        <small>SIMULATED MARKETS. REAL-TIME INSIGHTS.</small>
      </div>
      <div className="login-form">
        <span className="eyebrow">WELCOME TO SENTRY</span>
        <h2>Your markets, at a glance.</h2>
        <p>Sign in to your crypto market simulator.</p>
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
            <code>demo@sentry.app · Crypto123!</code>
          </div>
        </div>
        <small>Simulated crypto data · Full-stack assessment</small>
      </div>
    </div>
  );
}
