import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, PhrasePattern, GeneratedPhrase, TrainingSession, Language } from '@/types';

interface StoreState extends AppState {
  // Actions
  setLanguage: (language: Language) => void;
  
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
      selectedLanguage: 'german' as Language,
      patterns: [],
      trainingPhrases: [],
      sessions: [],
      currentPhrase: null,
      
      setLanguage: (language) =>
        set({ selectedLanguage: language, currentPhrase: null }),
      
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
      version: 4, // Increment this when data structure changes
      migrate: (persistedState: unknown, version: number) => {
        if (version < 4) {
          // Add multi-language support
          return {
            ...(persistedState as Record<string, unknown>),
            selectedLanguage: 'german',
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

