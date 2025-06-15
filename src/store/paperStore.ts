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
  isLoading: boolean;
  error: string | null;
  fetchPapers: (projectId: string) => Promise<void>;
  addPaper: (projectId: string, data: { title: string; authors?: string; publicationYear?: number; link?: string; notes?: string; }) => Promise<void>;
  deletePaper: (projectId: string, paperId: string) => Promise<void>;
}

export const usePaperStore = create<PaperState>((set, get) => ({
  papers: [],
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
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
