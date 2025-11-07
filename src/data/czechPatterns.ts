import { PhrasePattern, WordVariant } from '@/types';

// Czech pronouns
export const CZECH_PRONOUNS: WordVariant[] = [
  { id: 'já', baseForm: 'já', english: 'I', category: 'pronoun' },
  { id: 'ty', baseForm: 'ty', english: 'you', category: 'pronoun' },
  { id: 'on', baseForm: 'on', english: 'he', category: 'pronoun' },
  { id: 'ona', baseForm: 'ona', english: 'she', category: 'pronoun' },
  { id: 'my', baseForm: 'my', english: 'we', category: 'pronoun' },
  { id: 'vy', baseForm: 'vy', english: 'you (plural)', category: 'pronoun' },
];

// Places in Czech
export const CZECH_PLACES: WordVariant[] = [
  { id: 'kino', baseForm: 'kino', english: 'cinema', category: 'noun', gender: 'neuter' },
  { id: 'škola', baseForm: 'škola', english: 'school', category: 'noun', gender: 'feminine' },
  { id: 'park', baseForm: 'park', english: 'park', category: 'noun', gender: 'masculine' },
  { id: 'restaurace', baseForm: 'restaurace', english: 'restaurant', category: 'noun', gender: 'feminine' },
  { id: 'obchod', baseForm: 'obchod', english: 'store', category: 'noun', gender: 'masculine' },
  { id: 'knihovna', baseForm: 'knihovna', english: 'library', category: 'noun', gender: 'feminine' },
  { id: 'muzeum', baseForm: 'muzeum', english: 'museum', category: 'noun', gender: 'neuter' },
  { id: 'nemocnice', baseForm: 'nemocnice', english: 'hospital', category: 'noun', gender: 'feminine' },
  { id: 'kancelář', baseForm: 'kancelář', english: 'office', category: 'noun', gender: 'feminine' },
  { id: 'divadlo', baseForm: 'divadlo', english: 'theater', category: 'noun', gender: 'neuter' },
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
  { id: 'počítač', baseForm: 'počítač', english: 'computer', category: 'noun', gender: 'masculine' },
  { id: 'hodinky', baseForm: 'hodinky', english: 'watch', category: 'noun', gender: 'feminine' },
  { id: 'klíč', baseForm: 'klíč', english: 'key', category: 'noun', gender: 'masculine' },
  { id: 'dopis', baseForm: 'dopis', english: 'letter', category: 'noun', gender: 'masculine' },
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

// Adjectives for objects in Czech
export const CZECH_ADJECTIVES: WordVariant[] = [
  { id: 'starý', baseForm: 'starý', english: 'old', category: 'adjective' },
  { id: 'nový', baseForm: 'nový', english: 'new', category: 'adjective' },
  { id: 'velký', baseForm: 'velký', english: 'big', category: 'adjective' },
  { id: 'malý', baseForm: 'malý', english: 'small', category: 'adjective' },
  { id: 'krásný', baseForm: 'krásný', english: 'beautiful', category: 'adjective' },
  { id: 'drahý', baseForm: 'drahý', english: 'expensive', category: 'adjective' },
  { id: 'levný', baseForm: 'levný', english: 'cheap', category: 'adjective' },
  { id: 'dobrý', baseForm: 'dobrý', english: 'good', category: 'adjective' },
  { id: 'špatný', baseForm: 'špatný', english: 'bad', category: 'adjective' },
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
    name: 'Being at a place',
    language: 'czech',
    englishTemplate: '{pronoun} am/is at the {place}',
    targetTemplate: '{pronoun} jsem v {place}',
    description: 'Practice locative case with location (v + locative)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: CZECH_PRONOUNS,
      },
      {
        id: 'verb',
        type: 'verb',
        label: 'Verb',
        verbId: 'být-present',
      },
      {
        id: 'place',
        type: 'object-phrase',
        label: 'Place',
        requiredCase: 'locative',
        preposition: 'v', // být + v + locative (location)
        options: CZECH_PLACES,
      },
    ],
  },
  {
    id: 'pattern-czech-2',
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
        type: 'verb',
        label: 'Verb',
        verbId: 'jít-past',
      },
      {
        id: 'place',
        type: 'object-phrase',
        label: 'Place',
        requiredCase: 'genitive',
        preposition: 'do', // jít + do + genitive (motion towards)
        options: CZECH_PLACES,
      },
    ],
  },
  {
    id: 'pattern-czech-3',
    name: 'Giving something to someone',
    language: 'czech',
    englishTemplate: '{pronoun} gave {object} to {person}',
    targetTemplate: '{pronoun} dal {object} {person}',
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
        type: 'verb',
        label: 'Verb',
        verbId: 'dát-past',
      },
      {
        id: 'object',
        type: 'object-phrase',
        label: 'Direct Object (accusative) - auto-generates possessive + adjective',
        requiredCase: 'accusative',
        options: CZECH_OBJECTS,
      },
      {
        id: 'to',
        type: 'fixed',
        label: 'To (English only)',
        fixedTextEnglish: 'to',
        fixedTextTarget: '', // Empty string for Czech - no word in target language
      },
      {
        id: 'person',
        type: 'object-phrase',
        label: 'Indirect Object (dative) - auto-generates possessive + adjective',
        requiredCase: 'dative',
        options: CZECH_PEOPLE,
      },
    ],
  },
  {
    id: 'pattern-czech-4',
    name: 'Having an object (present)',
    language: 'czech',
    englishTemplate: '{pronoun} have {object}',
    targetTemplate: '{pronoun} mám {object}',
    description: 'Practice accusative case with mít (present tense)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: CZECH_PRONOUNS,
      },
      {
        id: 'verb',
        type: 'verb',
        label: 'Verb',
        verbId: 'mít-present',
      },
      {
        id: 'object',
        type: 'object-phrase',
        label: 'Direct Object (accusative)',
        requiredCase: 'accusative',
        options: CZECH_OBJECTS,
      },
    ],
  },
  {
    id: 'pattern-czech-5',
    name: 'Being afraid of something',
    language: 'czech',
    englishTemplate: '{pronoun} am/is afraid of {object}',
    targetTemplate: '{pronoun} bojím se {object}',
    description: 'Practice genitive case with reflexive verbs (bát se + genitive)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: CZECH_PRONOUNS,
      },
      {
        id: 'verb',
        type: 'verb',
        label: 'Verb',
        verbId: 'bát-se-present',
      },
      {
        id: 'object',
        type: 'object-phrase',
        label: 'Object (genitive - governed by verb)',
        // requiredCase not specified - will use verb's governsCase (genitive)
        options: [
          { id: 'pes', baseForm: 'pes', english: 'dog', category: 'noun', gender: 'masculine' },
          { id: 'tma', baseForm: 'tma', english: 'darkness', category: 'noun', gender: 'feminine' },
          { id: 'pavouci', baseForm: 'pavouk', english: 'spiders', category: 'noun', gender: 'masculine' },
        ],
      },
    ],
  },
  {
    id: 'pattern-czech-6',
    name: 'Being afraid for someone',
    language: 'czech',
    englishTemplate: '{pronoun} am/is afraid for {person}',
    targetTemplate: '{pronoun} bojím se o {person}',
    description: 'Practice accusative case with reflexive verbs (bát se o + accusative)',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Pronoun',
        options: CZECH_PRONOUNS,
      },
      {
        id: 'verb',
        type: 'verb',
        label: 'Verb',
        verbId: 'bát-se-present',
      },
      {
        id: 'person',
        type: 'object-phrase',
        label: 'Person',
        requiredCase: 'accusative',
        preposition: 'o', // bát se o + accusative (concern/worry - exception to normal o + locative)
        options: [
          { id: 'dítě', baseForm: 'dítě', english: 'child', category: 'noun', gender: 'neuter' },
          { id: 'přítel', baseForm: 'přítel', english: 'friend', category: 'noun', gender: 'masculine' },
          { id: 'rodina', baseForm: 'rodina', english: 'family', category: 'noun', gender: 'feminine' },
        ],
      },
    ],
  },
];

