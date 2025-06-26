"use client";

import { useRelationshipStore } from "@/store/relationshipStore";
import { Button, Modal } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface RelationshipListProps {
  projectId: string;
}

const relationshipTypeLabels = {
  'SUPPORTS': 'Supports',
  'CONTRADICTS': 'Contradicts',
  'COMPLEMENTS': 'Complements',
  'EXTENDS': 'Extends',
  'IS_EXTENDED_BY': 'Is Extended By',
  'USES_METHODOLOGY_OF': 'Uses Methodology Of',
};

const relationshipTypeColors = {
  'SUPPORTS': 'bg-green-100 text-green-800',
  'CONTRADICTS': 'bg-red-100 text-red-800',
  'COMPLEMENTS': 'bg-blue-100 text-blue-800',
  'EXTENDS': 'bg-purple-100 text-purple-800',
  'IS_EXTENDED_BY': 'bg-orange-100 text-orange-800',
  'USES_METHODOLOGY_OF': 'bg-yellow-100 text-yellow-800',
};

export function RelationshipList({ projectId }: RelationshipListProps) {
  const { relationships, deleteRelationship, isLoading, error } = useRelationshipStore();

  const showDeleteConfirm = (relationshipId: string, paperATitle: string, paperBTitle: string) => {
    Modal.confirm({
      title: "Delete Relationship",
      content: `Are you sure you want to delete this relationship between "${paperATitle}" and "${paperBTitle}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteRelationship(projectId, relationshipId);
        if (error) {
          toast.error("Error deleting relationship", {
            description: error,
          });
        } else {
          toast.success("Relationship deleted successfully!", {
            description: `Relationship between "${paperATitle}" and "${paperBTitle}" has been removed.`,
          });
        }
      },
    });
  };

  if (isLoading && relationships.length === 0) {
    return <div className="text-center py-8">Loading relationships...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (relationships.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No relationships have been defined yet.</p>
        <p className="text-sm text-gray-400">
          Define relationships between papers to understand how they connect to each other.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Paper Relationships ({relationships.length})</h2>
      
      {relationships.map((relationship) => (
        <Card key={relationship.id} className="border-l-4 border-l-indigo-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-700 font-medium">
                    {relationship.paperA.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <Badge 
                    className={`${relationshipTypeColors[relationship.type]} border-0`}
                  >
                    {relationshipTypeLabels[relationship.type]}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="text-green-700 font-medium">
                    {relationship.paperB.title}
                  </span>
                </div>
              </CardTitle>
              <Button
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => showDeleteConfirm(relationship.id, relationship.paperA.title, relationship.paperB.title)}
              />
            </div>
          </CardHeader>
          
          {relationship.notes && (
            <CardContent className="pt-0">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Notes:</strong> {relationship.notes}
                </p>
              </div>
            </CardContent>
          )}
          
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Paper A:</strong></p>
                <p className="text-blue-700">{relationship.paperA.title}</p>
                {relationship.paperA.authors && (
                  <p className="text-xs">Authors: {relationship.paperA.authors}</p>
                )}
                {relationship.paperA.publicationYear && (
                  <p className="text-xs">Year: {relationship.paperA.publicationYear}</p>
                )}
              </div>
              <div>
                <p><strong>Paper B:</strong></p>
                <p className="text-green-700">{relationship.paperB.title}</p>
                {relationship.paperB.authors && (
                  <p className="text-xs">Authors: {relationship.paperB.authors}</p>
                )}
                {relationship.paperB.publicationYear && (
                  <p className="text-xs">Year: {relationship.paperB.publicationYear}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
