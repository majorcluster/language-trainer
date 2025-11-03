import { GrammaticalCase, Gender, Number as GrammaticalNumber } from '@/types';
import { DeclensionEngine } from './types';

// German article declensions
const DEFINITE_ARTICLES: Record<string, string> = {
  'nominative_masculine_singular': 'der',
  'nominative_feminine_singular': 'die',
  'nominative_neuter_singular': 'das',
  'nominative_plural': 'die',
  'accusative_masculine_singular': 'den',
  'accusative_feminine_singular': 'die',
  'accusative_neuter_singular': 'das',
  'accusative_plural': 'die',
  'dative_masculine_singular': 'dem',
  'dative_feminine_singular': 'der',
  'dative_neuter_singular': 'dem',
  'dative_plural': 'den',
  'genitive_masculine_singular': 'des',
  'genitive_feminine_singular': 'der',
  'genitive_neuter_singular': 'des',
  'genitive_plural': 'der',
};

const INDEFINITE_ARTICLES: Record<string, string> = {
  'nominative_masculine_singular': 'ein',
  'nominative_feminine_singular': 'eine',
  'nominative_neuter_singular': 'ein',
  'accusative_masculine_singular': 'einen',
  'accusative_feminine_singular': 'eine',
  'accusative_neuter_singular': 'ein',
  'dative_masculine_singular': 'einem',
  'dative_feminine_singular': 'einer',
  'dative_neuter_singular': 'einem',
  'genitive_masculine_singular': 'eines',
  'genitive_feminine_singular': 'einer',
  'genitive_neuter_singular': 'eines',
};

const POSSESSIVE_ENDINGS: Record<string, string> = {
  'nominative_masculine_singular': '',
  'nominative_feminine_singular': 'e',
  'nominative_neuter_singular': '',
  'nominative_plural': 'e',
  'accusative_masculine_singular': 'en',
  'accusative_feminine_singular': 'e',
  'accusative_neuter_singular': '',
  'accusative_plural': 'e',
  'dative_masculine_singular': 'em',
  'dative_feminine_singular': 'er',
  'dative_neuter_singular': 'em',
  'dative_plural': 'en',
  'genitive_masculine_singular': 'es',
  'genitive_feminine_singular': 'er',
  'genitive_neuter_singular': 'es',
  'genitive_plural': 'er',
};

const WEAK_ADJECTIVE_ENDINGS: Record<string, string> = {
  'nominative_masculine_singular': 'e',
  'nominative_feminine_singular': 'e',
  'nominative_neuter_singular': 'e',
  'nominative_plural': 'en',
  'accusative_masculine_singular': 'en',
  'accusative_feminine_singular': 'e',
  'accusative_neuter_singular': 'e',
  'accusative_plural': 'en',
  'dative_masculine_singular': 'en',
  'dative_feminine_singular': 'en',
  'dative_neuter_singular': 'en',
  'dative_plural': 'en',
  'genitive_masculine_singular': 'en',
  'genitive_feminine_singular': 'en',
  'genitive_neuter_singular': 'en',
  'genitive_plural': 'en',
};

const MIXED_ADJECTIVE_ENDINGS: Record<string, string> = {
  'nominative_masculine_singular': 'er',
  'nominative_feminine_singular': 'e',
  'nominative_neuter_singular': 'es',
  'nominative_plural': 'en',
  'accusative_masculine_singular': 'en',
  'accusative_feminine_singular': 'e',
  'accusative_neuter_singular': 'es',
  'accusative_plural': 'en',
  'dative_masculine_singular': 'en',
  'dative_feminine_singular': 'en',
  'dative_neuter_singular': 'en',
  'dative_plural': 'en',
  'genitive_masculine_singular': 'en',
  'genitive_feminine_singular': 'en',
  'genitive_neuter_singular': 'en',
  'genitive_plural': 'en',
};

export const germanDeclension: DeclensionEngine = {
  getDefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    if (number === 'plural') {
      return DEFINITE_ARTICLES[`${grammaticalCase}_plural`] || 'die';
    }
    const key = `${grammaticalCase}_${gender}_${number}`;
    return DEFINITE_ARTICLES[key] || 'der';
  },

  getIndefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender
  ): string {
    const key = `${grammaticalCase}_${gender}_singular`;
    return INDEFINITE_ARTICLES[key] || 'ein';
  },

  declineAdjective(
    adjective: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular',
    hasDefiniteArticle: boolean = true
  ): string {
    const key = number === 'plural' 
      ? `${grammaticalCase}_plural` 
      : `${grammaticalCase}_${gender}_${number}`;
    
    const endings = hasDefiniteArticle ? WEAK_ADJECTIVE_ENDINGS : MIXED_ADJECTIVE_ENDINGS;
    const ending = endings[key] || 'en';
    
    const base = adjective.replace(/e[nrs]?$/, '');
    return base + ending;
  },

  declinePossessive(
    possessive: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    const key = number === 'plural' 
      ? `${grammaticalCase}_plural` 
      : `${grammaticalCase}_${gender}_${number}`;
    const ending = POSSESSIVE_ENDINGS[key] || '';
    const base = possessive.replace(/e[nrs]?$/, '');
    return base + ending;
  },

  conjugateVerb(pronoun: string, verb: string): string {
    const conjugations: Record<string, Record<string, string>> = {
      'ging': {
        'ich': 'ging',
        'du': 'gingst',
        'er': 'ging',
        'sie': 'ging',
        'wir': 'gingen',
        'ihr': 'gingt',
      },
      'gab': {
        'ich': 'gab',
        'du': 'gabst',
        'er': 'gab',
        'sie': 'gab',
        'wir': 'gaben',
        'ihr': 'gabt',
      },
    };
    return conjugations[verb]?.[pronoun] || verb;
  },

  translatePronounToEnglish(germanPronoun: string): string {
    const translations: Record<string, string> = {
      'ich': 'I',
      'du': 'you',
      'er': 'he',
      'sie': 'she',
      'es': 'it',
      'wir': 'we',
      'ihr': 'you (plural)',
      'sie-formal': 'you',
    };
    return translations[germanPronoun] || germanPronoun;
  },

  translatePossessiveToEnglish(germanPossessive: string): string {
    const translations: Record<string, string> = {
      'mein': 'my',
      'dein': 'your',
      'sein': 'his',
      'ihr': 'her',
      'unser': 'our',
      'euer': 'your',
    };
    return translations[germanPossessive] || germanPossessive;
  },
};

// Helper to merge preposition with article (contraction)
export function mergePrepositionWithArticle(preposition: string, article: string): string {
  const contractions: Record<string, string> = {
    'in_das': 'ins',
    'in_dem': 'im',
    'an_das': 'ans',
    'an_dem': 'am',
    'zu_der': 'zur',
    'zu_dem': 'zum',
    'bei_dem': 'beim',
    'von_dem': 'vom',
    'auf_das': 'aufs',
  };
  
  const key = `${preposition}_${article}`;
  return contractions[key] || `${preposition} ${article}`;
}

// Prepositions and their required cases
export const PREPOSITION_CASES: Record<string, GrammaticalCase> = {
  'in': 'accusative',
  'zu': 'dative',
  'nach': 'dative',
  'bei': 'dative',
  'mit': 'dative',
  'von': 'dative',
  'aus': 'dative',
  'für': 'accusative',
  'durch': 'accusative',
  'ohne': 'accusative',
  'gegen': 'accusative',
  'um': 'accusative',
};

export function getCaseForPreposition(preposition: string): GrammaticalCase {
  return PREPOSITION_CASES[preposition.toLowerCase()] || 'accusative';
}

