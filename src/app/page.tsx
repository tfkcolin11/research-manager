"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useProjectStore } from "@/store/projectStore";
import { CreateProjectForm } from "@/components/create-project-form";
import { ProjectList } from "@/components/project-list";

export default function Home() {
  const { projects, selectedProjectId, fetchProjects, isLoading, error } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // useEffect(() => {
  //   if (selectedProjectId) {
  //     router.push(`/dashboard/${selectedProjectId}`); // Redirect to dashboard
  //   }
  // }, [selectedProjectId, router]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Selection</h1>
      <div className="flex justify-center mb-8">
        <CreateProjectForm />
      </div>
      {isLoading && <div className="text-center">Loading projects...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      <ProjectList />
    </div>
  );
}
