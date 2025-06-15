"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/store/projectStore";
import { CreateProjectForm } from "@/components/create-project-form";
import { ProjectList } from "@/components/project-list";

export default function Home() {
  const { projects, selectedProjectId, fetchProjects, isLoading, error } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  if (selectedProjectId) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Welcome to Project: {selectedProject?.name}</h1>
        {/* Placeholder for the main dashboard content */}
        <p>This is where the main project dashboard will be displayed.</p>
        <p>You can navigate to different sections from here.</p>
      </div>
    );
  }

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
