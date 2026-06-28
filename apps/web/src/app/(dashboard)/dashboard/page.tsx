import React from "react";
import { Dashboard } from "@/features/dashboard/components/Dashboard";

export const metadata = {
  title: "Dashboard | VertexPM",
  description: "View your boards and activity",
};

export default function DashboardPage() {
  return <Dashboard />;
}
