import { GeneratedPhrase, PhrasePattern, WordVariant, GrammaticalCase, Language } from '@/types';
import { getDeclensionEngine } from './declension';
import { mergePrepositionWithArticle } from './declension/german';

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function declineNounPhrase(
  word: WordVariant,
  grammaticalCase: GrammaticalCase,
  language: Language,
  withPossessive?: string,
  adjective?: WordVariant
): string {
  if (!word.gender) return word.baseForm;

  const engine = getDeclensionEngine(language);
  let result = '';

  if (withPossessive) {
    // Possessive + adjective + noun
    const declined = engine.declinePossessive(withPossessive, grammaticalCase, word.gender);
    result = declined;

    if (adjective) {
      const adjectiveDeclined = engine.declineAdjective(
        adjective.baseForm,
        grammaticalCase,
        word.gender,
        'singular',
        false // mixed declension after possessive
      );
      result += ' ' + adjectiveDeclined;
    }
  } else {
    // Article + adjective + noun (for languages with articles like German)
    const article = engine.getDefiniteArticle(grammaticalCase, word.gender);
    if (article) {
      result = article;
    }

    if (adjective) {
      const adjectiveDeclined = engine.declineAdjective(
        adjective.baseForm,
        grammaticalCase,
        word.gender,
        'singular',
        !!article // weak declension after article
      );
      if (article) {
        result += ' ' + adjectiveDeclined;
      } else {
        result = adjectiveDeclined;
      }
    }
  }

  result += ' ' + word.baseForm;
  return result.trim();
}

// Language-agnostic helpers using declension engine
function translatePronounToEnglish(pronoun: string, language: Language): string {
  const engine = getDeclensionEngine(language);
  return engine.translatePronounToEnglish(pronoun);
}

function translatePossessiveToEnglish(possessive: string, language: Language): string {
  const engine = getDeclensionEngine(language);
  return engine.translatePossessiveToEnglish(possessive);
}

export function generatePhraseFromPattern(pattern: PhrasePattern): GeneratedPhrase {
  const selectedWords: Record<string, WordVariant> = {};
  let targetParts: string[] = [];
  let englishParts: string[] = [];
  const language = pattern.language;
  const engine = getDeclensionEngine(language);

  pattern.slots.forEach((slot) => {
    if (slot.type === 'fixed' && slot.fixedText) {
      return; // Fixed text is handled separately
    }

    if (slot.options && slot.options.length > 0) {
      selectedWords[slot.id] = randomChoice(slot.options);
    }
  });

  // Build phrase based on pattern
  if (pattern.id === 'pattern-german-1' || pattern.id === 'pattern-czech-1') {
    // "I went to the cinema" -> "Ich ging ins Kino" (German) or "Já šel do kina" (Czech)
    const pronoun = selectedWords['pronoun'];
    const place = selectedWords['prep-phrase'] || selectedWords['place'];
    
    const verbBase = language === 'german' ? 'ging' : 'šel';
    const verb = engine.conjugateVerb(pronoun.baseForm, verbBase);
    
    if (language === 'german') {
      const article = engine.getDefiniteArticle('accusative', place.gender!);
      const prepPhrase = mergePrepositionWithArticle('in', article);
      
      targetParts = [
        pronoun.baseForm.charAt(0).toUpperCase() + pronoun.baseForm.slice(1),
        verb,
        prepPhrase,
        place.baseForm
      ];
    } else {
      // Czech: do + genitive
      targetParts = [
        pronoun.baseForm.charAt(0).toUpperCase() + pronoun.baseForm.slice(1),
        verb,
        'do',
        place.baseForm // Czech nouns decline, would need full declension table
      ];
    }
    
    englishParts = [
      translatePronounToEnglish(pronoun.baseForm, language),
      'went',
      'to the',
      place.english || place.baseForm.toLowerCase()
    ];
  } else if (pattern.id === 'pattern-german-2' || pattern.id === 'pattern-czech-2') {
    // Complex giving pattern
    const pronoun = selectedWords['pronoun'];
    const possessive1 = selectedWords['possessive'];
    const adj1 = selectedWords['adjective'];
    const object = selectedWords['object'];
    const possessive2 = selectedWords['possessive2'];
    const adj2 = selectedWords['adjective2'];
    const person = selectedWords['person'];

    const verbBase = language === 'german' ? 'gab' : 'dal';
    const verb = engine.conjugateVerb(pronoun.baseForm, verbBase);
    
    // Accusative phrase (direct object)
    const accusativePhrase = declineNounPhrase(
      object,
      'accusative',
      language,
      possessive1.baseForm,
      adj1
    );
    
    // Dative phrase (indirect object)
    const dativePhrase = declineNounPhrase(
      person,
      'dative',
      language,
      possessive2.baseForm,
      adj2
    );

    targetParts = [
      pronoun.baseForm.charAt(0).toUpperCase() + pronoun.baseForm.slice(1),
      verb,
      accusativePhrase,
      dativePhrase
    ];

    englishParts = [
      translatePronounToEnglish(pronoun.baseForm, language),
      'gave',
      translatePossessiveToEnglish(possessive1.baseForm, language),
      adj1.english || adj1.baseForm,
      object.english || object.baseForm.toLowerCase(),
      'to',
      translatePossessiveToEnglish(possessive2.baseForm, language),
      adj2.english || adj2.baseForm,
      person.english || person.baseForm.toLowerCase()
    ];
  }

  const targetCorrect = targetParts.join(' ');
  const english = englishParts.join(' ');

  // Create prompt with base forms (to be declined by user)
  const targetPrompt = targetCorrect;

  return {
    id: generateId(),
    patternId: pattern.id,
    language,
    english,
    targetCorrect,
    targetPrompt,
    selectedWords,
  };
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (str: string) => 
    str.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?;]/g, '');
  
  return normalize(userAnswer) === normalize(correctAnswer);
}

export function generateMultiplePhrases(
  pattern: PhrasePattern,
  count: number = 5
): GeneratedPhrase[] {
  const phrases: GeneratedPhrase[] = [];
  
  for (let i = 0; i < count; i++) {
    phrases.push(generatePhraseFromPattern(pattern));
  }
  
  return phrases;
}

