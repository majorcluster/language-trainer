import { PhraseSlot, WordVariant, Language, VerbConjugation } from '@/types';
import { getDeclensionEngine } from '../declension';
import { buildNounPhrase } from './nounPhraseBuilder';
import { buildPrepositionPhrase } from './prepositionPhraseBuilder';
import { SLOT_TYPE, WORD_CATEGORY, GRAMMATICAL_CASE } from '@/constants';
import { getLanguageConfig } from '@/config/languages';

export interface SlotResult {
  target: string;
  english: string;
}

export function processSlot(
  slot: PhraseSlot,
  selectedWords: Record<string, WordVariant>,
  language: Language,
  verbs: VerbConjugation[],
  engine: ReturnType<typeof getDeclensionEngine>,
  precedingVerb?: VerbConjugation // Pass verb context for case governance
): SlotResult {
  // Fixed text slots
  if (slot.type === SLOT_TYPE.FIXED) {
    // Support separate text for each language
    const targetText = slot.fixedTextTarget !== undefined ? slot.fixedTextTarget : slot.fixedText || '';
    const englishText = slot.fixedTextEnglish !== undefined ? slot.fixedTextEnglish : slot.fixedText || '';
    
    return { target: targetText, english: englishText };
  }
  
  // Pronoun slots
  if (slot.type === SLOT_TYPE.PRONOUN) {
    return processPronounSlot(slot, selectedWords, engine);
  }
  
  // Verb slots
  if (slot.type === SLOT_TYPE.VERB && slot.verbId) {
    return processVerbSlot(slot, selectedWords, verbs, engine);
  }
  
  // Object phrase slots (with or without preposition)
  if (slot.type === SLOT_TYPE.OBJECT_PHRASE) {
    return processObjectPhraseSlot(slot, selectedWords, language, engine, precedingVerb);
  }
  
  return { target: '', english: '' };
}

function processPronounSlot(
  slot: PhraseSlot,
  selectedWords: Record<string, WordVariant>,
  engine: ReturnType<typeof getDeclensionEngine>
): SlotResult {
  const word = selectedWords[slot.id];
  if (!word) return { target: '', english: '' };
  
  return {
    target: word.baseForm,
    english: engine.translatePronounToEnglish(word.baseForm),
  };
}

function processVerbSlot(
  slot: PhraseSlot,
  selectedWords: Record<string, WordVariant>,
  verbs: VerbConjugation[],
  engine: ReturnType<typeof getDeclensionEngine>
): SlotResult {
  if (!slot.verbId) return { target: '', english: '' };
  
  // Find the pronoun to conjugate with
  const pronounSlot = Object.keys(selectedWords).find(key => 
    selectedWords[key].category === WORD_CATEGORY.PRONOUN
  );
  const pronoun = pronounSlot ? selectedWords[pronounSlot].baseForm : '';
  
  const conjugated = engine.conjugateVerb(pronoun, slot.verbId, verbs);
  
  // Get English verb from verb table
  const verbTable = verbs.find(v => v.id === slot.verbId);
  const englishVerb = verbTable?.english || conjugated;
  
  return {
    target: conjugated,
    english: englishVerb,
  };
}

function processObjectPhraseSlot(
  slot: PhraseSlot,
  selectedWords: Record<string, WordVariant>,
  language: Language,
  engine: ReturnType<typeof getDeclensionEngine>,
  precedingVerb?: VerbConjugation
): SlotResult {
  const word = selectedWords[slot.id];
  if (!word) return { target: '', english: '' };
  
  // Use verb's governed case if available, otherwise use slot's required case
  const grammaticalCase = precedingVerb?.governsCase || slot.requiredCase || GRAMMATICAL_CASE.NOMINATIVE;
  
  // If slot has a preposition, build a preposition phrase
  if (slot.preposition) {
    return buildPrepositionPhrase(word, grammaticalCase, language, engine, slot.preposition);
  }
  
  // Otherwise, build a simple noun phrase
  
  // For noun phrases, we randomly pick possessive and adjective to create variety
  const languageConfig = getLanguageConfig(language);
  const possessives = languageConfig.phraseBuilding.possessives;
  const randomPossessive = possessives[Math.floor(Math.random() * possessives.length)];
  
  // Pick random adjective based on language and case
  const adjectiveList = grammaticalCase === GRAMMATICAL_CASE.DATIVE && languageConfig.phraseBuilding.dativeAdjectives
    ? languageConfig.phraseBuilding.dativeAdjectives
    : languageConfig.phraseBuilding.adjectives;
    
  // Use translations from language config
  const adjectiveMap = languageConfig.phraseBuilding.translations.adjectives;
  
  const randomAdjectiveBase = adjectiveList[Math.floor(Math.random() * adjectiveList.length)];
  
  const adjective = {
    id: randomAdjectiveBase,
    baseForm: randomAdjectiveBase,
    english: adjectiveMap[randomAdjectiveBase] || randomAdjectiveBase,
    category: 'adjective' as const,
  };
  
  const targetPhrase = buildNounPhrase(
    word,
    grammaticalCase,
    engine,
    randomPossessive,
    adjective
  );
  
  const englishParts = [
    engine.translatePossessiveToEnglish(randomPossessive),
    adjective.english,
    word.english || word.baseForm,
  ];
  
  return {
    target: targetPhrase,
    english: englishParts.join(' '),
  };
}


