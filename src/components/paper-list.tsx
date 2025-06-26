"use client";

import { usePaperStore } from "@/store/paperStore";
import { Button, Modal } from "antd";
import Link from "next/link";
import { Table } from "antd";
import { toast } from "@/components/ui/sonner";

interface PaperListProps {
  projectId: string;
}

export function PaperList({ projectId }: PaperListProps) {
  const { papers, deletePaper, isLoading, error } = usePaperStore();

  const showDeleteConfirm = (paperId: string, paperTitle: string) => {
    Modal.confirm({
      title: "Are you absolutely sure?",
      content: `This action cannot be undone. This will permanently delete the paper "${paperTitle}" and any associated answers or relationships.`,
      okText: "Continue",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deletePaper(projectId, paperId);
        if (error) {
          toast.error("Error deleting paper", {
            description: error,
          });
        } else {
          toast.success("Paper deleted successfully!", {
            description: `Paper "${paperTitle}" has been removed.`,
          });
        }
      },
    });
  };

  if (isLoading && papers.length === 0) {
    return <div className="text-center py-8">Loading papers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (papers.length === 0) {
    return <div className="text-center py-8 text-gray-500">No papers found for this project. Add one to get started!</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Papers in this Project</h2>
      <Table
        dataSource={papers}
        rowKey="id"
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            className: "font-medium",
          },
          {
            title: "Authors",
            dataIndex: "authors",
            key: "authors",
          },
          {
            title: "Year",
            dataIndex: "publicationYear",
            key: "publicationYear",
          },
          {
            title: "Link",
            dataIndex: "link",
            key: "link",
            render: (text: string) =>
              text ? (
                <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Link
                </a>
              ) : (
                "-"
              ),
          },
          {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
            className: "max-w-[200px] truncate",
            render: (text: string) => text || "-",
          },
          {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, paper) => (
              <div className="space-x-2">
                <Link href={`/dashboard/${projectId}/papers/${paper.id}`} passHref>
                  <Button>View</Button>
                </Link>
                <Link href={`/dashboard/${projectId}/papers/${paper.id}/edit`} passHref>
                  <Button>Edit</Button>
                </Link>
                <Button
                  danger
                  onClick={() => showDeleteConfirm(paper.id, paper.title)}
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
