"use client";

import { PaperDetailView } from "@/components/paper-detail-view";
import { MainDashboardLayout } from "@/components/main-dashboard-layout";

interface SinglePaperPageProps {
  params: {
    projectId: string;
    paperId: string;
  };
}

export default function SinglePaperPage({ params }: SinglePaperPageProps) {
  const { projectId, paperId } = params;

  return (
    <MainDashboardLayout projectId={projectId}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Paper Details</h1>
        <PaperDetailView projectId={projectId} paperId={paperId} />
      </div>
    </MainDashboardLayout>
  );
}
