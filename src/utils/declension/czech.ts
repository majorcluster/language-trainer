import { GrammaticalCase, Gender, Number as GrammaticalNumber, VerbConjugation } from '@/types';
import { DeclensionEngine } from './types';

export const czechDeclension: DeclensionEngine = {
  getDefiniteArticle(): string {
    return '';
  },

  getIndefiniteArticle(): string {
    return '';
  },

  declineNoun(
    noun: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    if (number === 'plural') {
      // Simple plural rules - could be enhanced
      if (noun.endsWith('a')) return noun.slice(0, -1) + 'y';
      if (noun.endsWith('o')) return noun.slice(0, -1) + 'a';
      return noun + 'y';
    }

    // Locative case endings for common patterns
    const locativeEndings: Record<string, (noun: string) => string> = {
      'masculine': (n: string) => {
        if (n.endsWith('ek')) return n.slice(0, -2) + 'ku';
        if (n.endsWith('k')) return n.slice(0, -1) + 'ku';
        if (n.endsWith('h')) return n.slice(0, -1) + 'hu';
        if (n.endsWith('g')) return n.slice(0, -1) + 'gu';
        if (n.endsWith('ch')) return n + 'u';
        return n + 'u';
      },
      'feminine': (n: string) => {
        if (n.endsWith('ice')) return n.slice(0, -1);
        if (n.endsWith('e')) return n.slice(0, -1) + 'ě';
        if (n.endsWith('a')) return n.slice(0, -1) + 'ě';
        if (n.endsWith('ost')) return n.slice(0, -2) + 'sti';
        return n + 'ě';
      },
      'neuter': (n: string) => {
        if (n.endsWith('o')) return n.slice(0, -1) + 'ě';
        if (n.endsWith('í')) return n + 'm';
        return n + 'u';
      },
    };

    // Genitive case endings
    const genitiveEndings: Record<string, (noun: string) => string> = {
      'masculine': (n: string) => {
        if (n.endsWith('ek')) return n.slice(0, -2) + 'ku';
        return n + 'u';
      },
      'feminine': (n: string) => {
        if (n.endsWith('ice')) return n;
        if (n.endsWith('e')) return n.slice(0, -1);
        if (n.endsWith('a')) return n.slice(0, -1) + 'y';
        return n;
      },
      'neuter': (n: string) => {
        if (n.endsWith('o')) return n.slice(0, -1) + 'a';
        return n + 'a';
      },
    };

    // Dative case endings
    const dativeEndings: Record<string, (noun: string) => string> = {
      'masculine': (n: string) => n + 'u',
      'feminine': (n: string) => {
        if (n.endsWith('a')) return n.slice(0, -1) + 'ě';
        if (n.endsWith('e')) return n.slice(0, -1) + 'i';
        return n;
      },
      'neuter': (n: string) => {
        if (n.endsWith('o')) return n.slice(0, -1) + 'u';
        return n + 'u';
      },
    };

    // Accusative case endings
    const accusativeEndings: Record<string, (noun: string) => string> = {
      'masculine': (n: string) => n, // inanimate masculine = nominative
      'feminine': (n: string) => {
        if (n.endsWith('a')) return n.slice(0, -1) + 'u';
        return n;
      },
      'neuter': (n: string) => n, // = nominative
    };

    // Instrumental case endings
    const instrumentalEndings: Record<string, (noun: string) => string> = {
      'masculine': (n: string) => n + 'em',
      'feminine': (n: string) => {
        if (n.endsWith('a')) return n.slice(0, -1) + 'ou';
        if (n.endsWith('e')) return n.slice(0, -1) + 'í';
        return n;
      },
      'neuter': (n: string) => {
        if (n.endsWith('o')) return n.slice(0, -1) + 'em';
        return n + 'em';
      },
    };

    // Apply declension based on case
    switch (grammaticalCase) {
      case 'locative':
        return locativeEndings[gender](noun);
      case 'genitive':
        return genitiveEndings[gender](noun);
      case 'dative':
        return dativeEndings[gender](noun);
      case 'accusative':
        return accusativeEndings[gender](noun);
      case 'instrumental':
        return instrumentalEndings[gender](noun);
      case 'vocative':
      case 'nominative':
      default:
        return noun;
    }
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
    // Indeclinable possessives (jeho, její, jejich)
    const indeclinable = ['jeho', 'její', 'jejich'];
    if (indeclinable.includes(possessive.toLowerCase())) {
      return possessive;
    }
    
    // Declinable possessives (můj, tvůj, náš, váš) decline like adjectives
    return czechDeclension.declineAdjective(possessive, grammaticalCase, gender, number, false);
  },

  conjugateVerb(
    pronoun: string, 
    verbId: string, 
    verbs: VerbConjugation[],
    subjectGender?: Gender
  ): string {
    // Find the verb conjugation table
    const verbTable = verbs.find(v => v.id === verbId || v.infinitive === verbId);
    
    if (verbTable) {
      // For Czech past tense with gender forms
      if (verbTable.genderForms && subjectGender) {
        const genderForm = verbTable.genderForms[subjectGender];
        if (genderForm && genderForm[pronoun]) {
          return genderForm[pronoun];
        }
      }
      
      // Use default conjugations
      if (verbTable.conjugations[pronoun]) {
        return verbTable.conjugations[pronoun];
      }
    }
    
    // Fallback to old hardcoded conjugations for backwards compatibility
    const conjugations: Record<string, Record<string, string>> = {
      'šel': {
        'já': 'šel jsem',
        'ty': 'šel jsi',
        'on': 'šel',
        'ona': 'šla',
        'my': 'šli jsme',
        'vy': 'šli jste',
        'oni': 'šli',
      },
      'dal': {
        'já': 'dal jsem',
        'ty': 'dal jsi',
        'on': 'dal',
        'ona': 'dala',
        'my': 'dali jsme',
        'vy': 'dali jste',
        'oni': 'dali',
      },
    };
    return conjugations[verbId]?.[pronoun] || verbId;
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

