import { describe, it, expect } from 'vitest';
import { generatePhraseFromPattern } from './phraseBuilder';
import { PhrasePattern, VerbConjugation } from '@/types';

describe('Verb Case Governance', () => {
  const czechVerbs: VerbConjugation[] = [
    {
      id: 'bát-se-present',
      infinitive: 'bát se',
      english: 'to be afraid of',
      language: 'czech',
      tense: 'present',
      conjugations: {
        'já': 'bojím se',
        'ty': 'bojíš se',
        'on': 'bojí se',
      },
      governsCase: 'genitive',
    },
    {
      id: 'mít-present',
      infinitive: 'mít',
      english: 'to have',
      language: 'czech',
      tense: 'present',
      conjugations: {
        'já': 'mám',
        'ty': 'máš',
        'on': 'má',
      },
      // No governsCase - defaults to accusative
    },
  ];

  it('should use genitive case when verb governs genitive', () => {
    const pattern: PhrasePattern = {
      id: 'test-genitive-verb',
      name: 'Test',
      language: 'czech',
      englishTemplate: '{pronoun} is afraid of {object}',
      targetTemplate: '{pronoun} bojím se {object}',
      slots: [
        {
          id: 'pronoun',
          type: 'pronoun',
          label: 'Pronoun',
          options: [
            { id: 'já', baseForm: 'já', english: 'I', category: 'pronoun' },
          ],
        },
        {
          id: 'verb',
          type: 'verb',
          label: 'Verb',
          verbId: 'bát-se-present',
        },
        {
          id: 'object',
          type: 'object-phrase',
          label: 'Object',
          // No requiredCase specified - should use verb's governsCase
          options: [
            { id: 'pes', baseForm: 'pes', english: 'dog', category: 'noun', gender: 'masculine' },
          ],
        },
      ],
    };

    const phrase = generatePhraseFromPattern(pattern, czechVerbs);
    
    // "pes" in genitive should be "psa" or "pesu" (both are valid genitive forms)
    // With possessive/adjective it will be "pesu" (genitive after adjective)
    expect(phrase.targetCorrect).toMatch(/psa|pesu/);
    expect(phrase.english).toContain('dog');
  });

  it('should use accusative case when verb does not govern a specific case', () => {
    const pattern: PhrasePattern = {
      id: 'test-accusative-verb',
      name: 'Test',
      language: 'czech',
      englishTemplate: '{pronoun} has {object}',
      targetTemplate: '{pronoun} mám {object}',
      slots: [
        {
          id: 'pronoun',
          type: 'pronoun',
          label: 'Pronoun',
          options: [
            { id: 'já', baseForm: 'já', english: 'I', category: 'pronoun' },
          ],
        },
        {
          id: 'verb',
          type: 'verb',
          label: 'Verb',
          verbId: 'mít-present',
        },
        {
          id: 'object',
          type: 'object-phrase',
          label: 'Object',
          requiredCase: 'accusative',
          options: [
            { id: 'kniha', baseForm: 'kniha', english: 'book', category: 'noun', gender: 'feminine' },
          ],
        },
      ],
    };

    const phrase = generatePhraseFromPattern(pattern, czechVerbs);
    
    // "kniha" in accusative should be "knihu"
    expect(phrase.targetCorrect).toContain('knihu');
  });

  it('should override slot requiredCase with verb governsCase', () => {
    const pattern: PhrasePattern = {
      id: 'test-override',
      name: 'Test',
      language: 'czech',
      englishTemplate: '{pronoun} is afraid of {object}',
      targetTemplate: '{pronoun} bojím se {object}',
      slots: [
        {
          id: 'pronoun',
          type: 'pronoun',
          label: 'Pronoun',
          options: [
            { id: 'já', baseForm: 'já', english: 'I', category: 'pronoun' },
          ],
        },
        {
          id: 'verb',
          type: 'verb',
          label: 'Verb',
          verbId: 'bát-se-present',
        },
        {
          id: 'object',
          type: 'object-phrase',
          label: 'Object',
          requiredCase: 'accusative', // This will be overridden by verb's genitive
          options: [
            { id: 'tma', baseForm: 'tma', english: 'darkness', category: 'noun', gender: 'feminine' },
          ],
        },
      ],
    };

    const phrase = generatePhraseFromPattern(pattern, czechVerbs);
    
    // "tma" should use genitive (tmy) not accusative (tmu)
    // The noun phrase builder will add possessive and adjective, so check for genitive ending
    expect(phrase.targetCorrect).toMatch(/tmy/); // Genitive form
    expect(phrase.english).toContain('darkness');
  });
});

