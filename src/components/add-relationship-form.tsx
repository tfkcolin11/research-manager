"use client";

import { useState, useEffect } from "react";
import { useRelationshipStore, RelationshipType } from "@/store/relationshipStore";
import { usePaperStore } from "@/store/paperStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [paperAId, setPaperAId] = useState("");
  const [paperBId, setPaperBId] = useState("");
  const [type, setType] = useState<RelationshipType | "">("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const { addRelationship, isLoading: relationshipLoading, error: relationshipError } = useRelationshipStore();
  const { papers, fetchPapers } = usePaperStore();

  useEffect(() => {
    if (open && papers.length === 0) {
      fetchPapers(projectId);
    }
  }, [open, papers.length, fetchPapers, projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paperAId) {
      toast.error("Please select Paper A.");
      return;
    }
    if (!paperBId) {
      toast.error("Please select Paper B.");
      return;
    }
    if (!type) {
      toast.error("Please select a relationship type.");
      return;
    }
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
        description: `"${paperA?.title}" ${type.toLowerCase().replace('_', ' ')} "${paperB?.title}".`,
      });
      setPaperAId("");
      setPaperBId("");
      setType("");
      setNotes("");
      setOpen(false);
    }
  };

  const availablePapersForB = papers.filter(paper => paper.id !== paperAId);
  const availablePapersForA = papers.filter(paper => paper.id !== paperBId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Define New Relationship</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Define Paper Relationship</DialogTitle>
          <DialogDescription>
            Define how two papers in your project relate to each other.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperA" className="text-right">
              Paper A <span className="text-red-500">*</span>
            </Label>
            <Select value={paperAId} onValueChange={setPaperAId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select the first paper" />
              </SelectTrigger>
              <SelectContent>
                {availablePapersForA.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Relationship <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as RelationshipType)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((relType) => (
                  <SelectItem key={relType.value} value={relType.value}>
                    <div>
                      <div className="font-medium">{relType.label}</div>
                      <div className="text-xs text-gray-500">{relType.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperB" className="text-right">
              Paper B <span className="text-red-500">*</span>
            </Label>
            <Select value={paperBId} onValueChange={setPaperBId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select the second paper" />
              </SelectTrigger>
              <SelectContent>
                {availablePapersForB.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              disabled={relationshipLoading}
              placeholder="Optional notes about this relationship..."
              rows={3}
            />
          </div>

          {paperAId && paperBId && type && (
            <div className="col-span-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Preview:</strong> "{papers.find(p => p.id === paperAId)?.title}" {type.toLowerCase().replace('_', ' ')} "{papers.find(p => p.id === paperBId)?.title}"
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={relationshipLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={relationshipLoading}>
              {relationshipLoading ? "Adding..." : "Add Relationship"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
