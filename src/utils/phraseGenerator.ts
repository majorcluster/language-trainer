import { GeneratedPhrase, PhrasePattern, WordVariant, GrammaticalCase } from '@/types';
import { 
  getDefiniteArticle, 
  declineAdjective, 
  declinePossessive,
  mergePrepositionWithArticle
} from './germanDeclension';

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function declineNounPhrase(
  word: WordVariant,
  grammaticalCase: GrammaticalCase,
  withPossessive?: string,
  adjective?: WordVariant
): string {
  if (!word.gender) return word.baseForm;

  let result = '';

  if (withPossessive) {
    // Possessive + adjective + noun
    const declined = declinePossessive(withPossessive, grammaticalCase, word.gender);
    result = declined;

    if (adjective) {
      const adjectiveDeclined = declineAdjective(
        adjective.baseForm,
        grammaticalCase,
        word.gender,
        'singular',
        false // mixed declension after possessive
      );
      result += ' ' + adjectiveDeclined;
    }
  } else {
    // Article + adjective + noun
    const article = getDefiniteArticle(grammaticalCase, word.gender);
    result = article;

    if (adjective) {
      const adjectiveDeclined = declineAdjective(
        adjective.baseForm,
        grammaticalCase,
        word.gender,
        'singular',
        true // weak declension after article
      );
      result += ' ' + adjectiveDeclined;
    }
  }

  result += ' ' + word.baseForm;
  return result;
}

function getPronounConjugation(pronoun: string, verb: string): string {
  // Simple verb conjugation for past tense
  const conjugations: Record<string, Record<string, string>> = {
    'ging': {
      'ich': 'ging',
      'du': 'gingst',
      'er': 'ging',
      'sie': 'ging',
      'wir': 'gingen',
      'ihr': 'gingt',
    },
    'gab': {
      'ich': 'gab',
      'du': 'gabst',
      'er': 'gab',
      'sie': 'gab',
      'wir': 'gaben',
      'ihr': 'gabt',
    },
  };

  return conjugations[verb]?.[pronoun] || verb;
}

function translatePronounToEnglish(germanPronoun: string): string {
  const translations: Record<string, string> = {
    'ich': 'I',
    'du': 'you',
    'er': 'he',
    'sie': 'she',
    'es': 'it',
    'wir': 'we',
    'ihr': 'you (plural)',
    'sie-formal': 'you',
  };
  return translations[germanPronoun] || germanPronoun;
}

function translatePossessiveToEnglish(germanPossessive: string): string {
  const translations: Record<string, string> = {
    'mein': 'my',
    'dein': 'your',
    'sein': 'his',
    'ihr': 'her',
    'unser': 'our',
    'euer': 'your',
  };
  return translations[germanPossessive] || germanPossessive;
}

export function generatePhraseFromPattern(pattern: PhrasePattern): GeneratedPhrase {
  const selectedWords: Record<string, WordVariant> = {};
  let germanParts: string[] = [];
  let englishParts: string[] = [];

  pattern.slots.forEach((slot) => {
    if (slot.type === 'fixed' && slot.fixedText) {
      return; // Fixed text is handled separately
    }

    if (slot.options && slot.options.length > 0) {
      selectedWords[slot.id] = randomChoice(slot.options);
    }
  });

  // Build German phrase
  if (pattern.id === 'pattern-1') {
    // "I went to the cinema" -> "Ich ging ins Kino"
    const pronoun = selectedWords['pronoun'];
    const place = selectedWords['prep-phrase'];
    
    const verb = getPronounConjugation(pronoun.baseForm, 'ging');
    const article = getDefiniteArticle('accusative', place.gender!);
    const prepPhrase = mergePrepositionWithArticle('in', article);
    
    germanParts = [
      pronoun.baseForm.charAt(0).toUpperCase() + pronoun.baseForm.slice(1),
      verb,
      prepPhrase,
      place.baseForm
    ];
    
    englishParts = [
      translatePronounToEnglish(pronoun.baseForm),
      'went',
      'to the',
      place.english || place.baseForm.toLowerCase()
    ];
  } else if (pattern.id === 'pattern-2') {
    // Complex giving pattern
    const pronoun = selectedWords['pronoun'];
    const possessive1 = selectedWords['possessive'];
    const adj1 = selectedWords['adjective'];
    const object = selectedWords['object'];
    const possessive2 = selectedWords['possessive2'];
    const adj2 = selectedWords['adjective2'];
    const person = selectedWords['person'];

    const verb = getPronounConjugation(pronoun.baseForm, 'gab');
    
    // Accusative phrase (direct object)
    const accusativePhrase = declineNounPhrase(
      object,
      'accusative',
      possessive1.baseForm,
      adj1
    );
    
    // Dative phrase (indirect object)
    const dativePhrase = declineNounPhrase(
      person,
      'dative',
      possessive2.baseForm,
      adj2
    );

    germanParts = [
      pronoun.baseForm.charAt(0).toUpperCase() + pronoun.baseForm.slice(1),
      verb,
      accusativePhrase,
      dativePhrase
    ];

    englishParts = [
      translatePronounToEnglish(pronoun.baseForm),
      'gave',
      translatePossessiveToEnglish(possessive1.baseForm),
      adj1.english || adj1.baseForm,
      object.english || object.baseForm.toLowerCase(),
      'to',
      translatePossessiveToEnglish(possessive2.baseForm),
      adj2.english || adj2.baseForm,
      person.english || person.baseForm.toLowerCase()
    ];
  }

  const germanCorrect = germanParts.join(' ');
  const english = englishParts.join(' ');

  // Create prompt with base forms (to be declined by user)
  const germanPrompt = germanCorrect; // For now, show the base forms in UI

  return {
    id: generateId(),
    patternId: pattern.id,
    english,
    germanCorrect,
    germanPrompt,
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

