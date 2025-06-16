import { create } from 'zustand';

interface Paper {
  id: string;
  title: string;
  authors?: string;
  publicationYear?: number;
  link?: string;
  notes?: string;
}

interface Answer {
  id: string;
  text: string;
  location?: string;
  paperId: string;
  paper: Paper;
  researchQuestionId: string;
  projectId: string;
}

interface ResearchQuestion {
  id: string;
  text: string;
  bigQuestionId?: string;
  parentId?: string;
  projectId: string;
  children?: ResearchQuestion[];
  answers: Answer[];
  parent?: ResearchQuestion;
}

interface BigQuestion {
  id: string;
  text: string;
  projectId: string;
  researchQuestions: ResearchQuestion[];
}

interface QuestionState {
  bigQuestions: BigQuestion[];
  researchQuestions: ResearchQuestion[];
  isLoading: boolean;
  error: string | null;
  
  // Big Questions
  fetchBigQuestions: (projectId: string) => Promise<void>;
  addBigQuestion: (projectId: string, text: string) => Promise<void>;
  updateBigQuestion: (projectId: string, questionId: string, text: string) => Promise<void>;
  deleteBigQuestion: (projectId: string, questionId: string) => Promise<void>;
  
  // Research Questions
  fetchResearchQuestions: (projectId: string) => Promise<void>;
  addResearchQuestion: (projectId: string, data: { text: string; bigQuestionId?: string; parentId?: string; }) => Promise<void>;
  updateResearchQuestion: (projectId: string, questionId: string, data: { text: string; bigQuestionId?: string; parentId?: string; }) => Promise<void>;
  deleteResearchQuestion: (projectId: string, questionId: string) => Promise<void>;
  
  // Answers
  addAnswer: (projectId: string, data: { text: string; location?: string; paperId: string; researchQuestionId: string; }) => Promise<void>;
  updateAnswer: (projectId: string, answerId: string, data: { text: string; location?: string; paperId: string; researchQuestionId: string; }) => Promise<void>;
  deleteAnswer: (projectId: string, answerId: string) => Promise<void>;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  bigQuestions: [],
  researchQuestions: [],
  isLoading: false,
  error: null,

  fetchBigQuestions: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/big-questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch big questions');
      }
      const bigQuestions: BigQuestion[] = await response.json();
      set({ bigQuestions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addBigQuestion: async (projectId: string, text: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/big-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add big question');
      }

      const newBigQuestion: BigQuestion = await response.json();
      set((state) => ({
        bigQuestions: [...state.bigQuestions, newBigQuestion],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateBigQuestion: async (projectId: string, questionId: string, text: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/big-questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update big question');
      }

      const updatedBigQuestion: BigQuestion = await response.json();
      set((state) => ({
        bigQuestions: state.bigQuestions.map((q) =>
          q.id === questionId ? updatedBigQuestion : q
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteBigQuestion: async (projectId: string, questionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/big-questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete big question');
      }

      set((state) => ({
        bigQuestions: state.bigQuestions.filter((q) => q.id !== questionId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchResearchQuestions: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/research-questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch research questions');
      }
      const researchQuestions: ResearchQuestion[] = await response.json();
      set({ researchQuestions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addResearchQuestion: async (projectId: string, data: { text: string; bigQuestionId?: string; parentId?: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/research-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add research question');
      }

      const newResearchQuestion: ResearchQuestion = await response.json();
      set((state) => ({
        researchQuestions: [...state.researchQuestions, newResearchQuestion],
        isLoading: false,
      }));
      
      // Also refresh big questions to get updated nested structure
      get().fetchBigQuestions(projectId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateResearchQuestion: async (projectId: string, questionId: string, data: { text: string; bigQuestionId?: string; parentId?: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/research-questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update research question');
      }

      const updatedResearchQuestion: ResearchQuestion = await response.json();
      set((state) => ({
        researchQuestions: state.researchQuestions.map((q) =>
          q.id === questionId ? updatedResearchQuestion : q
        ),
        isLoading: false,
      }));
      
      // Also refresh big questions to get updated nested structure
      get().fetchBigQuestions(projectId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteResearchQuestion: async (projectId: string, questionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/research-questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete research question');
      }

      set((state) => ({
        researchQuestions: state.researchQuestions.filter((q) => q.id !== questionId),
        isLoading: false,
      }));
      
      // Also refresh big questions to get updated nested structure
      get().fetchBigQuestions(projectId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addAnswer: async (projectId: string, data: { text: string; location?: string; paperId: string; researchQuestionId: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add answer');
      }

      set({ isLoading: false });
      
      // Refresh questions to get updated answers
      get().fetchBigQuestions(projectId);
      get().fetchResearchQuestions(projectId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateAnswer: async (projectId: string, answerId: string, data: { text: string; location?: string; paperId: string; researchQuestionId: string; }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/answers/${answerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update answer');
      }

      set({ isLoading: false });
      
      // Refresh questions to get updated answers
      get().fetchBigQuestions(projectId);
      get().fetchResearchQuestions(projectId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteAnswer: async (projectId: string, answerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/answers/${answerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete answer');
      }

      set({ isLoading: false });
      
      // Refresh questions to get updated answers
      get().fetchBigQuestions(projectId);
      get().fetchResearchQuestions(projectId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
