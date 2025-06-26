"use client";;
import { use } from "react";

import { MainDashboardLayout } from "@/components/main-dashboard-layout";

interface DashboardPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function DashboardPage(props: DashboardPageProps) {
  const params = use(props.params);
  const { projectId } = params;

  return (
    <MainDashboardLayout projectId={projectId}>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h2>
        <p className="text-lg text-gray-600">Select a section from the sidebar to get started.</p>
      </div>
    </MainDashboardLayout>
  );
}
