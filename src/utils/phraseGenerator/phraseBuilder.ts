import { GeneratedPhrase, PhrasePattern, WordVariant, VerbConjugation } from '@/types';
import { getDeclensionEngine } from '../declension';
import { getLanguageConfig } from '@/config/languages';
import { processSlot } from './slotProcessors';
import { capitalizeFirst, generateId } from './helpers';

export function generatePhraseFromPattern(
  pattern: PhrasePattern,
  verbs: VerbConjugation[] = []
): GeneratedPhrase {
  const selectedWords = selectWordsForSlots(pattern);
  const language = pattern.language;
  const engine = getDeclensionEngine(language);
  
  const { targetParts, englishParts } = buildPhraseParts(
    pattern,
    selectedWords,
    language,
    verbs,
    engine
  );
  
  const targetCorrect = targetParts.join(' ');
  const english = englishParts.join(' ');
  const targetWithoutPronoun = generatePronounDropVersion(targetParts, language);
  
  return {
    id: generateId(),
    patternId: pattern.id,
    language,
    english,
    targetCorrect,
    targetPrompt: targetCorrect,
    targetWithoutPronoun,
    selectedWords,
  };
}

function selectWordsForSlots(pattern: PhrasePattern): Record<string, WordVariant> {
  const selectedWords: Record<string, WordVariant> = {};
  
  pattern.slots.forEach((slot) => {
    if (slot.options && slot.options.length > 0) {
      const randomIndex = Math.floor(Math.random() * slot.options.length);
      selectedWords[slot.id] = slot.options[randomIndex];
    }
  });
  
  return selectedWords;
}

function buildPhraseParts(
  pattern: PhrasePattern,
  selectedWords: Record<string, WordVariant>,
  language: string,
  verbs: VerbConjugation[],
  engine: ReturnType<typeof getDeclensionEngine>
): { targetParts: string[]; englishParts: string[] } {
  const targetParts: string[] = [];
  const englishParts: string[] = [];
  let currentVerb: VerbConjugation | undefined;
  
  pattern.slots.forEach((slot, index) => {
    // Track the current verb to pass case governance to subsequent noun phrases
    if (slot.type === 'verb' && slot.verbId) {
      currentVerb = verbs.find(v => v.id === slot.verbId);
    }
    
    const slotResult = processSlot(slot, selectedWords, language, verbs, engine, currentVerb);
    
    if (slotResult.target) {
      const targetText = index === 0 
        ? capitalizeFirst(slotResult.target) 
        : slotResult.target;
      targetParts.push(targetText);
    }
    
    if (slotResult.english) {
      englishParts.push(slotResult.english);
    }
    
    // Clear verb context after an object-phrase (for next verb in sentence)
    if (slot.type === 'object-phrase') {
      currentVerb = undefined;
    }
  });
  
  return { targetParts, englishParts };
}

function generatePronounDropVersion(
  targetParts: string[],
  language: string
): string | undefined {
  const languageConfig = getLanguageConfig(language);
  
  if (!languageConfig.allowPronounDrop || targetParts.length <= 1) {
    return undefined;
  }
  
  const withoutPronoun = [...targetParts];
  withoutPronoun.shift(); // Remove first word (pronoun)
  
  if (withoutPronoun.length > 0) {
    withoutPronoun[0] = capitalizeFirst(withoutPronoun[0]);
    return withoutPronoun.join(' ');
  }
  
  return undefined;
}

export function generateMultiplePhrases(
  pattern: PhrasePattern,
  count: number = 5,
  verbs: VerbConjugation[] = []
): GeneratedPhrase[] {
  const phrases: GeneratedPhrase[] = [];
  
  for (let i = 0; i < count; i++) {
    phrases.push(generatePhraseFromPattern(pattern, verbs));
  }
  
  return phrases;
}

