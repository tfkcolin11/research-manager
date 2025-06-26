"use client";

import { useProjectStore } from "@/store/projectStore";
import { Button, Modal } from "antd";
import { Table } from "antd";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

export function ProjectList() {
  const { projects, selectProject, deleteProject, isLoading, error } = useProjectStore();
  const router = useRouter();

  const showDeleteConfirm = (id: string, name: string) => {
    Modal.confirm({
      title: "Are you absolutely sure?",
      content: `This action cannot be undone. This will permanently delete the project "${name}" and remove all associated papers, research questions, answers, and relationships.`,
      okText: "Continue",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteProject(id);
        if (error) {
          toast.error("Error deleting project", {
            description: error,
          });
        } else {
          toast.success("Project deleted successfully!", {
            description: `Project "${name}" has been removed.`,
          });
        }
      },
    });
  };

  if (isLoading && projects.length === 0) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
      <Table
        dataSource={projects}
        rowKey="id"
        columns={[
          {
            title: "Project Name",
            dataIndex: "name",
            key: "name",
            className: "font-medium",
          },
          {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, project) => (
              <div className="space-x-2">
                <Button
                  onClick={() => {
                    selectProject(project.id);
                    router.push(`/dashboard/${project.id}`);
                  }}
                >
                  Select
                </Button>
                <Button
                  danger
                  onClick={() => showDeleteConfirm(project.id, project.name)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        pagination={false}
      />
    </div>
  );
}