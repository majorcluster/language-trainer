import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';
import { PhrasePattern, VerbConjugation } from '@/types';

describe('Store - Language Switching', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useStore.setState({
      selectedLanguage: 'german',
      patterns: [],
      verbs: [],
      trainingPhrases: [],
      sessions: [],
      currentPhrase: null,
    });
  });

  it('should initialize with German as default language', () => {
    const { selectedLanguage } = useStore.getState();
    expect(selectedLanguage).toBe('german');
  });

  it('should change language and clear current phrase', () => {
    const { setLanguage, setCurrentPhrase } = useStore.getState();
    
    // Set a current phrase
    setCurrentPhrase({
      id: 'test-phrase',
      patternId: 'pattern-1',
      language: 'german',
      english: 'test',
      targetCorrect: 'test',
      targetPrompt: 'test',
      selectedWords: {},
    });

    expect(useStore.getState().currentPhrase).not.toBeNull();

    // Change language
    setLanguage('czech');

    const state = useStore.getState();
    expect(state.selectedLanguage).toBe('czech');
    expect(state.currentPhrase).toBeNull(); // Should clear current phrase
  });

  it('should filter patterns by language', () => {
    const { addPattern } = useStore.getState();

    const germanPattern: PhrasePattern = {
      id: 'german-1',
      name: 'German Pattern',
      language: 'german',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [],
    };

    const czechPattern: PhrasePattern = {
      id: 'czech-1',
      name: 'Czech Pattern',
      language: 'czech',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [],
    };

    addPattern(germanPattern);
    addPattern(czechPattern);

    const { patterns } = useStore.getState();
    expect(patterns).toHaveLength(2);

    // Filter by language (this is what components do)
    const germanPatterns = patterns.filter(p => p.language === 'german');
    const czechPatterns = patterns.filter(p => p.language === 'czech');

    expect(germanPatterns).toHaveLength(1);
    expect(germanPatterns[0].name).toBe('German Pattern');
    expect(czechPatterns).toHaveLength(1);
    expect(czechPatterns[0].name).toBe('Czech Pattern');
  });

  it('should filter verbs by language', () => {
    const { addVerb } = useStore.getState();

    const germanVerb: VerbConjugation = {
      id: 'german-verb',
      infinitive: 'gehen',
      english: 'to go',
      language: 'german',
      tense: 'present',
      conjugations: { 'ich': 'gehe' },
    };

    const czechVerb: VerbConjugation = {
      id: 'czech-verb',
      infinitive: 'jít',
      english: 'to go',
      language: 'czech',
      tense: 'present',
      conjugations: { 'já': 'jdu' },
    };

    addVerb(germanVerb);
    addVerb(czechVerb);

    const { verbs } = useStore.getState();
    expect(verbs).toHaveLength(2);

    // Filter by language
    const germanVerbs = verbs.filter(v => v.language === 'german');
    const czechVerbs = verbs.filter(v => v.language === 'czech');

    expect(germanVerbs).toHaveLength(1);
    expect(germanVerbs[0].infinitive).toBe('gehen');
    expect(czechVerbs).toHaveLength(1);
    expect(czechVerbs[0].infinitive).toBe('jít');
  });

  it('should filter training phrases by language', () => {
    const { addTrainingPhrase } = useStore.getState();

    addTrainingPhrase({
      id: 'german-phrase',
      patternId: 'p1',
      language: 'german',
      english: 'I went',
      targetCorrect: 'Ich ging',
      targetPrompt: 'Ich ging',
      selectedWords: {},
    });

    addTrainingPhrase({
      id: 'czech-phrase',
      patternId: 'p2',
      language: 'czech',
      english: 'I went',
      targetCorrect: 'Já šel',
      targetPrompt: 'Já šel',
      selectedWords: {},
    });

    const { trainingPhrases } = useStore.getState();
    expect(trainingPhrases).toHaveLength(2);

    // Filter by language
    const germanPhrases = trainingPhrases.filter(p => p.language === 'german');
    const czechPhrases = trainingPhrases.filter(p => p.language === 'czech');

    expect(germanPhrases).toHaveLength(1);
    expect(germanPhrases[0].targetCorrect).toBe('Ich ging');
    expect(czechPhrases).toHaveLength(1);
    expect(czechPhrases[0].targetCorrect).toBe('Já šel');
  });

  it('should prevent duplicate pattern IDs', () => {
    const { addPattern } = useStore.getState();

    const pattern: PhrasePattern = {
      id: 'duplicate-test',
      name: 'Test',
      language: 'german',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [],
    };

    addPattern(pattern);
    addPattern(pattern); // Try to add same pattern again

    const { patterns } = useStore.getState();
    expect(patterns).toHaveLength(1); // Should only have one
  });

  it('should prevent duplicate verb IDs', () => {
    const { addVerb } = useStore.getState();

    const verb: VerbConjugation = {
      id: 'duplicate-verb',
      infinitive: 'test',
      english: 'test',
      language: 'german',
      tense: 'present',
      conjugations: {},
    };

    addVerb(verb);
    addVerb(verb); // Try to add same verb again

    const { verbs } = useStore.getState();
    expect(verbs).toHaveLength(1); // Should only have one
  });

  it('should update pattern correctly', () => {
    const { addPattern, updatePattern } = useStore.getState();

    addPattern({
      id: 'update-test',
      name: 'Original Name',
      language: 'german',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [],
    });

    updatePattern('update-test', { name: 'Updated Name' });

    const { patterns } = useStore.getState();
    expect(patterns[0].name).toBe('Updated Name');
  });

  it('should delete pattern and verb correctly', () => {
    const { addPattern, deletePattern, addVerb, deleteVerb } = useStore.getState();

    addPattern({
      id: 'delete-pattern',
      name: 'Test',
      language: 'german',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [],
    });

    addVerb({
      id: 'delete-verb',
      infinitive: 'test',
      english: 'test',
      language: 'german',
      tense: 'present',
      conjugations: {},
    });

    expect(useStore.getState().patterns).toHaveLength(1);
    expect(useStore.getState().verbs).toHaveLength(1);

    deletePattern('delete-pattern');
    deleteVerb('delete-verb');

    expect(useStore.getState().patterns).toHaveLength(0);
    expect(useStore.getState().verbs).toHaveLength(0);
  });
});

