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

export interface VerbConjugation {
  id: string;
  infinitive: string;
  english: string;
  language: Language;
  tense: 'present' | 'past' | 'future' | 'perfect';
  conjugations: {
    // For German: ich, du, er/sie/es, wir, ihr, sie
    // For Czech: já, ty, on/ona/ono, my, vy, oni/ony/ona
    [pronoun: string]: string;
  };
  // For Czech past tense with gender agreement
  genderForms?: {
    masculine: { [pronoun: string]: string };
    feminine: { [pronoun: string]: string };
    neuter: { [pronoun: string]: string };
  };
  // For verbs that govern a specific case for their objects (e.g., Czech "bojím se" requires genitive)
  governsCase?: GrammaticalCase;
}

export interface PhraseSlot {
  id: string;
  type: 'pronoun' | 'verb' | 'object-phrase' | 'fixed';
  label: string;
  fixedText?: string; // for fixed slots (appears in both languages)
  fixedTextTarget?: string; // optional: different text for target language
  fixedTextEnglish?: string; // optional: different text for English
  options?: WordVariant[]; // for variable slots (pronouns, nouns, adjectives)
  verbId?: string; // for verb slots - references a VerbConjugation id
  requiredCase?: GrammaticalCase;
  preposition?: string; // optional preposition for object-phrase slots (e.g., 'in', 'v', 'do')
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
  targetWithoutPronoun?: string; // For pro-drop languages (Czech)
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
  verbs: VerbConjugation[];
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
  allowPronounDrop: boolean; // Pro-drop languages (Czech, Spanish, etc.) allow omitting subject pronouns
  // Maps each gender to the pronouns that use it for conjugation (for languages with gender-specific past tense)
  genderPronounMap?: Record<Gender, string[]>;
  // Whether past tense uses gender-specific forms
  usesGenderForPastTense: boolean;
  // Example words for placeholders
  examples: {
    infinitive: string; // e.g., "gehen" for German
    prepositions: string; // e.g., "in, zu, nach" for German
  };
  // Preposition configuration
  prepositionConfig: {
    usesArticles: boolean; // Whether prepositions merge with articles (German yes, Czech no)
    prepositionToEnglish: Record<string, string>; // Maps prepositions to English
    prepositionToCase?: Record<string, GrammaticalCase>; // Optional case governance
  };
  // Common words for phrase generation
  phraseBuilding: {
    possessives: string[];
    adjectives: string[];
    dativeAdjectives?: string[]; // Optional dative-specific adjectives
    // Translations for possessives and adjectives
    translations: {
      possessives: Record<string, string>;
      adjectives: Record<string, string>;
    };
  };
  // Default patterns for initialization
  defaultPatterns: PhrasePattern[];
  // Default pronouns as WordVariants (for pattern editor)
  defaultPronounWords: WordVariant[];
  // Default verbs for initialization
  defaultVerbs: VerbConjugation[];
  // Declension engine for this language (typed as any to avoid circular dependency)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declensionEngine: any;
}

