"use client";

import { useState } from "react";
import { usePaperStore } from "@/store/paperStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddPaperFormProps {
  projectId: string;
}

export function AddPaperForm({ projectId }: AddPaperFormProps) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [publicationYear, setPublicationYear] = useState<number | undefined>(undefined);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const { addPaper, isLoading, error } = usePaperStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Paper title is required.");
      return;
    }

    const paperData = {
      title,
      authors: authors || undefined,
      publicationYear: publicationYear || undefined,
      link: link || undefined,
      notes: notes || undefined,
    };

    await addPaper(projectId, paperData);

    if (error) {
      toast.error("Error adding paper", {
        description: error,
      });
    } else {
      toast.success("Paper added successfully!", {
        description: `Paper "${title}" has been added.`,
      });
      setTitle("");
      setAuthors("");
      setPublicationYear(undefined);
      setLink("");
      setNotes("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Paper</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Paper</DialogTitle>
          <DialogDescription>
            Enter the details for the new research paper.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="authors" className="text-right">
              Authors
            </Label>
            <Input
              id="authors"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="publicationYear" className="text-right">
              Pub. Year
            </Label>
            <Input
              id="publicationYear"
              type="number"
              value={publicationYear === undefined ? "" : publicationYear}
              onChange={(e) => setPublicationYear(e.target.value ? parseInt(e.target.value) : undefined)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Link (URL/Path)
            </Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Paper"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
