// Core types for the language trainer application

export type GrammaticalCase = 'nominative' | 'accusative' | 'dative' | 'genitive';
export type Gender = 'masculine' | 'feminine' | 'neuter';
export type Number = 'singular' | 'plural';
export type PersonPronoun = 'ich' | 'du' | 'er' | 'sie' | 'es' | 'wir' | 'ihr' | 'sie-formal';

export interface WordVariant {
  id: string;
  baseForm: string;
  english?: string; // English translation
  gender?: Gender;
  category: 'noun' | 'adjective' | 'pronoun' | 'verb' | 'preposition' | 'article';
  declensions?: Record<string, string>; // case_gender_number -> declined form
}

export interface PhraseSlot {
  id: string;
  type: 'pronoun' | 'verb' | 'noun-phrase' | 'preposition-phrase' | 'fixed';
  label: string;
  fixedText?: string; // for fixed slots
  options?: WordVariant[]; // for variable slots
  requiredCase?: GrammaticalCase;
}

export interface PhrasePattern {
  id: string;
  name: string;
  englishTemplate: string; // e.g., "{pronoun} went to {place}"
  germanTemplate: string; // e.g., "{pronoun} ging {preposition} {place}"
  slots: PhraseSlot[];
  description?: string;
}

export interface GeneratedPhrase {
  id: string;
  patternId: string;
  english: string;
  germanCorrect: string;
  germanPrompt: string; // with words in base form
  selectedWords: Record<string, WordVariant>; // slot id -> selected word
}

export interface TrainingSession {
  id: string;
  phraseId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
  attempts: number;
}

export interface AppState {
  patterns: PhrasePattern[];
  trainingPhrases: GeneratedPhrase[];
  sessions: TrainingSession[];
  currentPhrase: GeneratedPhrase | null;
}

