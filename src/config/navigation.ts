import { Bell, LayoutDashboard, Settings, TrendingUp } from "lucide-react";
export const navigationItems = [
  { path: "/", icon: LayoutDashboard, label: "Overview" },
  { path: "/analytics", icon: TrendingUp, label: "Analytics" },
  { path: "/alerts", icon: Bell, label: "Alerts" },
  { path: "/settings", icon: Settings, label: "Settings" },
];
