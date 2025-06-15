"use client";

import { usePaperStore } from "@/store/paperStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface PaperListProps {
  projectId: string;
}

export function PaperList({ projectId }: PaperListProps) {
  const { papers, deletePaper, isLoading, error } = usePaperStore();

  const handleDelete = async (paperId: string, paperTitle: string) => {
    await deletePaper(projectId, paperId);
    if (error) {
      toast.error("Error deleting paper", {
        description: error,
      });
    } else {
      toast.success("Paper deleted successfully!", {
        description: `Paper "${paperTitle}" has been removed.`,
      });
    }
  };

  if (isLoading && papers.length === 0) {
    return <div className="text-center py-8">Loading papers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (papers.length === 0) {
    return <div className="text-center py-8 text-gray-500">No papers found for this project. Add one to get started!</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Papers in this Project</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {papers.map((paper) => (
            <TableRow key={paper.id}>
              <TableCell className="font-medium">{paper.title}</TableCell>
              <TableCell>{paper.authors}</TableCell>
              <TableCell>{paper.publicationYear}</TableCell>
              <TableCell>
                {paper.link ? (
                  <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Link
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{paper.notes || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/dashboard/${projectId}/papers/${paper.id}`} passHref>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <Link href={`/dashboard/${projectId}/papers/${paper.id}/edit`} passHref>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the paper &quot;{paper.title}&quot;r and any associated answers or relationships.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(paper.id, paper.title)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
