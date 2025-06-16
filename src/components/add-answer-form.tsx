"use client";

import { useState, useEffect } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { usePaperStore } from "@/store/paperStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [open, setOpen] = useState(false);

  const { addAnswer, isLoading: questionLoading, error: questionError } = useQuestionStore();
  const { papers, fetchPapers } = usePaperStore();

  useEffect(() => {
    if (open && papers.length === 0) {
      fetchPapers(projectId);
    }
  }, [open, papers.length, fetchPapers, projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Answer text is required.");
      return;
    }
    if (!selectedPaperId) {
      toast.error("Please select a paper.");
      return;
    }

    const data = {
      text,
      location: location || undefined,
      paperId: selectedPaperId,
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
      setText("");
      setLocation("");
      setSelectedPaperId("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Answer</DialogTitle>
          <DialogDescription>
            Record an answer found in a specific paper for this research question.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="text" className="text-right pt-2">
              Answer <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              disabled={questionLoading}
              placeholder="Enter the answer found in the paper..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paper" className="text-right">
              Paper <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedPaperId} onValueChange={setSelectedPaperId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select the source paper" />
              </SelectTrigger>
              <SelectContent>
                {papers.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
              disabled={questionLoading}
              placeholder="e.g., Page 15, Section 3.2, etc."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={questionLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={questionLoading}>
              {questionLoading ? "Adding..." : "Add Answer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
