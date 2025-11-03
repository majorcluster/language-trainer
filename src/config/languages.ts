import { LanguageConfig } from '@/types';

export const LANGUAGES: Record<string, LanguageConfig> = {
  german: {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    cases: ['nominative', 'accusative', 'dative', 'genitive'],
    hasGenders: true,
    genders: ['masculine', 'feminine', 'neuter'],
  },
  czech: {
    id: 'czech',
    name: 'Czech',
    nativeName: 'Čeština',
    cases: ['nominative', 'genitive', 'dative', 'accusative', 'vocative', 'locative', 'instrumental'],
    hasGenders: true,
    genders: ['masculine', 'feminine', 'neuter'],
  },
};

export function getLanguageConfig(language: string): LanguageConfig {
  return LANGUAGES[language] || LANGUAGES.german;
}

