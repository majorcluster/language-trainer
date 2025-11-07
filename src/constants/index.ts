// Global constants used across the application

// Word categories
export const WORD_CATEGORY = {
  NOUN: 'noun',
  ADJECTIVE: 'adjective',
  PRONOUN: 'pronoun',
  VERB: 'verb',
  PREPOSITION: 'preposition',
  ARTICLE: 'article',
} as const;

// Grammatical cases
export const GRAMMATICAL_CASE = {
  NOMINATIVE: 'nominative',
  ACCUSATIVE: 'accusative',
  DATIVE: 'dative',
  GENITIVE: 'genitive',
  VOCATIVE: 'vocative',
  LOCATIVE: 'locative',
  INSTRUMENTAL: 'instrumental',
} as const;

// Genders
export const GENDER = {
  MASCULINE: 'masculine',
  FEMININE: 'feminine',
  NEUTER: 'neuter',
} as const;

// Grammatical numbers
export const GRAMMATICAL_NUMBER = {
  SINGULAR: 'singular',
  PLURAL: 'plural',
} as const;

// Languages
export const LANGUAGE = {
  GERMAN: 'german',
  CZECH: 'czech',
} as const;

// Slot types
export const SLOT_TYPE = {
  PRONOUN: 'pronoun',
  VERB: 'verb',
  OBJECT_PHRASE: 'object-phrase',
  FIXED: 'fixed',
} as const;

// Verb tenses
export const VERB_TENSE = {
  PRESENT: 'present',
  PAST: 'past',
  FUTURE: 'future',
  PERFECT: 'perfect',
} as const;

