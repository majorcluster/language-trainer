import { Language } from '@/types';
import { DeclensionEngine } from './types';
import { germanDeclension } from './german';
import { czechDeclension } from './czech';

export function getDeclensionEngine(language: Language): DeclensionEngine {
  switch (language) {
    case 'german':
      return germanDeclension;
    case 'czech':
      return czechDeclension;
    default:
      return germanDeclension;
  }
}

export * from './types';
export { germanDeclension } from './german';
export { czechDeclension } from './czech';
export { mergePrepositionWithArticle, getCaseForPreposition } from './german';
export { getCzechCaseForPreposition } from './czech';

