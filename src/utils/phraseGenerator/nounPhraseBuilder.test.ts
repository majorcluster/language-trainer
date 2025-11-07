import { describe, it, expect } from 'vitest';
import { buildNounPhrase } from './nounPhraseBuilder';
import { germanDeclension } from '../declension/german';
import { czechDeclension } from '../declension/czech';
import { WordVariant } from '@/types';

describe('Noun Phrase Builder', () => {
  describe('German - with articles', () => {
    const germanNoun: WordVariant = {
      id: 'auto',
      baseForm: 'Auto',
      english: 'car',
      category: 'noun',
      gender: 'neuter',
    };

    it('should build simple noun phrase with article', () => {
      const result = buildNounPhrase(germanNoun, 'nominative', germanDeclension);
      
      expect(result).toBe('das Auto');
    });

    it('should build noun phrase with article and adjective', () => {
      const adjective: WordVariant = {
        id: 'alt',
        baseForm: 'alt',
        english: 'old',
        category: 'adjective',
      };

      const result = buildNounPhrase(germanNoun, 'accusative', germanDeclension, undefined, adjective);
      
      expect(result).toContain('Auto');
      expect(result).toContain('alte'); // weak declension after article
      expect(result).toContain('das');
    });

    it('should build noun phrase with possessive and adjective', () => {
      const adjective: WordVariant = {
        id: 'alt',
        baseForm: 'alt',
        english: 'old',
        category: 'adjective',
      };

      const result = buildNounPhrase(
        germanNoun,
        'accusative',
        germanDeclension,
        'mein',
        adjective
      );
      
      expect(result).toContain('Auto');
      expect(result).toContain('mein'); // possessive
      expect(result).toContain('alt'); // adjective with mixed ending
    });

    it('should decline possessive correctly by case', () => {
      // Accusative masculine
      const masculineNoun: WordVariant = {
        id: 'vater',
        baseForm: 'Vater',
        category: 'noun',
        gender: 'masculine',
      };

      const accusative = buildNounPhrase(
        masculineNoun,
        'accusative',
        germanDeclension,
        'mein'
      );
      expect(accusative).toContain('meinen'); // accusative masculine

      // Dative
      const dative = buildNounPhrase(
        masculineNoun,
        'dative',
        germanDeclension,
        'mein'
      );
      expect(dative).toContain('meinem'); // dative masculine
    });

    it('should use correct adjective ending after possessive (mixed)', () => {
      const adjective: WordVariant = {
        id: 'alt',
        baseForm: 'alt',
        category: 'adjective',
      };

      // Nominative masculine - mixed ending is -er
      const masculineNoun: WordVariant = {
        id: 'vater',
        baseForm: 'Vater',
        category: 'noun',
        gender: 'masculine',
      };

      const result = buildNounPhrase(
        masculineNoun,
        'nominative',
        germanDeclension,
        'mein',
        adjective
      );
      
      expect(result).toContain('alter'); // mixed ending after possessive
    });
  });

  describe('Czech - no articles', () => {
    const czechNoun: WordVariant = {
      id: 'auto',
      baseForm: 'auto',
      english: 'car',
      category: 'noun',
      gender: 'neuter',
    };

    it('should build noun phrase without article', () => {
      const result = buildNounPhrase(czechNoun, 'nominative', czechDeclension);
      
      // Czech has no articles
      expect(result).toBe('auto');
      expect(result).not.toContain('das');
      expect(result).not.toContain('the');
    });

    it('should build noun phrase with possessive', () => {
      const result = buildNounPhrase(
        czechNoun,
        'nominative',
        czechDeclension,
        'můj'
      );
      
      expect(result).toContain('auto');
      expect(result).toContain('můj'); // possessive
    });

    it('should build noun phrase with possessive and adjective', () => {
      const adjective: WordVariant = {
        id: 'starý',
        baseForm: 'starý',
        english: 'old',
        category: 'adjective',
      };

      const result = buildNounPhrase(
        czechNoun,
        'accusative',
        czechDeclension,
        'můj',
        adjective
      );
      
      expect(result).toContain('auto');
      expect(result).toContain('star'); // adjective base
    });

    it('should keep indeclinable possessives unchanged', () => {
      const result = buildNounPhrase(
        czechNoun,
        'accusative',
        czechDeclension,
        'jeho' // indeclinable
      );
      
      expect(result).toContain('jeho'); // Should stay "jeho", not decline
      expect(result).toContain('auto');
    });
  });

  describe('Edge cases', () => {
    it('should handle nouns without gender', () => {
      const wordNoGender: WordVariant = {
        id: 'test',
        baseForm: 'test',
        category: 'noun',
      };

      const result = buildNounPhrase(wordNoGender, 'accusative', germanDeclension);
      expect(result).toBe('test'); // Just return base form
    });

    it('should trim extra whitespace', () => {
      const noun: WordVariant = {
        id: 'auto',
        baseForm: 'Auto',
        category: 'noun',
        gender: 'neuter',
      };

      const result = buildNounPhrase(noun, 'nominative', germanDeclension);
      expect(result).not.toMatch(/^\s/); // No leading space
      expect(result).not.toMatch(/\s$/); // No trailing space
      expect(result).not.toMatch(/\s{2,}/); // No double spaces
    });
  });
});

