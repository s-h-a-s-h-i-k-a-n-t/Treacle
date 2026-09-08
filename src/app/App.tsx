import { Box } from "lucide-react";
import { useAppBootstrap } from "../hooks/use-app-bootstrap";
import { useDashboardConnections } from "../hooks/use-dashboard-connections";
import { AppRoutes } from "./AppRoutes";
export function App() {
  const ready = useAppBootstrap();
  useDashboardConnections();
  if (!ready)
    return (
      <div className="boot">
        <Box /> Connecting to Sentry…
      </div>
    );
  return <AppRoutes />;
}
