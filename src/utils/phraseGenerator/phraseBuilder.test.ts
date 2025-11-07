import { describe, it, expect } from 'vitest';
import { generatePhraseFromPattern, generateMultiplePhrases } from './phraseBuilder';
import { PhrasePattern, VerbConjugation } from '@/types';
import { SLOT_TYPE, WORD_CATEGORY, LANGUAGE } from '@/constants';

describe('Phrase Builder', () => {
  const testVerbs: VerbConjugation[] = [
    {
      id: 'gehen-past',
      infinitive: 'gehen',
      english: 'went',
      language: LANGUAGE.GERMAN,
      tense: 'past',
      conjugations: {
        'ich': 'ging',
        'du': 'gingst',
      },
    },
  ];

  describe('generatePhraseFromPattern', () => {
    it('should generate phrase from simple pattern', () => {
      const pattern: PhrasePattern = {
        id: 'test-pattern',
        name: 'Test',
        language: LANGUAGE.GERMAN,
        englishTemplate: '{pronoun} test',
        targetTemplate: '{pronoun} test',
        slots: [
          {
            id: 'pronoun',
            type: SLOT_TYPE.PRONOUN,
            label: 'Pronoun',
            options: [
              { id: 'ich', baseForm: 'ich', category: WORD_CATEGORY.PRONOUN },
            ],
          },
          {
            id: 'verb',
            type: SLOT_TYPE.FIXED,
            label: 'Verb',
            fixedText: 'teste',
          },
        ],
      };

      const phrase = generatePhraseFromPattern(pattern, testVerbs);
      
      expect(phrase.language).toBe(LANGUAGE.GERMAN);
      expect(phrase.patternId).toBe('test-pattern');
      expect(phrase.targetCorrect).toContain('Ich'); // Capitalized
      expect(phrase.targetCorrect).toContain('teste');
      expect(phrase.english).toContain('I');
    });

    it('should select random words from options', () => {
      const pattern: PhrasePattern = {
        id: 'test',
        name: 'Test',
        language: LANGUAGE.GERMAN,
        englishTemplate: '{pronoun}',
        targetTemplate: '{pronoun}',
        slots: [
          {
            id: 'pronoun',
            type: SLOT_TYPE.PRONOUN,
            label: 'Pronoun',
            options: [
              { id: 'ich', baseForm: 'ich', category: WORD_CATEGORY.PRONOUN },
              { id: 'du', baseForm: 'du', category: WORD_CATEGORY.PRONOUN },
              { id: 'wir', baseForm: 'wir', category: WORD_CATEGORY.PRONOUN },
            ],
          },
        ],
      };

      const phrase = generatePhraseFromPattern(pattern);
      expect(['Ich', 'Du', 'Wir']).toContain(phrase.targetCorrect);
    });

    it('should create pronoun-drop version for Czech', () => {
      const pattern: PhrasePattern = {
        id: 'test',
        name: 'Test',
        language: LANGUAGE.CZECH,
        englishTemplate: '{pronoun} test',
        targetTemplate: '{pronoun} test',
        slots: [
          {
            id: 'pronoun',
            type: SLOT_TYPE.PRONOUN,
            label: 'Pronoun',
            options: [{ id: 'já', baseForm: 'já', category: WORD_CATEGORY.PRONOUN }],
          },
          {
            id: 'verb',
            type: SLOT_TYPE.FIXED,
            label: 'Verb',
            fixedText: 'jsem',
          },
        ],
      };

      const phrase = generatePhraseFromPattern(pattern);
      
      expect(phrase.targetCorrect).toBe('Já jsem');
      expect(phrase.targetWithoutPronoun).toBe('Jsem'); // Without pronoun, capitalized
    });

    it('should not create pronoun-drop version for German', () => {
      const pattern: PhrasePattern = {
        id: 'test',
        name: 'Test',
        language: LANGUAGE.GERMAN,
        englishTemplate: '{pronoun}',
        targetTemplate: '{pronoun}',
        slots: [
          {
            id: 'pronoun',
            type: SLOT_TYPE.PRONOUN,
            label: 'Pronoun',
            options: [{ id: 'ich', baseForm: 'ich', category: WORD_CATEGORY.PRONOUN }],
          },
        ],
      };

      const phrase = generatePhraseFromPattern(pattern);
      expect(phrase.targetWithoutPronoun).toBeUndefined();
    });
  });

  describe('generateMultiplePhrases', () => {
    it('should generate specified number of phrases', () => {
      const pattern: PhrasePattern = {
        id: 'test',
        name: 'Test',
        language: LANGUAGE.GERMAN,
        englishTemplate: 'test',
        targetTemplate: 'test',
        slots: [
          {
            id: 'fixed',
            type: SLOT_TYPE.FIXED,
            label: 'Fixed',
            fixedText: 'test',
          },
        ],
      };

      const phrases = generateMultiplePhrases(pattern, 10);
      expect(phrases).toHaveLength(10);
      phrases.forEach(phrase => {
        expect(phrase.patternId).toBe('test');
        expect(phrase.language).toBe(LANGUAGE.GERMAN);
      });
    });

    it('should generate unique IDs for each phrase', () => {
      const pattern: PhrasePattern = {
        id: 'test',
        name: 'Test',
        language: LANGUAGE.GERMAN,
        englishTemplate: 'test',
        targetTemplate: 'test',
        slots: [],
      };

      const phrases = generateMultiplePhrases(pattern, 5);
      const ids = phrases.map(p => p.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(5); // All unique
    });
  });
});

