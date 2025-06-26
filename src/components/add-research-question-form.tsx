"use client";

import { useState } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { Button, Modal, Form, Input, Select } from "antd";
import { toast } from "@/components/ui/sonner";

interface AddResearchQuestionFormProps {
  projectId: string;
  bigQuestionId?: string;
  parentQuestionId?: string;
  triggerText?: string;
}

export function AddResearchQuestionForm({
  projectId,
  bigQuestionId,
  parentQuestionId,
  triggerText = "Add Research Question",
}: AddResearchQuestionFormProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { bigQuestions, researchQuestions, addResearchQuestion, isLoading, error } = useQuestionStore();

  const handleSubmit = async (values: any) => {
    const { text, bigQuestionId: formBigQuestionId, parentId: formParentId } = values;

    if (!text.trim()) {
      toast.error("Research question text is required.");
      return;
    }

    const data = {
      text,
      bigQuestionId: formBigQuestionId === "none" ? undefined : formBigQuestionId,
      parentId: formParentId === "none" ? undefined : formParentId,
    };

    await addResearchQuestion(projectId, data);

    if (error) {
      toast.error("Error adding research question", {
        description: error,
      });
    } else {
      toast.success("Research question added successfully!", {
        description: `Research question \"${text}\" has been added.`,
      });
      form.resetFields();
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerText}</Button>
      <Modal
        title="Add Research Question"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p className="text-gray-500 mb-4">Create a new research question. You can optionally link it to a big question or make it a sub-question of another research question.</p>
        <Form form={form} onFinish={handleSubmit} layout="vertical"
          initialValues={{
            bigQuestionId: bigQuestionId || "none",
            parentId: parentQuestionId || "none",
          }}
        >
          <Form.Item
            name="text"
            label="Question"
            rules={[{ required: true, message: "Research question text is required." }]}
          >
            <Input placeholder="Enter your research question..." />
          </Form.Item>

          <Form.Item
            name="bigQuestionId"
            label="Big Question"
          >
            <Select placeholder="Select a big question (optional)">
              <Select.Option value="none">None</Select.Option>
              {bigQuestions.map((bq) => (
                <Select.Option key={bq.id} value={bq.id}>
                  {bq.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="parentId"
            label="Parent Question"
          >
            <Select placeholder="Select a parent question (optional)">
              <Select.Option value="none">None</Select.Option>
              {researchQuestions.map((rq) => (
                <Select.Option key={rq.id} value={rq.id}>
                  {rq.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Research Question
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
