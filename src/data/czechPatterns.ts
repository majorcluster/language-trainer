import { PhrasePattern, WordVariant } from '@/types';

// Czech pronouns
export const CZECH_PRONOUNS: WordVariant[] = [
  { id: 'já', baseForm: 'já', category: 'pronoun' },
  { id: 'ty', baseForm: 'ty', category: 'pronoun' },
  { id: 'on', baseForm: 'on', category: 'pronoun' },
  { id: 'ona', baseForm: 'ona', category: 'pronoun' },
  { id: 'my', baseForm: 'my', category: 'pronoun' },
  { id: 'vy', baseForm: 'vy', category: 'pronoun' },
];

// Places in Czech
export const CZECH_PLACES: WordVariant[] = [
  { id: 'kino', baseForm: 'kino', english: 'cinema', category: 'noun', gender: 'neuter' },
  { id: 'škola', baseForm: 'škola', english: 'school', category: 'noun', gender: 'feminine' },
  { id: 'park', baseForm: 'park', english: 'park', category: 'noun', gender: 'masculine' },
  { id: 'restaurace', baseForm: 'restaurace', english: 'restaurant', category: 'noun', gender: 'feminine' },
  { id: 'obchod', baseForm: 'obchod', english: 'store', category: 'noun', gender: 'masculine' },
];

// Objects in Czech
export const CZECH_OBJECTS: WordVariant[] = [
  { id: 'auto', baseForm: 'auto', english: 'car', category: 'noun', gender: 'neuter' },
  { id: 'kniha', baseForm: 'kniha', english: 'book', category: 'noun', gender: 'feminine' },
  { id: 'taška', baseForm: 'taška', english: 'bag', category: 'noun', gender: 'feminine' },
  { id: 'košile', baseForm: 'košile', english: 'shirt', category: 'noun', gender: 'feminine' },
  { id: 'telefon', baseForm: 'telefon', english: 'phone', category: 'noun', gender: 'masculine' },
  { id: 'kolo', baseForm: 'kolo', english: 'bicycle', category: 'noun', gender: 'neuter' },
  { id: 'dárek', baseForm: 'dárek', english: 'gift', category: 'noun', gender: 'masculine' },
];

// People in Czech
export const CZECH_PEOPLE: WordVariant[] = [
  { id: 'syn', baseForm: 'syn', english: 'son', category: 'noun', gender: 'masculine' },
  { id: 'dcera', baseForm: 'dcera', english: 'daughter', category: 'noun', gender: 'feminine' },
  { id: 'bratr', baseForm: 'bratr', english: 'brother', category: 'noun', gender: 'masculine' },
  { id: 'sestra', baseForm: 'sestra', english: 'sister', category: 'noun', gender: 'feminine' },
  { id: 'přítel', baseForm: 'přítel', english: 'friend (m)', category: 'noun', gender: 'masculine' },
  { id: 'přítelkyně', baseForm: 'přítelkyně', english: 'friend (f)', category: 'noun', gender: 'feminine' },
];

// Adjectives in Czech
export const CZECH_ADJECTIVES: WordVariant[] = [
  { id: 'starý', baseForm: 'starý', english: 'old', category: 'adjective' },
  { id: 'nový', baseForm: 'nový', english: 'new', category: 'adjective' },
  { id: 'mladý', baseForm: 'mladý', english: 'young', category: 'adjective' },
  { id: 'velký', baseForm: 'velký', english: 'big', category: 'adjective' },
  { id: 'malý', baseForm: 'malý', english: 'small', category: 'adjective' },
];

// Superlative adjectives in Czech
export const CZECH_SUPERLATIVES: WordVariant[] = [
  { id: 'nejstarší', baseForm: 'nejstarší', english: 'oldest', category: 'adjective' },
  { id: 'nejmladší', baseForm: 'nejmladší', english: 'youngest', category: 'adjective' },
  { id: 'největší', baseForm: 'největší', english: 'biggest', category: 'adjective' },
];

export const CZECH_PATTERNS: PhrasePattern[] = [
  {
    id: 'pattern-czech-1',
    name: 'Going to a place',
    language: 'czech',
    englishTemplate: '{pronoun} went to the {place}',
    targetTemplate: '{pronoun} šel do {place}',
    description: 'Practice genitive case with motion verbs (do + genitive)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: CZECH_PRONOUNS,
      },
      {
        id: 'verb',
        type: 'fixed',
        label: 'Verb',
        fixedText: 'šel',
      },
      {
        id: 'place',
        type: 'preposition-phrase',
        label: 'Place',
        requiredCase: 'genitive',
        options: CZECH_PLACES,
      },
    ],
  },
  {
    id: 'pattern-czech-2',
    name: 'Giving something to someone',
    language: 'czech',
    englishTemplate: '{pronoun} gave {possessive} {adjective} {object} to {possessive2} {adjective2} {person}',
    targetTemplate: '{pronoun} dal {possessive} {adjective} {object} {possessive2} {adjective2} {person}',
    description: 'Practice dative case with indirect objects',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Subject Pronoun',
        options: CZECH_PRONOUNS,
      },
      {
        id: 'verb',
        type: 'fixed',
        label: 'Verb',
        fixedText: 'dal',
      },
      {
        id: 'possessive',
        type: 'pronoun',
        label: 'Possessive (accusative)',
        options: [
          { id: 'můj', baseForm: 'můj', category: 'pronoun' },
          { id: 'tvůj', baseForm: 'tvůj', category: 'pronoun' },
          { id: 'jeho', baseForm: 'jeho', category: 'pronoun' },
        ],
      },
      {
        id: 'adjective',
        type: 'noun-phrase',
        label: 'Adjective (accusative)',
        requiredCase: 'accusative',
        options: CZECH_ADJECTIVES,
      },
      {
        id: 'object',
        type: 'noun-phrase',
        label: 'Direct Object (accusative)',
        requiredCase: 'accusative',
        options: CZECH_OBJECTS,
      },
      {
        id: 'possessive2',
        type: 'pronoun',
        label: 'Possessive (dative)',
        options: [
          { id: 'můj', baseForm: 'můj', category: 'pronoun' },
          { id: 'tvůj', baseForm: 'tvůj', category: 'pronoun' },
          { id: 'jeho', baseForm: 'jeho', category: 'pronoun' },
        ],
      },
      {
        id: 'adjective2',
        type: 'noun-phrase',
        label: 'Adjective (dative)',
        requiredCase: 'dative',
        options: CZECH_SUPERLATIVES,
      },
      {
        id: 'person',
        type: 'noun-phrase',
        label: 'Indirect Object (dative)',
        requiredCase: 'dative',
        options: CZECH_PEOPLE,
      },
    ],
  },
];

