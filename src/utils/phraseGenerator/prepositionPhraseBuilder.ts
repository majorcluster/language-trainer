import { WordVariant, GrammaticalCase, Language } from '@/types';
import { getDeclensionEngine } from '../declension';
import { mergePrepositionWithArticle } from '../declension/german';
import { getLanguageConfig } from '@/config/languages';
import { GRAMMATICAL_NUMBER } from '@/constants';

export function buildPrepositionPhrase(
  word: WordVariant,
  grammaticalCase: GrammaticalCase,
  language: Language,
  engine: ReturnType<typeof getDeclensionEngine>,
  preposition: string = 'in' // Preposition configured in the pattern
): { target: string; english: string } {
  if (!word.gender) {
    return { target: word.baseForm, english: word.english || word.baseForm };
  }
  
  const languageConfig = getLanguageConfig(language);
  
  if (languageConfig.prepositionConfig.usesArticles) {
    return buildPrepositionPhraseWithArticles(word, grammaticalCase, engine, preposition, languageConfig);
  } else {
    return buildPrepositionPhraseWithoutArticles(word, grammaticalCase, engine, preposition, languageConfig);
  }
}

function buildPrepositionPhraseWithArticles(
  word: WordVariant,
  grammaticalCase: GrammaticalCase,
  engine: ReturnType<typeof getDeclensionEngine>,
  preposition: string,
  languageConfig: ReturnType<typeof getLanguageConfig>
): { target: string; english: string } {
  const article = engine.getDefiniteArticle(
    grammaticalCase, 
    word.gender!,
    GRAMMATICAL_NUMBER.SINGULAR
  );
  
  const prepPhrase = mergePrepositionWithArticle(preposition, article);
  
  // Get English translation from config
  let englishPrep = languageConfig.prepositionConfig.prepositionToEnglish[preposition] || 'to the';
  
  // Handle case-dependent translations (e.g., "in" = "in the" vs "to the")
  if (preposition === 'in') {
    englishPrep = grammaticalCase === 'dative' ? 'in the' : 'to the';
  }
  
  // Decline the noun
  const declinedNoun = engine.declineNoun(
    word.baseForm,
    grammaticalCase,
    word.gender!,
    GRAMMATICAL_NUMBER.SINGULAR
  );
  
  return {
    target: `${prepPhrase} ${declinedNoun}`,
    english: `${englishPrep} ${word.english || word.baseForm.toLowerCase()}`,
  };
}

function buildPrepositionPhraseWithoutArticles(
  word: WordVariant,
  grammaticalCase: GrammaticalCase,
  engine: ReturnType<typeof getDeclensionEngine>,
  preposition: string,
  languageConfig: ReturnType<typeof getLanguageConfig>
): { target: string; english: string } {
  // Get English translation from config
  const englishPrep = languageConfig.prepositionConfig.prepositionToEnglish[preposition] || 'to the';
  
  // Use explicitly provided case if available (for exceptions like "bát se o + accusative")
  // Otherwise fall back to the default case for the preposition from config
  const requiredCase = grammaticalCase || 
    languageConfig.prepositionConfig.prepositionToCase?.[preposition] || 
    'accusative';
  
  // Decline the noun
  const declinedNoun = engine.declineNoun(
    word.baseForm,
    requiredCase,
    word.gender!,
    GRAMMATICAL_NUMBER.SINGULAR
  );
  
  return {
    target: `${preposition} ${declinedNoun}`,
    english: `${englishPrep} ${word.english || word.baseForm.toLowerCase()}`,
  };
}

