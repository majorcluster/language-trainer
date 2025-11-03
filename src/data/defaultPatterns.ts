import { PhrasePattern, WordVariant } from '@/types';

// Common German words for training
export const PRONOUNS: WordVariant[] = [
  { id: 'ich', baseForm: 'ich', category: 'pronoun' },
  { id: 'du', baseForm: 'du', category: 'pronoun' },
  { id: 'er', baseForm: 'er', category: 'pronoun' },
  { id: 'sie', baseForm: 'sie', category: 'pronoun' },
  { id: 'wir', baseForm: 'wir', category: 'pronoun' },
  { id: 'ihr', baseForm: 'ihr', category: 'pronoun' },
];

// Places you can go to
export const PLACES: WordVariant[] = [
  { id: 'kino', baseForm: 'Kino', english: 'cinema', category: 'noun', gender: 'neuter' },
  { id: 'schule', baseForm: 'Schule', english: 'school', category: 'noun', gender: 'feminine' },
  { id: 'park', baseForm: 'Park', english: 'park', category: 'noun', gender: 'masculine' },
  { id: 'restaurant', baseForm: 'Restaurant', english: 'restaurant', category: 'noun', gender: 'neuter' },
  { id: 'supermarkt', baseForm: 'Supermarkt', english: 'supermarket', category: 'noun', gender: 'masculine' },
  { id: 'bahnhof', baseForm: 'Bahnhof', english: 'train station', category: 'noun', gender: 'masculine' },
];

// Objects you can own/give
export const OBJECTS: WordVariant[] = [
  { id: 'auto', baseForm: 'Auto', english: 'car', category: 'noun', gender: 'neuter' },
  { id: 'buch', baseForm: 'Buch', english: 'book', category: 'noun', gender: 'neuter' },
  { id: 'tasche', baseForm: 'Tasche', english: 'bag', category: 'noun', gender: 'feminine' },
  { id: 'hemd', baseForm: 'Hemd', english: 'shirt', category: 'noun', gender: 'neuter' },
  { id: 'handy', baseForm: 'Handy', english: 'phone', category: 'noun', gender: 'neuter' },
  { id: 'fahrrad', baseForm: 'Fahrrad', english: 'bicycle', category: 'noun', gender: 'neuter' },
  { id: 'geschenk', baseForm: 'Geschenk', english: 'gift', category: 'noun', gender: 'neuter' },
];

// People
export const PEOPLE: WordVariant[] = [
  { id: 'sohn', baseForm: 'Sohn', english: 'son', category: 'noun', gender: 'masculine' },
  { id: 'tochter', baseForm: 'Tochter', english: 'daughter', category: 'noun', gender: 'feminine' },
  { id: 'bruder', baseForm: 'Bruder', english: 'brother', category: 'noun', gender: 'masculine' },
  { id: 'schwester', baseForm: 'Schwester', english: 'sister', category: 'noun', gender: 'feminine' },
  { id: 'freund', baseForm: 'Freund', english: 'friend', category: 'noun', gender: 'masculine' },
  { id: 'freundin', baseForm: 'Freundin', english: 'friend (f)', category: 'noun', gender: 'feminine' },
];

export const ADJECTIVES: WordVariant[] = [
  { id: 'alt', baseForm: 'alt', english: 'old', category: 'adjective' },
  { id: 'neu', baseForm: 'neu', english: 'new', category: 'adjective' },
  { id: 'jung', baseForm: 'jung', english: 'young', category: 'adjective' },
  { id: 'groß', baseForm: 'groß', english: 'big', category: 'adjective' },
  { id: 'klein', baseForm: 'klein', english: 'small', category: 'adjective' },
];

export const SUPERLATIVES: WordVariant[] = [
  { id: 'ältesten', baseForm: 'ältesten', english: 'oldest', category: 'adjective' },
  { id: 'jüngsten', baseForm: 'jüngsten', english: 'youngest', category: 'adjective' },
  { id: 'neuesten', baseForm: 'neuesten', english: 'newest', category: 'adjective' },
];

export const DEFAULT_PATTERNS: PhrasePattern[] = [
  {
    id: 'pattern-german-1',
    name: 'Going to a place',
    language: 'german',
    englishTemplate: '{pronoun} went to the {place}',
    targetTemplate: '{pronoun} ging {prep-phrase}',
    description: 'Practice accusative case with motion verbs',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: PRONOUNS,
      },
      {
        id: 'verb',
        type: 'fixed',
        label: 'Verb',
        fixedText: 'ging',
      },
      {
        id: 'prep-phrase',
        type: 'preposition-phrase',
        label: 'Place',
        requiredCase: 'accusative',
        options: PLACES,
      },
    ],
  },
  {
    id: 'pattern-german-2',
    name: 'Giving something to someone',
    language: 'german',
    englishTemplate: '{pronoun} gave {possessive} {adjective} {object} to {possessive2} {adjective2} {person}',
    targetTemplate: '{pronoun} gab {possessive} {adjective} {object} {possessive2} {adjective2} {person}',
    description: 'Practice dative case with indirect objects',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Subject Pronoun',
        options: PRONOUNS,
      },
      {
        id: 'verb',
        type: 'fixed',
        label: 'Verb',
        fixedText: 'gab',
      },
      {
        id: 'possessive',
        type: 'pronoun',
        label: 'Possessive (accusative)',
        options: [
          { id: 'mein', baseForm: 'mein', category: 'pronoun' },
          { id: 'dein', baseForm: 'dein', category: 'pronoun' },
          { id: 'sein', baseForm: 'sein', category: 'pronoun' },
        ],
      },
      {
        id: 'adjective',
        type: 'noun-phrase',
        label: 'Adjective (accusative)',
        requiredCase: 'accusative',
        options: ADJECTIVES,
      },
      {
        id: 'object',
        type: 'noun-phrase',
        label: 'Direct Object (accusative)',
        requiredCase: 'accusative',
        options: OBJECTS,
      },
      {
        id: 'possessive2',
        type: 'pronoun',
        label: 'Possessive (dative)',
        options: [
          { id: 'mein', baseForm: 'mein', category: 'pronoun' },
          { id: 'dein', baseForm: 'dein', category: 'pronoun' },
          { id: 'sein', baseForm: 'sein', category: 'pronoun' },
        ],
      },
      {
        id: 'adjective2',
        type: 'noun-phrase',
        label: 'Adjective (dative)',
        requiredCase: 'dative',
        options: SUPERLATIVES,
      },
      {
        id: 'person',
        type: 'noun-phrase',
        label: 'Indirect Object (dative)',
        requiredCase: 'dative',
        options: PEOPLE,
      },
    ],
  },
];

