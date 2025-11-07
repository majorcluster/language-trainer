import { LanguageConfig } from '@/types';
import { GERMAN_PATTERNS, PRONOUNS } from '@/data/germanPatterns';
import { CZECH_PATTERNS, CZECH_PRONOUNS } from '@/data/czechPatterns';
import { GERMAN_VERBS } from '@/data/germanVerbs';
import { CZECH_VERBS } from '@/data/czechVerbs';
import { germanDeclension } from '@/utils/declension/german';
import { czechDeclension } from '@/utils/declension/czech';

export const LANGUAGES: Record<string, LanguageConfig> = {
  german: {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    cases: ['nominative', 'accusative', 'dative', 'genitive'],
    hasGenders: true,
    genders: ['masculine', 'feminine', 'neuter'],
    allowPronounDrop: false, // German requires subject pronouns
    usesGenderForPastTense: false,
    examples: {
      infinitive: 'gehen',
      prepositions: 'in, zu, nach',
    },
    prepositionConfig: {
      usesArticles: true,
      prepositionToEnglish: {
        'in': 'in/to the',
        'zu': 'to the',
        'nach': 'to',
        'bei': 'at',
        'von': 'from the',
        'aus': 'out of the',
      },
    },
    phraseBuilding: {
      possessives: ['mein', 'dein', 'sein'],
      adjectives: ['alt', 'neu', 'groß', 'klein', 'schön'],
      dativeAdjectives: ['ältesten', 'jüngsten', 'neuesten'],
      translations: {
        possessives: {
          'mein': 'my',
          'dein': 'your',
          'sein': 'his',
        },
        adjectives: {
          'alt': 'old',
          'neu': 'new',
          'groß': 'big',
          'klein': 'small',
          'schön': 'beautiful',
          'ältesten': 'oldest',
          'jüngsten': 'youngest',
          'neuesten': 'newest',
        },
      },
    },
    defaultPatterns: GERMAN_PATTERNS,
    defaultPronounWords: PRONOUNS,
    defaultVerbs: GERMAN_VERBS,
    declensionEngine: germanDeclension,
  },
  czech: {
    id: 'czech',
    name: 'Czech',
    nativeName: 'Čeština',
    cases: ['nominative', 'genitive', 'dative', 'accusative', 'vocative', 'locative', 'instrumental'],
    hasGenders: true,
    genders: ['masculine', 'feminine', 'neuter'],
    allowPronounDrop: true, // Czech allows omitting subject pronouns
    genderPronounMap: {
      masculine: ['já', 'ty', 'on', 'my', 'vy', 'oni'],
      feminine: ['já', 'ty', 'ona', 'my', 'vy', 'oni'],
      neuter: ['ono', 'my', 'vy', 'ona'],
    },
    usesGenderForPastTense: true,
    examples: {
      infinitive: 'jít',
      prepositions: 'do, v, na',
    },
    prepositionConfig: {
      usesArticles: false,
      prepositionToEnglish: {
        'do': 'to the',
        'v': 'at the',
        'na': 'to the',
        'k': 'to',
        's': 'with the',
        'od': 'from the',
        'z': 'from the',
        'o': 'for/about',
        'při': 'at',
        'před': 'in front of',
        'za': 'behind',
        'nad': 'above',
        'pod': 'under',
        'bez': 'without',
        'u': 'at',
      },
      prepositionToCase: {
        'do': 'genitive',
        'od': 'genitive',
        'z': 'genitive',
        'bez': 'genitive',
        'u': 'genitive',
        'k': 'dative',
        'proti': 'dative',
        'na': 'accusative',
        'v': 'locative',
        'o': 'locative',
        'při': 'locative',
        's': 'instrumental',
        'před': 'instrumental',
        'za': 'instrumental',
        'nad': 'instrumental',
        'pod': 'instrumental',
      },
    },
    phraseBuilding: {
      possessives: ['můj', 'tvůj', 'jeho'],
      adjectives: ['starý', 'nový', 'velký', 'malý', 'krásný'],
      dativeAdjectives: ['nejstarší', 'nejmladší', 'nejnovější'],
      translations: {
        possessives: {
          'můj': 'my',
          'tvůj': 'your',
          'jeho': 'his',
        },
        adjectives: {
          'starý': 'old',
          'nový': 'new',
          'velký': 'big',
          'malý': 'small',
          'krásný': 'beautiful',
          'nejstarší': 'oldest',
          'nejmladší': 'youngest',
          'nejnovější': 'newest',
        },
      },
    },
    defaultPatterns: CZECH_PATTERNS,
    defaultPronounWords: CZECH_PRONOUNS,
    defaultVerbs: CZECH_VERBS,
    declensionEngine: czechDeclension,
  },
};

export function getLanguageConfig(language: string): LanguageConfig {
  return LANGUAGES[language] || LANGUAGES.german;
}

