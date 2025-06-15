"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useProjectStore } from "@/store/projectStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface MainDashboardLayoutProps {
  projectId: string;
  children: React.ReactNode;
}

export function MainDashboardLayout({ projectId, children }: MainDashboardLayoutProps) {
  const { projects, selectedProjectId, selectProject, fetchProjects, isLoading, error } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    // console.log("called")
    // If no project is selected in store but we have a projectId from URL, select it
    if (projectId && !selectedProjectId) {
      selectProject(projectId);
    }
    // If projects are not loaded, fetch them
    if (projects.length === 0 && !isLoading && !error) {
      fetchProjects();
    }
  }, [projectId, selectedProjectId, selectProject, projects.length, fetchProjects, isLoading, error]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Redirect to home if no project is selected or found
  useEffect(() => {
    if (!selectedProjectId && !isLoading && !error && projects.length > 0) {
      router.push("/");
    }
  }, [selectedProjectId, isLoading, error, projects.length, router]);


  if (isLoading && !selectedProject) {
    return <div className="text-center py-10">Loading project details...</div>;
  }

  if (error && !selectedProject) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!selectedProject) {
    return <div className="text-center py-10">Project not found or not selected. Redirecting...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader projectName={selectedProject.name} />
      <div className="flex flex-1">
        <DashboardSidebar projectId={projectId} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
