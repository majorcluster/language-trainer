import { describe, it, expect } from 'vitest';
import { czechDeclension } from './czech';

describe('Czech Declension', () => {
  describe('Articles', () => {
    it('should return empty string for articles (Czech has no articles)', () => {
      expect(czechDeclension.getDefiniteArticle('nominative', 'masculine')).toBe('');
      expect(czechDeclension.getIndefiniteArticle('accusative', 'feminine')).toBe('');
    });
  });

  describe('Adjectives', () => {
    it('should decline adjectives with hard endings', () => {
      expect(czechDeclension.declineAdjective('starý', 'nominative', 'masculine')).toBe('starý');
      expect(czechDeclension.declineAdjective('starý', 'nominative', 'feminine')).toBe('stará');
      expect(czechDeclension.declineAdjective('starý', 'nominative', 'neuter')).toBe('staré');
      expect(czechDeclension.declineAdjective('starý', 'genitive', 'masculine')).toBe('starého');
      expect(czechDeclension.declineAdjective('starý', 'dative', 'masculine')).toBe('starému');
      expect(czechDeclension.declineAdjective('starý', 'accusative', 'feminine')).toBe('starou');
    });

    it('should handle locative case', () => {
      expect(czechDeclension.declineAdjective('starý', 'locative', 'masculine')).toBe('starém');
      expect(czechDeclension.declineAdjective('starý', 'locative', 'feminine')).toBe('staré');
    });

    it('should handle instrumental case', () => {
      expect(czechDeclension.declineAdjective('starý', 'instrumental', 'masculine')).toBe('starým');
      expect(czechDeclension.declineAdjective('starý', 'instrumental', 'feminine')).toBe('starou');
    });
  });

  describe('Possessives', () => {
    it('should keep indeclinable possessives unchanged', () => {
      expect(czechDeclension.declinePossessive('jeho', 'nominative', 'masculine')).toBe('jeho');
      expect(czechDeclension.declinePossessive('jeho', 'accusative', 'feminine')).toBe('jeho');
      expect(czechDeclension.declinePossessive('její', 'dative', 'masculine')).toBe('její');
      expect(czechDeclension.declinePossessive('jejich', 'genitive', 'neuter')).toBe('jejich');
    });
  });

  describe('Verb Conjugation', () => {
    const verbs = [
      {
        id: 'jít-past',
        infinitive: 'jít',
        english: 'went',
        language: 'czech' as const,
        tense: 'past' as const,
        conjugations: {
          'já': 'šel jsem',
          'ty': 'šel jsi',
          'on': 'šel',
          'ona': 'šla',
        },
        genderForms: {
          masculine: { 'já': 'šel jsem', 'on': 'šel' },
          feminine: { 'já': 'šla jsem', 'ona': 'šla' },
          neuter: { 'ono': 'šlo' },
        },
      },
    ];

    it('should conjugate verbs from table', () => {
      expect(czechDeclension.conjugateVerb('já', 'jít-past', verbs)).toBe('šel jsem');
      expect(czechDeclension.conjugateVerb('ona', 'jít-past', verbs)).toBe('šla');
    });

    it('should use gender-specific forms when provided', () => {
      expect(czechDeclension.conjugateVerb('já', 'jít-past', verbs, 'masculine')).toBe('šel jsem');
      expect(czechDeclension.conjugateVerb('já', 'jít-past', verbs, 'feminine')).toBe('šla jsem');
      expect(czechDeclension.conjugateVerb('ono', 'jít-past', verbs, 'neuter')).toBe('šlo');
    });

    it('should fallback to hardcoded conjugations', () => {
      expect(czechDeclension.conjugateVerb('já', 'šel', [])).toBe('šel jsem');
      expect(czechDeclension.conjugateVerb('ona', 'šel', [])).toBe('šla');
    });
  });

  describe('Translations', () => {
    it('should translate pronouns to English', () => {
      expect(czechDeclension.translatePronounToEnglish('já')).toBe('I');
      expect(czechDeclension.translatePronounToEnglish('ty')).toBe('you');
      expect(czechDeclension.translatePronounToEnglish('on')).toBe('he');
      expect(czechDeclension.translatePronounToEnglish('my')).toBe('we');
    });

    it('should translate possessives to English', () => {
      expect(czechDeclension.translatePossessiveToEnglish('můj')).toBe('my');
      expect(czechDeclension.translatePossessiveToEnglish('tvůj')).toBe('your');
      expect(czechDeclension.translatePossessiveToEnglish('jeho')).toBe('his');
    });
  });
});

