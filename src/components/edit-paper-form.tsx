"use client";

import { useState, useEffect } from "react";
import { usePaperStore } from "@/store/paperStore";
import { Button, Modal, Form, Input } from "antd";
import { toast } from "@/components/ui/sonner";

const { TextArea } = Input;

interface EditPaperFormProps {
  projectId: string;
  paperId: string;
  onSuccess?: () => void;
}

export function EditPaperForm({ projectId, paperId, onSuccess }: EditPaperFormProps) {
  const { selectedPaper, isLoading, error, getPaper, updatePaper } = usePaperStore();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!selectedPaper || selectedPaper.id !== paperId) {
      getPaper(projectId, paperId);
    }
  }, [projectId, paperId, selectedPaper, getPaper]);

  useEffect(() => {
    if (selectedPaper && selectedPaper.id === paperId) {
      form.setFieldsValue({
        title: selectedPaper.title || "",
        authors: selectedPaper.authors || "",
        publicationYear: selectedPaper.publicationYear || undefined,
        link: selectedPaper.link || "",
        notes: selectedPaper.notes || "",
      });
    }
  }, [selectedPaper, paperId, form]);

  const handleSubmit = async (values: any) => {
    if (!values.title.trim()) {
      toast.error("Paper title is required.");
      return;
    }

    const updatedData = {
      ...values,
      publicationYear: values.publicationYear ? parseInt(values.publicationYear) : undefined,
    };

    await updatePaper(projectId, paperId, updatedData);

    if (error) {
      toast.error("Error updating paper", {
        description: error,
      });
    } else {
      toast.success("Paper updated successfully!", {
        description: `Paper "${values.title}" has been updated.`,
      });
      setOpen(false);
      onSuccess?.();
    }
  };

  if (isLoading && !selectedPaper) {
    return <div className="text-center py-8">Loading paper for editing...</div>;
  }

  if (error && !selectedPaper) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!selectedPaper || selectedPaper.id !== paperId) {
    return <div className="text-center py-8 text-gray-500">Paper not found or not ready for editing.</div>;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit Paper</Button>
      <Modal
        title="Edit Paper"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p className="text-gray-500 mb-4">Modify the details for the paper &quot;{selectedPaper.title}&quot;.</p>
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
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
