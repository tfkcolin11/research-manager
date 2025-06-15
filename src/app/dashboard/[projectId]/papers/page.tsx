"use client";

import { useEffect } from "react";
import { AddPaperForm } from "@/components/add-paper-form";
import { PaperList } from "@/components/paper-list";
import { usePaperStore } from "@/store/paperStore";
import { MainDashboardLayout } from "@/components/main-dashboard-layout";

interface PapersPageProps {
  params: {
    projectId: string;
  };
}

export default function PapersPage({ params }: PapersPageProps) {
  const { projectId } = params;
  const { fetchPapers, isLoading, error } = usePaperStore();

  useEffect(() => {
    if (projectId) {
      fetchPapers(projectId);
    }
  }, [projectId, fetchPapers]);

  return (
    <MainDashboardLayout projectId={projectId}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Paper Management</h1>
        <div className="flex justify-end mb-4">
          <AddPaperForm projectId={projectId} />
        </div>
        {isLoading && <div className="text-center">Loading papers...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        <PaperList projectId={projectId} />
      </div>
    </MainDashboardLayout>
  );
}
