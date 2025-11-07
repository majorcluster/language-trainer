import { PhrasePattern, WordVariant } from '@/types';

// Common German words for training
export const PRONOUNS: WordVariant[] = [
  { id: 'ich', baseForm: 'ich', english: 'I', category: 'pronoun' },
  { id: 'du', baseForm: 'du', english: 'you', category: 'pronoun' },
  { id: 'er', baseForm: 'er', english: 'he', category: 'pronoun' },
  { id: 'sie', baseForm: 'sie', english: 'she', category: 'pronoun' },
  { id: 'wir', baseForm: 'wir', english: 'we', category: 'pronoun' },
  { id: 'ihr', baseForm: 'ihr', english: 'you (plural)', category: 'pronoun' },
];

// Places you can go to
export const PLACES: WordVariant[] = [
  { id: 'kino', baseForm: 'Kino', english: 'cinema', category: 'noun', gender: 'neuter' },
  { id: 'schule', baseForm: 'Schule', english: 'school', category: 'noun', gender: 'feminine' },
  { id: 'park', baseForm: 'Park', english: 'park', category: 'noun', gender: 'masculine' },
  { id: 'restaurant', baseForm: 'Restaurant', english: 'restaurant', category: 'noun', gender: 'neuter' },
  { id: 'supermarkt', baseForm: 'Supermarkt', english: 'supermarket', category: 'noun', gender: 'masculine' },
  { id: 'bahnhof', baseForm: 'Bahnhof', english: 'train station', category: 'noun', gender: 'masculine' },
  { id: 'bibliothek', baseForm: 'Bibliothek', english: 'library', category: 'noun', gender: 'feminine' },
  { id: 'museum', baseForm: 'Museum', english: 'museum', category: 'noun', gender: 'neuter' },
  { id: 'krankenhaus', baseForm: 'Krankenhaus', english: 'hospital', category: 'noun', gender: 'neuter' },
  { id: 'büro', baseForm: 'Büro', english: 'office', category: 'noun', gender: 'neuter' },
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
  { id: 'laptop', baseForm: 'Laptop', english: 'laptop', category: 'noun', gender: 'masculine' },
  { id: 'uhr', baseForm: 'Uhr', english: 'watch', category: 'noun', gender: 'feminine' },
  { id: 'schlüssel', baseForm: 'Schlüssel', english: 'key', category: 'noun', gender: 'masculine' },
  { id: 'brief', baseForm: 'Brief', english: 'letter', category: 'noun', gender: 'masculine' },
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

// Adjectives for objects (things)
export const ADJECTIVES: WordVariant[] = [
  { id: 'alt', baseForm: 'alt', english: 'old', category: 'adjective' },
  { id: 'neu', baseForm: 'neu', english: 'new', category: 'adjective' },
  { id: 'groß', baseForm: 'groß', english: 'big', category: 'adjective' },
  { id: 'klein', baseForm: 'klein', english: 'small', category: 'adjective' },
  { id: 'schön', baseForm: 'schön', english: 'beautiful', category: 'adjective' },
  { id: 'teuer', baseForm: 'teuer', english: 'expensive', category: 'adjective' },
  { id: 'billig', baseForm: 'billig', english: 'cheap', category: 'adjective' },
  { id: 'gut', baseForm: 'gut', english: 'good', category: 'adjective' },
  { id: 'schlecht', baseForm: 'schlecht', english: 'bad', category: 'adjective' },
];

export const SUPERLATIVES: WordVariant[] = [
  { id: 'ältesten', baseForm: 'ältesten', english: 'oldest', category: 'adjective' },
  { id: 'jüngsten', baseForm: 'jüngsten', english: 'youngest', category: 'adjective' },
  { id: 'neuesten', baseForm: 'neuesten', english: 'newest', category: 'adjective' },
];

export const GERMAN_PATTERNS: PhrasePattern[] = [
  {
    id: 'pattern-german-present-1',
    name: 'Having an object (present)',
    language: 'german',
    englishTemplate: '{pronoun} have {object}',
    targetTemplate: '{pronoun} habe {object}',
    description: 'Practice accusative case with haben (present tense)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: PRONOUNS,
      },
      {
        id: 'verb',
        type: 'verb',
        label: 'Verb',
        verbId: 'haben-present',
      },
      {
        id: 'object',
        type: 'object-phrase',
        label: 'Direct Object (accusative)',
        requiredCase: 'accusative',
        options: OBJECTS,
      },
    ],
  },
  {
    id: 'pattern-german-1',
    name: 'Going to a place (past)',
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
        type: 'verb',
        label: 'Verb',
        verbId: 'gehen-past',
      },
      {
        id: 'prep-phrase',
        type: 'object-phrase',
        label: 'Place',
        requiredCase: 'accusative',
        preposition: 'in', // gehen + in + accusative (motion)
        options: PLACES,
      },
    ],
  },
  {
    id: 'pattern-german-2',
    name: 'Giving something to someone',
    language: 'german',
    englishTemplate: '{pronoun} gave {object} to {person}',
    targetTemplate: '{pronoun} gab {object} {person}',
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
        type: 'verb',
        label: 'Verb',
        verbId: 'geben-past',
      },
      {
        id: 'object',
        type: 'object-phrase',
        label: 'Direct Object (accusative) - auto-generates possessive + adjective',
        requiredCase: 'accusative',
        options: OBJECTS,
      },
      {
        id: 'to',
        type: 'fixed',
        label: 'To (English only)',
        fixedTextEnglish: 'to',
        fixedTextTarget: '', // Empty string for German - no word in target language
      },
      {
        id: 'person',
        type: 'object-phrase',
        label: 'Indirect Object (dative) - auto-generates possessive + adjective',
        requiredCase: 'dative',
        options: PEOPLE,
      },
    ],
  },
  {
    id: 'pattern-german-3',
    name: 'Being at a place (present)',
    language: 'german',
    englishTemplate: '{pronoun} am/is in the {place}',
    targetTemplate: '{pronoun} bin in {prep-phrase}',
    description: 'Practice dative case with location (in + dative)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: PRONOUNS,
      },
      {
        id: 'verb',
        type: 'verb',
        label: 'Verb',
        verbId: 'sein-present',
      },
      {
        id: 'prep-phrase',
        type: 'object-phrase',
        label: 'Place',
        requiredCase: 'dative',
        preposition: 'in', // sein + in + dative (location)
        options: PLACES,
      },
    ],
  },
];

