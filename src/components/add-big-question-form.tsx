"use client";

import { useState } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { Button, Modal, Form, Input } from "antd";
import { toast } from "@/components/ui/sonner";

interface AddBigQuestionFormProps {
  projectId: string;
}

export function AddBigQuestionForm({ projectId }: AddBigQuestionFormProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { addBigQuestion, isLoading, error } = useQuestionStore();

  const handleSubmit = async (values: { text: string }) => {
    const { text } = values;
    if (!text.trim()) {
      toast.error("Big question text is required.");
      return;
    }

    await addBigQuestion(projectId, text);

    if (error) {
      toast.error("Error adding big question", {
        description: error,
      });
    } else {
      toast.success("Big question added successfully!", {
        description: `Big question "${text}" has been added.`,
      });
      form.resetFields();
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Big Question</Button>
      <Modal
        title="Add Big Question"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p className="text-gray-500 mb-4">Create a new overarching big question to categorize your research inquiries.</p>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="text"
            label="Question"
            rules={[{ required: true, message: "Big question text is required." }]}
          >
            <Input placeholder="Enter your big question..." />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Big Question
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
