"use client";

import { useEffect, use } from "react";
import { MainDashboardLayout } from "@/components/main-dashboard-layout";
import { useQuestionStore } from "@/store/questionStore";
import { AddBigQuestionForm } from "@/components/add-big-question-form";
import { QuestionTreeView } from "@/components/question-tree-view";

interface QuestionsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function QuestionsPage(props: QuestionsPageProps) {
  const params = use(props.params);
  const { projectId } = params;
  const { fetchBigQuestions, fetchResearchQuestions, isLoading, error } = useQuestionStore();

  useEffect(() => {
    if (projectId) {
      fetchBigQuestions(projectId);
      fetchResearchQuestions(projectId);
    }
  }, [projectId, fetchBigQuestions, fetchResearchQuestions]);

  return (
    <MainDashboardLayout projectId={projectId}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Research Questions</h1>
        <div className="flex justify-end mb-4">
          <AddBigQuestionForm projectId={projectId} />
        </div>
        {isLoading && <div className="text-center">Loading questions...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        <QuestionTreeView projectId={projectId} />
      </div>
    </MainDashboardLayout>
  );
}
