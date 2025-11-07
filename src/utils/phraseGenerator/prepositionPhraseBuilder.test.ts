import { describe, it, expect } from 'vitest';
import { buildPrepositionPhrase } from './prepositionPhraseBuilder';
import { germanDeclension } from '../declension/german';
import { czechDeclension } from '../declension/czech';
import { WordVariant } from '@/types';

describe('Preposition Phrase Builder', () => {
  describe('German - with articles and contractions', () => {
    const germanPlace: WordVariant = {
      id: 'kino',
      baseForm: 'Kino',
      english: 'cinema',
      category: 'noun',
      gender: 'neuter',
    };

    it('should create preposition phrase with accusative (motion)', () => {
      const result = buildPrepositionPhrase(
        germanPlace,
        'accusative',
        'german',
        germanDeclension,
        'in'
      );
      
      expect(result.target).toBe('ins Kino'); // in + das = ins
      expect(result.english).toBe('to the cinema');
    });

    it('should create preposition phrase with dative (location)', () => {
      const result = buildPrepositionPhrase(
        germanPlace,
        'dative',
        'german',
        germanDeclension,
        'in'
      );
      
      expect(result.target).toBe('im Kino'); // in + dem = im
      expect(result.english).toBe('in the cinema');
    });

    it('should handle different prepositions', () => {
      const result = buildPrepositionPhrase(
        germanPlace,
        'dative',
        'german',
        germanDeclension,
        'zu'
      );
      
      expect(result.target).toContain('zum'); // zu + dem = zum
      expect(result.english).toBe('to the cinema');
    });

    it('should handle feminine nouns', () => {
      const femininePlace: WordVariant = {
        id: 'schule',
        baseForm: 'Schule',
        english: 'school',
        category: 'noun',
        gender: 'feminine',
      };

      const result = buildPrepositionPhrase(
        femininePlace,
        'dative',
        'german',
        germanDeclension,
        'in'
      );
      
      expect(result.target).toBe('in der Schule'); // No contraction with "der"
      expect(result.english).toBe('in the school');
    });

    it('should handle masculine nouns', () => {
      const masculinePlace: WordVariant = {
        id: 'park',
        baseForm: 'Park',
        english: 'park',
        category: 'noun',
        gender: 'masculine',
      };

      const result = buildPrepositionPhrase(
        masculinePlace,
        'accusative',
        'german',
        germanDeclension,
        'in'
      );
      
      expect(result.target).toBe('in den Park');
      expect(result.english).toBe('to the park');
    });
  });

  describe('Czech - no articles', () => {
    const czechPlace: WordVariant = {
      id: 'kino',
      baseForm: 'kino',
      english: 'cinema',
      category: 'noun',
      gender: 'neuter',
    };

    it('should create preposition phrase without article (genitive)', () => {
      const result = buildPrepositionPhrase(
        czechPlace,
        'genitive',
        'czech',
        czechDeclension,
        'do'
      );
      
      expect(result.target).toBe('do kina'); // neuter genitive: kino → kina
      expect(result.english).toBe('to the cinema');
    });

    it('should create preposition phrase with locative', () => {
      const result = buildPrepositionPhrase(
        czechPlace,
        'locative',
        'czech',
        czechDeclension,
        'v'
      );
      
      expect(result.target).toBe('v kině'); // neuter locative: kino → kině
      expect(result.english).toBe('at the cinema');
    });

    it('should handle different Czech prepositions', () => {
      const result = buildPrepositionPhrase(
        czechPlace,
        'dative',
        'czech',
        czechDeclension,
        'k'
      );
      
      expect(result.target).toBe('k kinu'); // neuter dative: kino → kinu
      expect(result.english).toBe('to cinema');
    });

    it('should map prepositions to English correctly', () => {
      const prepositionTests = [
        { prep: 'do', english: 'to the' },
        { prep: 'v', english: 'at the' },
        { prep: 'na', english: 'to the' },
        { prep: 's', english: 'with the' },
        { prep: 'od', english: 'from the' },
      ];

      prepositionTests.forEach(({ prep, english }) => {
        const result = buildPrepositionPhrase(
          czechPlace,
          'genitive',
          'czech',
          czechDeclension,
          prep
        );
        
        expect(result.english).toContain(english);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle nouns without gender', () => {
      const wordNoGender: WordVariant = {
        id: 'test',
        baseForm: 'test',
        category: 'noun',
      };

      const result = buildPrepositionPhrase(
        wordNoGender,
        'accusative',
        'german',
        germanDeclension,
        'in'
      );
      
      expect(result.target).toBe('test');
      expect(result.english).toContain('test');
    });

    it('should use default preposition if not provided', () => {
      const noun: WordVariant = {
        id: 'kino',
        baseForm: 'Kino',
        category: 'noun',
        gender: 'neuter',
      };

      const result = buildPrepositionPhrase(
        noun,
        'accusative',
        'german',
        germanDeclension
        // No preposition provided - should default to 'in'
      );
      
      expect(result.target).toBe('ins Kino');
    });
  });
});

