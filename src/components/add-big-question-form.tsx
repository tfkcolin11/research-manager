"use client";

import { useState } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddBigQuestionFormProps {
  projectId: string;
}

export function AddBigQuestionForm({ projectId }: AddBigQuestionFormProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const { addBigQuestion, isLoading, error } = useQuestionStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      setText("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Big Question</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Big Question</DialogTitle>
          <DialogDescription>
            Create a new overarching big question to categorize your research inquiries.
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
              placeholder="Enter your big question..."
            />
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
              {isLoading ? "Adding..." : "Add Big Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
