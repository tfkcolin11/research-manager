import { create } from 'zustand';

interface Paper {
  id: string;
  title: string;
  authors?: string;
  publicationYear?: number;
  link?: string;
  notes?: string;
}

export type RelationshipType = 'SUPPORTS' | 'CONTRADICTS' | 'COMPLEMENTS' | 'EXTENDS' | 'IS_EXTENDED_BY' | 'USES_METHODOLOGY_OF';

interface PaperRelationship {
  id: string;
  paperAId: string;
  paperA: Paper;
  paperBId: string;
  paperB: Paper;
  type: RelationshipType;
  notes?: string;
  projectId: string;
}

interface RelationshipState {
  relationships: PaperRelationship[];
  isLoading: boolean;
  error: string | null;
  
  fetchRelationships: (projectId: string) => Promise<void>;
  addRelationship: (projectId: string, data: { paperAId: string; paperBId: string; type: RelationshipType; notes?: string; }) => Promise<void>;
  updateRelationship: (projectId: string, relationshipId: string, data: { paperAId: string; paperBId: string; type: RelationshipType; notes?: string; }) => Promise<void>;
  deleteRelationship: (projectId: string, relationshipId: string) => Promise<void>;
}

export const useRelationshipStore = create<RelationshipState>((set, get) => ({
  relationships: [],
  isLoading: false,
  error: null,

  fetchRelationships: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/relationships`);
      if (!response.ok) {
        throw new Error('Failed to fetch relationships');
      }
      const relationships: PaperRelationship[] = await response.json();
      set({ relationships, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addRelationship: async (projectId: string, data: { paperAId: string; paperBId: string; type: RelationshipType; notes?: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/relationships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add relationship');
      }

      const newRelationship: PaperRelationship = await response.json();
      set((state) => ({
        relationships: [...state.relationships, newRelationship],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateRelationship: async (projectId: string, relationshipId: string, data: { paperAId: string; paperBId: string; type: RelationshipType; notes?: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/relationships/${relationshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update relationship');
      }

      const updatedRelationship: PaperRelationship = await response.json();
      set((state) => ({
        relationships: state.relationships.map((r) =>
          r.id === relationshipId ? updatedRelationship : r
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteRelationship: async (projectId: string, relationshipId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/relationships/${relationshipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete relationship');
      }

      set((state) => ({
        relationships: state.relationships.filter((r) => r.id !== relationshipId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
