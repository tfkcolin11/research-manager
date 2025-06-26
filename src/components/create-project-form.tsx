"use client";

import { useState } from "react";
import { useProjectStore } from "@/store/projectStore";
import { Button, Modal, Form, Input } from "antd";
import { toast } from "@/components/ui/sonner";

export function CreateProjectForm() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { createProject, isLoading, error } = useProjectStore();

  const handleSubmit = async (values: { projectName: string }) => {
    const { projectName } = values;
    if (!projectName.trim()) {
      toast.error("Project name cannot be empty.");
      return;
    }

    await createProject(projectName);

    if (error) {
      toast.error("Error creating project", {
        description: error,
      });
    } else {
      toast.success("Project created successfully!", {
        description: `Project "${projectName}" has been added.`,
      });
      form.resetFields();
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create New Project</Button>
      <Modal
        title="Create New Project"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p className="text-gray-500 mb-4">Enter a name for your new research project.</p>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="projectName"
            label="Project Name"
            rules={[{ required: true, message: "Project name is required." }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create Project
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
