"use client";

import { useProjectStore } from "@/store/projectStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  projectName: string;
}

export function DashboardHeader({ projectName }: DashboardHeaderProps) {
  const { selectProject } = useProjectStore();
  const router = useRouter();

  const handleChangeProject = () => {
    selectProject(null); // Deselect current project
    // router.push("/"); // Redirect to project selection page
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">Project: {projectName}</h1>
      <Button onClick={handleChangeProject} variant="outline">
        Change Project
      </Button>
    </header>
  );
}
