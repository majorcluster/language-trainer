import { Language } from '@/types';
import { DeclensionEngine } from './types';
import { getLanguageConfig } from '@/config/languages';

export function getDeclensionEngine(language: Language): DeclensionEngine {
  const languageConfig = getLanguageConfig(language);
  return languageConfig.declensionEngine;
}

export * from './types';
export { germanDeclension } from './german';
export { czechDeclension } from './czech';
export { mergePrepositionWithArticle, getCaseForPreposition } from './german';
export { getCzechCaseForPreposition } from './czech';

