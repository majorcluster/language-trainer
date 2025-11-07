import { WordVariant, GrammaticalCase } from '@/types';
import { getDeclensionEngine } from '../declension';
import { GRAMMATICAL_NUMBER } from '@/constants';

export function buildNounPhrase(
  word: WordVariant,
  grammaticalCase: GrammaticalCase,
  engine: ReturnType<typeof getDeclensionEngine>,
  withPossessive?: string,
  adjective?: WordVariant
): string {
  if (!word.gender) return word.baseForm;
  
  let result = '';
  
  if (withPossessive) {
    // Possessive + adjective + noun
    const declined = engine.declinePossessive(
      withPossessive, 
      grammaticalCase, 
      word.gender,
      GRAMMATICAL_NUMBER.SINGULAR
    );
    result = declined;
    
    if (adjective) {
      const adjectiveDeclined = engine.declineAdjective(
        adjective.baseForm,
        grammaticalCase,
        word.gender,
        GRAMMATICAL_NUMBER.SINGULAR,
        false // mixed declension after possessive
      );
      result += ' ' + adjectiveDeclined;
    }
  } else {
    // Article + adjective + noun (for languages with articles)
    const article = engine.getDefiniteArticle(
      grammaticalCase, 
      word.gender,
      GRAMMATICAL_NUMBER.SINGULAR
    );
    
    if (article) {
      result = article;
    }
    
    if (adjective) {
      const adjectiveDeclined = engine.declineAdjective(
        adjective.baseForm,
        grammaticalCase,
        word.gender,
        GRAMMATICAL_NUMBER.SINGULAR,
        !!article
      );
      if (article) {
        result += ' ' + adjectiveDeclined;
      } else {
        result = adjectiveDeclined;
      }
    }
  }
  
  // Decline the noun based on case and gender
  const declinedNoun = engine.declineNoun(
    word.baseForm,
    grammaticalCase,
    word.gender,
    GRAMMATICAL_NUMBER.SINGULAR
  );
  
  result += ' ' + declinedNoun;
  return result.trim();
}

