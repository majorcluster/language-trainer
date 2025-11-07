// Main exports for phrase generation system
export { generatePhraseFromPattern, generateMultiplePhrases } from './phraseBuilder';
export { checkAnswer } from './answerChecker';
export { buildNounPhrase } from './nounPhraseBuilder';
export { buildPrepositionPhrase } from './prepositionPhraseBuilder';
export { processSlot } from './slotProcessors';
export type { SlotResult } from './slotProcessors';
export { capitalizeFirst, generateId, normalizeText } from './helpers';

