"use client";

import { useState, useEffect } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { usePaperStore } from "@/store/paperStore";
import { Button, Modal, Form, Input, Select } from "antd";
import { toast } from "@/components/ui/sonner";

const { TextArea } = Input;

interface AddAnswerFormProps {
  projectId: string;
  researchQuestionId: string;
  triggerText?: string;
}

export function AddAnswerForm({ 
  projectId, 
  researchQuestionId,
  triggerText = "Add Answer"
}: AddAnswerFormProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { addAnswer, isLoading: questionLoading, error: questionError } = useQuestionStore();
  const { papers, fetchPapers } = usePaperStore();

  useEffect(() => {
    if (open && papers.length === 0) {
      fetchPapers(projectId);
    }
  }, [open, papers.length, fetchPapers, projectId]);

  const handleSubmit = async (values: any) => {
    const data = {
      ...values,
      researchQuestionId,
    };

    await addAnswer(projectId, data);

    if (questionError) {
      toast.error("Error adding answer", {
        description: questionError,
      });
    } else {
      toast.success("Answer added successfully!", {
        description: `Answer has been added to the research question.`,
      });
      form.resetFields();
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerText}</Button>
      <Modal
        title="Add Answer"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p className="text-gray-500 mb-4">Record an answer found in a specific paper for this research question.</p>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="text"
            label="Answer"
            rules={[{ required: true, message: "Answer text is required." }]}
          >
            <TextArea rows={3} placeholder="Enter the answer found in the paper..." />
          </Form.Item>

          <Form.Item
            name="paperId"
            label="Paper"
            rules={[{ required: true, message: "Please select a paper." }]}
          >
            <Select placeholder="Select the source paper">
              {papers.map((paper) => (
                <Select.Option key={paper.id} value={paper.id}>
                  {paper.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="e.g., Page 15, Section 3.2, etc." />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} disabled={questionLoading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={questionLoading}>
              Add Answer
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
