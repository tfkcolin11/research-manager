"use client";

import { useState } from "react";
import { usePaperStore } from "@/store/paperStore";
import { Button, Modal, Form, Input } from "antd";
import { toast } from "@/components/ui/sonner";

const { TextArea } = Input;

interface AddPaperFormProps {
  projectId: string;
}

export function AddPaperForm({ projectId }: AddPaperFormProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { addPaper, isLoading, error } = usePaperStore();

  const handleSubmit = async (values: any) => {
    if (!values.title.trim()) {
      toast.error("Paper title is required.");
      return;
    }

    const paperData = {
      ...values,
      publicationYear: values.publicationYear ? parseInt(values.publicationYear) : undefined,
    };

    await addPaper(projectId, paperData);

    if (error) {
      toast.error("Error adding paper", {
        description: error,
      });
    } else {
      toast.success("Paper added successfully!", {
        description: `Paper "${values.title}" has been added.`,
      });
      form.resetFields();
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add New Paper</Button>
      <Modal
        title="Add New Paper"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p className="text-gray-500 mb-4">Enter the details for the new research paper.</p>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Paper title is required." }]}
          >
            <Input placeholder="Enter paper title" />
          </Form.Item>
          <Form.Item
            name="authors"
            label="Authors"
          >
            <Input placeholder="e.g., John Doe, Jane Smith" />
          </Form.Item>
          <Form.Item
            name="publicationYear"
            label="Publication Year"
          >
            <Input type="number" placeholder="e.g., 2023" />
          </Form.Item>
          <Form.Item
            name="link"
            label="Link (URL/Path)"
          >
            <Input placeholder="e.g., https://example.com/paper.pdf" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Any additional notes about the paper" />
          </Form.Item>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Paper
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
