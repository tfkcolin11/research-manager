"use client";

import { useEffect, use } from "react";
import { MainDashboardLayout } from "@/components/main-dashboard-layout";
import { useRelationshipStore } from "@/store/relationshipStore";
import { AddRelationshipForm } from "@/components/add-relationship-form";
import { RelationshipList } from "@/components/relationship-list";

interface RelationshipsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function RelationshipsPage(props: RelationshipsPageProps) {
  const params = use(props.params);
  const { projectId } = params;
  const { fetchRelationships, isLoading, error } = useRelationshipStore();

  useEffect(() => {
    if (projectId) {
      fetchRelationships(projectId);
    }
  }, [projectId, fetchRelationships]);

  return (
    <MainDashboardLayout projectId={projectId}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Paper Relationships</h1>
        <div className="flex justify-end mb-4">
          <AddRelationshipForm projectId={projectId} />
        </div>
        {isLoading && <div className="text-center">Loading relationships...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        <RelationshipList projectId={projectId} />
      </div>
    </MainDashboardLayout>
  );
}
