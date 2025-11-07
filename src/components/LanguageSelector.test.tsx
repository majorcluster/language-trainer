import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';
import { useStore } from '@/store/useStore';

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    // Reset store
    useStore.setState({
      selectedLanguage: 'german',
      patterns: [],
      verbs: [],
      trainingPhrases: [],
      sessions: [],
      currentPhrase: null,
    });
  });

  it('should render with current language selected', () => {
    render(<LanguageSelector />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent('German');
  });

  it('should display both language options', async () => {
    render(<LanguageSelector />);
    
    // Click to open the select
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    // Wait for options to appear
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'German' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Czech' })).toBeInTheDocument();
    });
  });

  it('should change language when option is selected', async () => {
    render(<LanguageSelector />);
    
    const trigger = screen.getByRole('combobox');
    
    // Open the select
    fireEvent.click(trigger);
    
    // Wait for options and click Czech
    await waitFor(() => {
      const czechOption = screen.getByRole('option', { name: 'Czech' });
      fireEvent.click(czechOption);
    });
    
    // Verify store was updated
    expect(useStore.getState().selectedLanguage).toBe('czech');
  });

  it('should clear current phrase when language changes', async () => {
    const { setCurrentPhrase } = useStore.getState();
    
    // Set a current phrase
    setCurrentPhrase({
      id: 'test',
      patternId: 'p1',
      language: 'german',
      english: 'test',
      targetCorrect: 'test',
      targetPrompt: 'test',
      selectedWords: {},
    });

    expect(useStore.getState().currentPhrase).not.toBeNull();

    render(<LanguageSelector />);
    const trigger = screen.getByRole('combobox');
    
    // Open the select and change language
    fireEvent.click(trigger);
    
    await waitFor(() => {
      const czechOption = screen.getByRole('option', { name: 'Czech' });
      fireEvent.click(czechOption);
    });
    
    // Current phrase should be cleared
    expect(useStore.getState().currentPhrase).toBeNull();
  });

  it('should maintain selected language on re-render', () => {
    const { setLanguage } = useStore.getState();
    setLanguage('czech');

    const { rerender } = render(<LanguageSelector />);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Czech');
    
    // Re-render component
    rerender(<LanguageSelector />);
    
    // Should still be Czech
    expect(screen.getByRole('combobox')).toHaveTextContent('Czech');
  });
});

