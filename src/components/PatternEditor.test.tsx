import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PatternEditor } from './PatternEditor';
import { PhrasePattern } from '@/types';
import { useStore } from '@/store/useStore';

// Mock the store
vi.mock('@/store/useStore');

beforeEach(() => {
  vi.mocked(useStore).mockReturnValue({
    verbs: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
});

describe('PatternEditor - Validation', () => {
  it('should filter out words with empty fields when saving', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    const patternWithEmptyWords: PhrasePattern = {
      id: 'test-pattern',
      name: 'Test Pattern',
      language: 'german',
      englishTemplate: '{pronoun} test',
      targetTemplate: '{pronoun} test',
      slots: [
        {
          id: 'pronoun',
          type: 'pronoun',
          label: 'Pronoun',
          options: [
            { id: '1', baseForm: 'ich', english: 'I', category: 'pronoun' }, // Valid
            { id: '2', baseForm: '', english: '', category: 'pronoun' }, // Empty - should be removed
            { id: '3', baseForm: 'du', english: '', category: 'pronoun' }, // Missing English but pronoun - KEPT (translation engine handles it)
            { id: '4', baseForm: '', english: 'you', category: 'pronoun' }, // Missing baseForm - should be removed
            { id: '5', baseForm: 'wir', english: 'we', category: 'pronoun' }, // Valid
          ],
        },
      ],
    };

    render(
      <PatternEditor
        pattern={patternWithEmptyWords}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Submit the form
    const saveButton = screen.getByText('Save Pattern');
    fireEvent.click(saveButton);

    // Verify onSave was called
    expect(mockOnSave).toHaveBeenCalled();

    // Get the saved pattern
    const savedPattern = mockOnSave.mock.calls[0][0];

    // Should have 3 valid words (ich, du, wir) - pronouns can have empty English
    expect(savedPattern.slots[0].options).toHaveLength(3);
    expect(savedPattern.slots[0].options[0].baseForm).toBe('ich');
    expect(savedPattern.slots[0].options[1].baseForm).toBe('du');
    expect(savedPattern.slots[0].options[2].baseForm).toBe('wir');
  });

  it('should filter out nouns without English translation', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    const patternWithNouns: PhrasePattern = {
      id: 'test',
      name: 'Test',
      language: 'german',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [
        {
          id: 'noun',
          type: 'object-phrase',
          label: 'Noun',
          options: [
            { id: '1', baseForm: 'Auto', english: 'car', category: 'noun', gender: 'neuter' }, // Valid
            { id: '2', baseForm: '', english: '', category: 'noun' }, // Empty - removed
            { id: '3', baseForm: 'Haus', category: 'noun', gender: 'neuter' }, // No English - should be removed
          ],
        },
      ],
    };

    render(
      <PatternEditor
        pattern={patternWithNouns}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const saveButton = screen.getByText('Save Pattern');
    fireEvent.click(saveButton);

    const savedPattern = mockOnSave.mock.calls[0][0];

    // Should only have the word with both baseForm and english
    expect(savedPattern.slots[0].options).toHaveLength(1);
    expect(savedPattern.slots[0].options[0].baseForm).toBe('Auto');
    expect(savedPattern.slots[0].options[0].english).toBe('car');
  });

  it('should not save pattern if required fields are missing', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <PatternEditor
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Try to submit without filling required fields
    const saveButton = screen.getByText('Save Pattern');
    fireEvent.click(saveButton);

    // Should show alert (not call onSave)
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should handle slots with no options', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    const patternWithNoOptions: PhrasePattern = {
      id: 'test',
      name: 'Test',
      language: 'german',
      englishTemplate: 'test',
      targetTemplate: 'test',
      slots: [
        {
          id: 'fixed',
          type: 'fixed',
          label: 'Fixed',
          fixedText: 'test',
        },
      ],
    };

    render(
      <PatternEditor
        pattern={patternWithNoOptions}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const saveButton = screen.getByText('Save Pattern');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
    const savedPattern = mockOnSave.mock.calls[0][0];
    expect(savedPattern.slots[0].fixedText).toBe('test');
  });
});

