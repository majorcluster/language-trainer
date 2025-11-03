import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, PhrasePattern, GeneratedPhrase, TrainingSession } from '@/types';

interface StoreState extends AppState {
  // Actions
  addPattern: (pattern: PhrasePattern) => void;
  updatePattern: (id: string, pattern: Partial<PhrasePattern>) => void;
  deletePattern: (id: string) => void;
  
  addTrainingPhrase: (phrase: GeneratedPhrase) => void;
  removeTrainingPhrase: (id: string) => void;
  setCurrentPhrase: (phrase: GeneratedPhrase | null) => void;
  
  addSession: (session: TrainingSession) => void;
  clearSessions: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      patterns: [],
      trainingPhrases: [],
      sessions: [],
      currentPhrase: null,
      
      addPattern: (pattern) => 
        set((state) => {
          // Prevent duplicate pattern IDs
          if (state.patterns.some(p => p.id === pattern.id)) {
            return state;
          }
          return { patterns: [...state.patterns, pattern] };
        }),
      
      updatePattern: (id, updates) =>
        set((state) => ({
          patterns: state.patterns.map((p) => 
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      
      deletePattern: (id) =>
        set((state) => ({
          patterns: state.patterns.filter((p) => p.id !== id),
        })),
      
      addTrainingPhrase: (phrase) =>
        set((state) => ({
          trainingPhrases: [...state.trainingPhrases, phrase],
        })),
      
      removeTrainingPhrase: (id) =>
        set((state) => ({
          trainingPhrases: state.trainingPhrases.filter((p) => p.id !== id),
        })),
      
      setCurrentPhrase: (phrase) =>
        set({ currentPhrase: phrase }),
      
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),
      
      clearSessions: () =>
        set({ sessions: [] }),
    }),
    {
      name: 'language-trainer-storage',
      version: 3, // Increment this when data structure changes
      migrate: (persistedState: unknown, version: number) => {
        if (version < 3) {
          // Clear old patterns to load new meaningful word categories
          return {
            ...(persistedState as Record<string, unknown>),
            patterns: [],
            trainingPhrases: [],
          };
        }
        return persistedState as AppState;
      },
      onRehydrateStorage: () => (state) => {
        // Clean up any duplicate patterns that might exist in storage
        if (state && state.patterns) {
          const uniquePatterns = state.patterns.filter(
            (pattern, index, self) => 
              index === self.findIndex(p => p.id === pattern.id)
          );
          if (uniquePatterns.length !== state.patterns.length) {
            state.patterns = uniquePatterns;
          }
        }
      },
    }
  )
);

