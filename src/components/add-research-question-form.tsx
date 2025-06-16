"use client";

import { useState } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  triggerText = "Add Research Question"
}: AddResearchQuestionFormProps) {
  const [text, setText] = useState("");
  const [selectedBigQuestionId, setSelectedBigQuestionId] = useState(bigQuestionId || "");
  const [selectedParentId, setSelectedParentId] = useState(parentQuestionId || "");
  const [open, setOpen] = useState(false);

  const { bigQuestions, researchQuestions, addResearchQuestion, isLoading, error } = useQuestionStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Research question text is required.");
      return;
    }

    const data = {
      text,
      bigQuestionId: selectedBigQuestionId || undefined,
      parentId: selectedParentId || undefined,
    };

    await addResearchQuestion(projectId, data);

    if (error) {
      toast.error("Error adding research question", {
        description: error,
      });
    } else {
      toast.success("Research question added successfully!", {
        description: `Research question "${text}" has been added.`,
      });
      setText("");
      setSelectedBigQuestionId("");
      setSelectedParentId("");
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
          <DialogTitle>Add Research Question</DialogTitle>
          <DialogDescription>
            Create a new research question. You can optionally link it to a big question or make it a sub-question of another research question.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Question <span className="text-red-500">*</span>
            </Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
              placeholder="Enter your research question..."
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bigQuestion" className="text-right">
              Big Question
            </Label>
            <Select value={selectedBigQuestionId} onValueChange={setSelectedBigQuestionId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a big question (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {bigQuestions.map((bq) => (
                  <SelectItem key={bq.id} value={bq.id}>
                    {bq.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parentQuestion" className="text-right">
              Parent Question
            </Label>
            <Select value={selectedParentId} onValueChange={setSelectedParentId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a parent question (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {researchQuestions.map((rq) => (
                  <SelectItem key={rq.id} value={rq.id}>
                    {rq.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Research Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
