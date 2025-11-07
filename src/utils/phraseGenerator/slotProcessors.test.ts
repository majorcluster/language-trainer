import { describe, it, expect } from 'vitest';
import { processSlot } from './slotProcessors';
import { PhraseSlot, WordVariant, VerbConjugation } from '@/types';
import { germanDeclension } from '../declension/german';
import { SLOT_TYPE, WORD_CATEGORY, GRAMMATICAL_CASE, LANGUAGE } from '@/constants';

describe('Slot Processors', () => {
  describe('Fixed slots', () => {
    it('should return fixed text', () => {
      const slot: PhraseSlot = {
        id: 'test',
        type: SLOT_TYPE.FIXED,
        label: 'Test',
        fixedText: 'hello',
      };

      const result = processSlot(slot, {}, LANGUAGE.GERMAN, [], germanDeclension);
      expect(result.target).toBe('hello');
      expect(result.english).toBe('hello');
    });
  });

  describe('Pronoun slots', () => {
    it('should translate pronoun to English', () => {
      const slot: PhraseSlot = {
        id: 'pronoun',
        type: SLOT_TYPE.PRONOUN,
        label: 'Pronoun',
      };

      const selectedWords: Record<string, WordVariant> = {
        'pronoun': { id: 'ich', baseForm: 'ich', category: WORD_CATEGORY.PRONOUN },
      };

      const result = processSlot(slot, selectedWords, LANGUAGE.GERMAN, [], germanDeclension);
      expect(result.target).toBe('ich');
      expect(result.english).toBe('I');
    });
  });

  describe('Verb slots', () => {
    const verbs: VerbConjugation[] = [
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

    it('should conjugate verb based on pronoun', () => {
      const slot: PhraseSlot = {
        id: 'verb',
        type: SLOT_TYPE.VERB,
        label: 'Verb',
        verbId: 'gehen-past',
      };

      const selectedWords: Record<string, WordVariant> = {
        'pronoun': { id: 'ich', baseForm: 'ich', category: WORD_CATEGORY.PRONOUN },
      };

      const result = processSlot(slot, selectedWords, LANGUAGE.GERMAN, verbs, germanDeclension);
      expect(result.target).toBe('ging');
      expect(result.english).toBe('went');
    });

    it('should use different conjugation for different pronouns', () => {
      const slot: PhraseSlot = {
        id: 'verb',
        type: SLOT_TYPE.VERB,
        label: 'Verb',
        verbId: 'gehen-past',
      };

      const selectedWords: Record<string, WordVariant> = {
        'pronoun': { id: 'du', baseForm: 'du', category: WORD_CATEGORY.PRONOUN },
      };

      const result = processSlot(slot, selectedWords, LANGUAGE.GERMAN, verbs, germanDeclension);
      expect(result.target).toBe('gingst');
    });
  });

  describe('Noun phrase slots', () => {
    it('should build noun phrase with article', () => {
      const slot: PhraseSlot = {
        id: 'object',
        type: SLOT_TYPE.OBJECT_PHRASE,
        label: 'Object',
        requiredCase: GRAMMATICAL_CASE.ACCUSATIVE,
      };

      const selectedWords: Record<string, WordVariant> = {
        'object': { 
          id: 'auto', 
          baseForm: 'Auto', 
          english: 'car',
          category: WORD_CATEGORY.NOUN,
          gender: 'neuter',
        },
      };

      const result = processSlot(slot, selectedWords, LANGUAGE.GERMAN, [], germanDeclension);
      expect(result.target).toContain('Auto');
      expect(result.english).toContain('car');
    });

    it('should auto-generate possessive and adjective for noun phrases', () => {
      const slot: PhraseSlot = {
        id: 'object',
        type: SLOT_TYPE.OBJECT_PHRASE,
        label: 'Object',
        requiredCase: GRAMMATICAL_CASE.ACCUSATIVE,
      };

      const selectedWords: Record<string, WordVariant> = {
        'object': { 
          id: 'auto', 
          baseForm: 'Auto', 
          english: 'car',
          category: WORD_CATEGORY.NOUN,
          gender: 'neuter',
        },
      };

      const result = processSlot(slot, selectedWords, LANGUAGE.GERMAN, [], germanDeclension);
      
      // Should include Auto (noun)
      expect(result.target).toContain('Auto');
      
      // English should have possessive + adjective + car
      expect(result.english).toContain('car');
      expect(result.english.split(' ')).toHaveLength(3); // e.g., "my old car"
    });
  });

  describe('Empty/missing slots', () => {
    it('should handle missing selected words', () => {
      const slot: PhraseSlot = {
        id: 'missing',
        type: SLOT_TYPE.PRONOUN,
        label: 'Missing',
      };

      const result = processSlot(slot, {}, LANGUAGE.GERMAN, [], germanDeclension);
      expect(result.target).toBe('');
      expect(result.english).toBe('');
    });
  });
});

