import { describe, it, expect } from 'vitest';
import { germanDeclension } from './german';

describe('German Declension', () => {
  describe('Articles', () => {
    it('should decline definite articles correctly', () => {
      // Nominative
      expect(germanDeclension.getDefiniteArticle('nominative', 'masculine')).toBe('der');
      expect(germanDeclension.getDefiniteArticle('nominative', 'feminine')).toBe('die');
      expect(germanDeclension.getDefiniteArticle('nominative', 'neuter')).toBe('das');
      
      // Accusative
      expect(germanDeclension.getDefiniteArticle('accusative', 'masculine')).toBe('den');
      expect(germanDeclension.getDefiniteArticle('accusative', 'feminine')).toBe('die');
      expect(germanDeclension.getDefiniteArticle('accusative', 'neuter')).toBe('das');
      
      // Dative
      expect(germanDeclension.getDefiniteArticle('dative', 'masculine')).toBe('dem');
      expect(germanDeclension.getDefiniteArticle('dative', 'feminine')).toBe('der');
      expect(germanDeclension.getDefiniteArticle('dative', 'neuter')).toBe('dem');
      
      // Genitive
      expect(germanDeclension.getDefiniteArticle('genitive', 'masculine')).toBe('des');
      expect(germanDeclension.getDefiniteArticle('genitive', 'feminine')).toBe('der');
      expect(germanDeclension.getDefiniteArticle('genitive', 'neuter')).toBe('des');
    });

    it('should decline indefinite articles correctly', () => {
      expect(germanDeclension.getIndefiniteArticle('nominative', 'masculine')).toBe('ein');
      expect(germanDeclension.getIndefiniteArticle('nominative', 'feminine')).toBe('eine');
      expect(germanDeclension.getIndefiniteArticle('accusative', 'masculine')).toBe('einen');
      expect(germanDeclension.getIndefiniteArticle('dative', 'feminine')).toBe('einer');
    });
  });

  describe('Adjectives', () => {
    it('should decline adjectives with weak endings (after definite article)', () => {
      expect(germanDeclension.declineAdjective('alt', 'nominative', 'masculine', 'singular', true)).toBe('alte');
      expect(germanDeclension.declineAdjective('alt', 'accusative', 'masculine', 'singular', true)).toBe('alten');
      expect(germanDeclension.declineAdjective('alt', 'dative', 'feminine', 'singular', true)).toBe('alten');
    });

    it('should decline adjectives with mixed endings (after possessive)', () => {
      expect(germanDeclension.declineAdjective('alt', 'nominative', 'masculine', 'singular', false)).toBe('alter');
      expect(germanDeclension.declineAdjective('alt', 'accusative', 'neuter', 'singular', false)).toBe('altes');
    });
  });

  describe('Possessives', () => {
    it('should decline possessive pronouns correctly', () => {
      // Nominative
      expect(germanDeclension.declinePossessive('mein', 'nominative', 'masculine')).toBe('mein');
      expect(germanDeclension.declinePossessive('mein', 'nominative', 'neuter')).toBe('mein');
      expect(germanDeclension.declinePossessive('mein', 'nominative', 'feminine')).toBe('meine');
      
      // Accusative
      expect(germanDeclension.declinePossessive('mein', 'accusative', 'masculine')).toBe('meinen');
      expect(germanDeclension.declinePossessive('mein', 'accusative', 'neuter')).toBe('mein');
      expect(germanDeclension.declinePossessive('mein', 'accusative', 'feminine')).toBe('meine');
      expect(germanDeclension.declinePossessive('mein', 'dative', 'masculine')).toBe('meinem');
      expect(germanDeclension.declinePossessive('mein', 'dative', 'neuter')).toBe('meinem');
      expect(germanDeclension.declinePossessive('mein', 'dative', 'feminine')).toBe('meiner');
      expect(germanDeclension.declinePossessive('mein', 'genitive', 'masculine')).toBe('meines');
      expect(germanDeclension.declinePossessive('mein', 'genitive', 'neuter')).toBe('meines');
      expect(germanDeclension.declinePossessive('mein', 'genitive', 'feminine')).toBe('meiner');
    });
  });

  describe('Verb Conjugation', () => {
    const verbs = [
      {
        id: 'gehen-past',
        infinitive: 'gehen',
        english: 'went',
        language: 'german' as const,
        tense: 'past' as const,
        conjugations: {
          'ich': 'ging',
          'du': 'gingst',
          'er': 'ging',
          'wir': 'gingen',
          'ihr': 'gingt',
        },
      },
    ];

    it('should conjugate verbs from table', () => {
      expect(germanDeclension.conjugateVerb('ich', 'gehen-past', verbs)).toBe('ging');
      expect(germanDeclension.conjugateVerb('du', 'gehen-past', verbs)).toBe('gingst');
      expect(germanDeclension.conjugateVerb('wir', 'gehen-past', verbs)).toBe('gingen');
    });

    it('should fallback to hardcoded conjugations', () => {
      expect(germanDeclension.conjugateVerb('ich', 'ging', [])).toBe('ging');
      expect(germanDeclension.conjugateVerb('du', 'ging', [])).toBe('gingst');
    });
  });

  describe('Translations', () => {
    it('should translate pronouns to English', () => {
      expect(germanDeclension.translatePronounToEnglish('ich')).toBe('I');
      expect(germanDeclension.translatePronounToEnglish('du')).toBe('you');
      expect(germanDeclension.translatePronounToEnglish('er')).toBe('he');
      expect(germanDeclension.translatePronounToEnglish('wir')).toBe('we');
    });

    it('should translate possessives to English', () => {
      expect(germanDeclension.translatePossessiveToEnglish('mein')).toBe('my');
      expect(germanDeclension.translatePossessiveToEnglish('dein')).toBe('your');
      expect(germanDeclension.translatePossessiveToEnglish('sein')).toBe('his');
    });
  });
});

