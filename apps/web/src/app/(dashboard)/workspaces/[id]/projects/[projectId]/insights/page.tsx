"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AiDashboard } from "@/features/ai/insights/components/ai-dashboard";

export default function InsightsPage() {
  const { projectId } = useParams() as { projectId: string };

  return (
    <div className="p-6">
      <AiDashboard projectId={projectId} />
    </div>
  );
}
