"use client";

import { useState, useEffect } from "react";
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

interface EditPaperFormProps {
  projectId: string;
  paperId: string;
  onSuccess?: () => void;
}

export function EditPaperForm({ projectId, paperId, onSuccess }: EditPaperFormProps) {
  const { selectedPaper, isLoading, error, getPaper, updatePaper } = usePaperStore();

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [publicationYear, setPublicationYear] = useState<number | undefined>(undefined);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch paper details if not already selected or if ID doesn't match
    if (!selectedPaper || selectedPaper.id !== paperId) {
      getPaper(projectId, paperId);
    }
  }, [projectId, paperId, selectedPaper, getPaper]);

  useEffect(() => {
    if (selectedPaper && selectedPaper.id === paperId) {
      setTitle(selectedPaper.title || "");
      setAuthors(selectedPaper.authors || "");
      setPublicationYear(selectedPaper.publicationYear || undefined);
      setLink(selectedPaper.link || "");
      setNotes(selectedPaper.notes || "");
    }
  }, [selectedPaper, paperId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Paper title is required.");
      return;
    }

    const updatedData = {
      title,
      authors: authors || undefined,
      publicationYear: publicationYear || undefined,
      link: link || undefined,
      notes: notes || undefined,
    };

    await updatePaper(projectId, paperId, updatedData);

    if (error) {
      toast.error("Error updating paper", {
        description: error,
      });
    } else {
      toast.success("Paper updated successfully!", {
        description: `Paper "${title}" has been updated.`,
      });
      setOpen(false);
      onSuccess?.(); // Call optional success callback
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Paper</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Paper</DialogTitle>
          <DialogDescription>
            Modify the details for the paper &quot;{selectedPaper.title}&quot;.
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
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
