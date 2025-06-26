"use client";

import { useState, useEffect } from "react";
import { useRelationshipStore, RelationshipType } from "@/store/relationshipStore";
import { usePaperStore } from "@/store/paperStore";
import { Button, Modal, Form, Input, Select } from "antd";
import { toast } from "@/components/ui/sonner";

const { TextArea } = Input;

interface AddRelationshipFormProps {
  projectId: string;
}

const relationshipTypes: { value: RelationshipType; label: string; description: string }[] = [
  { value: 'SUPPORTS', label: 'Supports', description: 'Paper A supports the findings/arguments of Paper B' },
  { value: 'CONTRADICTS', label: 'Contradicts', description: 'Paper A contradicts the findings/arguments of Paper B' },
  { value: 'COMPLEMENTS', label: 'Complements', description: 'Paper A complements Paper B by providing additional insights' },
  { value: 'EXTENDS', label: 'Extends', description: 'Paper A extends the work presented in Paper B' },
  { value: 'IS_EXTENDED_BY', label: 'Is Extended By', description: 'Paper A is extended by the work in Paper B' },
  { value: 'USES_METHODOLOGY_OF', label: 'Uses Methodology Of', description: 'Paper A uses the methodology described in Paper B' },
];

export function AddRelationshipForm({ projectId }: AddRelationshipFormProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { addRelationship, isLoading: relationshipLoading, error: relationshipError } = useRelationshipStore();
  const { papers, fetchPapers } = usePaperStore();

  useEffect(() => {
    if (open && papers.length === 0) {
      fetchPapers(projectId);
    }
  }, [open, papers.length, fetchPapers, projectId]);

  const handleSubmit = async (values: any) => {
    const { paperAId, paperBId, type, notes } = values;

    if (paperAId === paperBId) {
      toast.error("A paper cannot have a relationship with itself.");
      return;
    }

    const data = {
      paperAId,
      paperBId,
      type: type as RelationshipType,
      notes: notes || undefined,
    };

    await addRelationship(projectId, data);

    if (relationshipError) {
      toast.error("Error adding relationship", {
        description: relationshipError,
      });
    } else {
      const paperA = papers.find(p => p.id === paperAId);
      const paperB = papers.find(p => p.id === paperBId);
      toast.success("Relationship added successfully!", {
        description: `&quot;${paperA?.title}&quot; ${type.toLowerCase().replace('_', ' ')} &quot;${paperB?.title}&quot;.`,
      });
      setOpen(false);
    }
  };

  const availablePapersForB = papers.filter(paper => paper.id !== form.getFieldValue('paperAId'));
  const availablePapersForA = papers.filter(paper => paper.id !== form.getFieldValue('paperBId'));

  return (
    <>
      <Button onClick={() => setOpen(true)}>Define New Relationship</Button>
      <Modal
        title="Define Paper Relationship"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        <p className="text-gray-500 mb-4">Define how two papers in your project relate to each other.</p>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="paperAId"
            label="Paper A"
            rules={[{ required: true, message: "Please select Paper A." }]}
          >
            <Select placeholder="Select the first paper">
              {availablePapersForA.map((paper) => (
                <Select.Option key={paper.id} value={paper.id}>
                  {paper.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Relationship"
            rules={[{ required: true, message: "Please select a relationship type." }]}
          >
            <Select placeholder="Select relationship type">
              {relationshipTypes.map((relType) => (
                <Select.Option key={relType.value} value={relType.value}>
                  <div>
                    <div className="font-medium">{relType.label}</div>
                    <div className="text-xs text-gray-500">{relType.description}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="paperBId"
            label="Paper B"
            rules={[{ required: true, message: "Please select Paper B." }]}
          >
            <Select placeholder="Select the second paper">
              {availablePapersForB.map((paper) => (
                <Select.Option key={paper.id} value={paper.id}>
                  {paper.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Optional notes about this relationship..." />
          </Form.Item>

          {form.getFieldValue('paperAId') && form.getFieldValue('paperBId') && form.getFieldValue('type') && (
            <div className="col-span-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Preview:</strong> &quot;{papers.find(p => p.id === form.getFieldValue('paperAId'))?.title}&quot; {form.getFieldValue('type').toLowerCase().replace('_', ' ')} &quot;{papers.find(p => p.id === form.getFieldValue('paperBId'))?.title}&quot;
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} disabled={relationshipLoading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={relationshipLoading}>
              Add Relationship
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
