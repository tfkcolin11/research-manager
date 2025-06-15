"use client";

import { usePaperStore } from "@/store/paperStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect } from "react";

interface PaperDetailViewProps {
  projectId: string;
  paperId: string;
}

export function PaperDetailView({ projectId, paperId }: PaperDetailViewProps) {
  const { selectedPaper, isLoading, error, getPaper } = usePaperStore();

  // Fetch paper details if not already selected or if ID doesn't match
  useEffect(() => {
    if (!selectedPaper || selectedPaper.id !== paperId) {
      getPaper(projectId, paperId);
    }
  }, [projectId, paperId, selectedPaper, getPaper]);

  if (isLoading) {
    return <div className="text-center py-8">Loading paper details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!selectedPaper) {
    return <div className="text-center py-8 text-gray-500">Paper not found.</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{selectedPaper.title}</CardTitle>
        <div className="text-sm text-gray-500">
          {selectedPaper.authors && <span>{selectedPaper.authors}</span>}
          {selectedPaper.authors && selectedPaper.publicationYear && <span>, </span>}
          {selectedPaper.publicationYear && <span>{selectedPaper.publicationYear}</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPaper.link && (
          <div>
            <h3 className="font-semibold">Link:</h3>
            <a href={selectedPaper.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {selectedPaper.link}
            </a>
          </div>
        )}
        {selectedPaper.notes && (
          <div>
            <h3 className="font-semibold">Notes:</h3>
            <p className="whitespace-pre-wrap">{selectedPaper.notes}</p>
          </div>
        )}
        <div className="flex space-x-2 mt-4">
          <Link href={`/dashboard/${projectId}/papers/${paperId}/edit`} passHref>
            <Button>Edit Paper</Button>
          </Link>
          {/* Delete button will be handled in PaperList or a dedicated modal */}
          <Link href={`/dashboard/${projectId}/papers`} passHref>
            <Button variant="outline">Back to Papers</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
