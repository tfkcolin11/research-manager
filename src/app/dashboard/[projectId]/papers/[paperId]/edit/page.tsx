"use client";;
import { use } from "react";

import { useRouter } from "next/navigation";
import { EditPaperForm } from "@/components/edit-paper-form";
import { MainDashboardLayout } from "@/components/main-dashboard-layout";
import { toast } from "@/components/ui/sonner";

interface EditPaperPageProps {
  params: Promise<{
    projectId: string;
    paperId: string;
  }>;
}

export default function EditPaperPage(props: EditPaperPageProps) {
  const params = use(props.params);
  const { projectId, paperId } = params;
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect back to the paper detail view after successful edit
    router.push(`/dashboard/${projectId}/papers/${paperId}`);
  };

  return (
    <MainDashboardLayout projectId={projectId}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Edit Paper</h1>
        <EditPaperForm projectId={projectId} paperId={paperId} onSuccess={handleSuccess} />
      </div>
    </MainDashboardLayout>
  );
}
