// Core types for the language trainer application

export type Language = 'german' | 'czech';

// German has 4 cases, Czech has 7 cases
export type GrammaticalCase = 
  | 'nominative' 
  | 'accusative' 
  | 'dative' 
  | 'genitive'
  | 'vocative'    // Czech only
  | 'locative'    // Czech only
  | 'instrumental'; // Czech only

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
  language: Language;
  englishTemplate: string; // e.g., "{pronoun} went to {place}"
  targetTemplate: string; // e.g., "{pronoun} ging {preposition} {place}" (German/Czech/etc)
  slots: PhraseSlot[];
  description?: string;
}

export interface GeneratedPhrase {
  id: string;
  patternId: string;
  language: Language;
  english: string;
  targetCorrect: string; // Correct translation in target language
  targetPrompt: string; // with words in base form
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
  selectedLanguage: Language;
  patterns: PhrasePattern[];
  trainingPhrases: GeneratedPhrase[];
  sessions: TrainingSession[];
  currentPhrase: GeneratedPhrase | null;
}

export interface LanguageConfig {
  id: Language;
  name: string;
  nativeName: string;
  cases: GrammaticalCase[];
  hasGenders: boolean;
  genders: Gender[];
}

