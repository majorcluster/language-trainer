import { GrammaticalCase, Gender, Number as GrammaticalNumber } from '@/types';
import { DeclensionEngine } from './types';

// Czech doesn't use articles, but we'll implement the interface for consistency
// In Czech, case is shown through noun and adjective endings

export const czechDeclension: DeclensionEngine = {
  getDefiniteArticle(): string {
    // Czech has no articles
    return '';
  },

  getIndefiniteArticle(): string {
    // Czech has no articles
    return '';
  },

  declineAdjective(
    adjective: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular',
    _hasDefiniteArticle: boolean = true
  ): string {
    // Hard adjective endings (pattern 1)
    const hardEndings: Record<string, string> = {
      'nominative_masculine_singular': 'ý',
      'nominative_feminine_singular': 'á',
      'nominative_neuter_singular': 'é',
      'genitive_masculine_singular': 'ého',
      'genitive_feminine_singular': 'é',
      'genitive_neuter_singular': 'ého',
      'dative_masculine_singular': 'ému',
      'dative_feminine_singular': 'é',
      'dative_neuter_singular': 'ému',
      'accusative_masculine_singular': 'ého', // animate
      'accusative_feminine_singular': 'ou',
      'accusative_neuter_singular': 'é',
      'vocative_masculine_singular': 'ý',
      'vocative_feminine_singular': 'á',
      'vocative_neuter_singular': 'é',
      'locative_masculine_singular': 'ém',
      'locative_feminine_singular': 'é',
      'locative_neuter_singular': 'ém',
      'instrumental_masculine_singular': 'ým',
      'instrumental_feminine_singular': 'ou',
      'instrumental_neuter_singular': 'ým',
      // Plurals
      'nominative_plural': 'é',
      'genitive_plural': 'ých',
      'dative_plural': 'ým',
      'accusative_plural': 'é',
      'vocative_plural': 'é',
      'locative_plural': 'ých',
      'instrumental_plural': 'ými',
    };

    const key = number === 'plural' 
      ? `${grammaticalCase}_plural` 
      : `${grammaticalCase}_${gender}_${number}`;
    
    const ending = hardEndings[key] || 'ý';
    
    // Remove existing ending and add new one
    const base = adjective.replace(/[ýáéíóúůěň]+$/, '');
    return base + ending;
  },

  declinePossessive(
    possessive: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    // Czech possessives decline like adjectives
    return this.declineAdjective(possessive, grammaticalCase, gender, number, false);
  },

  conjugateVerb(pronoun: string, verb: string): string {
    const conjugations: Record<string, Record<string, string>> = {
      'šel': { // went (masculine)
        'já': 'šel',
        'ty': 'šel',
        'on': 'šel',
        'ona': 'šla',
        'my': 'šli',
        'vy': 'šli',
        'oni': 'šli',
      },
      'dal': { // gave
        'já': 'dal',
        'ty': 'dal',
        'on': 'dal',
        'ona': 'dala',
        'my': 'dali',
        'vy': 'dali',
        'oni': 'dali',
      },
    };
    return conjugations[verb]?.[pronoun] || verb;
  },

  translatePronounToEnglish(czechPronoun: string): string {
    const translations: Record<string, string> = {
      'já': 'I',
      'ty': 'you',
      'on': 'he',
      'ona': 'she',
      'ono': 'it',
      'my': 'we',
      'vy': 'you (plural)',
      'oni': 'they',
    };
    return translations[czechPronoun] || czechPronoun;
  },

  translatePossessiveToEnglish(czechPossessive: string): string {
    const translations: Record<string, string> = {
      'můj': 'my',
      'tvůj': 'your',
      'jeho': 'his',
      'její': 'her',
      'náš': 'our',
      'váš': 'your',
      'jejich': 'their',
    };
    return translations[czechPossessive] || czechPossessive;
  },
};

// Czech prepositions and their required cases
export const CZECH_PREPOSITION_CASES: Record<string, GrammaticalCase> = {
  'do': 'genitive',
  'od': 'genitive',
  'z': 'genitive',
  'bez': 'genitive',
  'u': 'genitive',
  'k': 'dative',
  'proti': 'dative',
  'na': 'accusative', // or locative depending on context
  'v': 'locative',
  'o': 'locative',
  'při': 'locative',
  's': 'instrumental',
  'před': 'instrumental',
  'za': 'instrumental',
  'nad': 'instrumental',
  'pod': 'instrumental',
};

export function getCzechCaseForPreposition(preposition: string): GrammaticalCase {
  return CZECH_PREPOSITION_CASES[preposition.toLowerCase()] || 'accusative';
}

