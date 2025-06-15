import { create } from 'zustand';

interface Paper {
  id: string;
  title: string;
  authors?: string;
  publicationYear?: number;
  link?: string;
  notes?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaperState {
  papers: Paper[];
  selectedPaper: Paper | null; // New state for selected paper
  isLoading: boolean;
  error: string | null;
  fetchPapers: (projectId: string) => Promise<void>;
  getPaper: (projectId: string, paperId: string) => Promise<void>; // New action
  addPaper: (projectId: string, data: { title: string; authors?: string; publicationYear?: number; link?: string; notes?: string; }) => Promise<void>;
  updatePaper: (projectId: string, paperId: string, data: { title?: string; authors?: string; publicationYear?: number; link?: string; notes?: string; }) => Promise<void>; // New action
  deletePaper: (projectId: string, paperId: string) => Promise<void>;
}

export const usePaperStore = create<PaperState>((set, get) => ({
  papers: [],
  selectedPaper: null, // Initialize selectedPaper
  isLoading: false,
  error: null,

  fetchPapers: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/papers`);
      if (!response.ok) {
        throw new Error('Failed to fetch papers');
      }
      const papers: Paper[] = await response.json();
      set({ papers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addPaper: async (projectId: string, data: { title: string; authors?: string; publicationYear?: number; link?: string; notes?: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/papers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add paper');
      }

      const newPaper: Paper = await response.json();
      set((state) => ({
        papers: [...state.papers, newPaper],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deletePaper: async (projectId: string, paperId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/papers/${paperId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete paper');
      }

      set((state) => ({
        papers: state.papers.filter((paper) => paper.id !== paperId),
        selectedPaper: state.selectedPaper?.id === paperId ? null : state.selectedPaper, // Clear selected paper if deleted
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getPaper: async (projectId: string, paperId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/papers/${paperId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch paper details');
      }
      const paper: Paper = await response.json();
      set({ selectedPaper: paper, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updatePaper: async (projectId: string, paperId: string, data: { title?: string; authors?: string; publicationYear?: number; link?: string; notes?: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/papers/${paperId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update paper');
      }

      const updatedPaper: Paper = await response.json();
      set((state) => ({
        papers: state.papers.map((paper) => (paper.id === updatedPaper.id ? updatedPaper : paper)),
        selectedPaper: state.selectedPaper?.id === updatedPaper.id ? updatedPaper : state.selectedPaper,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
