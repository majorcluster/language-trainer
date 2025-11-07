import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Phrases } from './Phrases';
import { useStore } from '@/store/useStore';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Phrases Page - Language Filtering', () => {
  beforeEach(() => {
    useStore.setState({
      selectedLanguage: 'german',
      patterns: [],
      verbs: [],
      trainingPhrases: [],
      sessions: [],
      currentPhrase: null,
    });
  });

  it('should show empty state for selected language with no phrases', () => {
    renderWithRouter(<Phrases />);
    
    expect(screen.getByText(/No German Phrases Yet/i)).toBeInTheDocument();
  });

  it('should show correct empty state message when switching languages', () => {
    // German empty state
    useStore.setState({ selectedLanguage: 'german' });
    const { rerender } = renderWithRouter(<Phrases />);
    expect(screen.getByText(/No German Phrases Yet/i)).toBeInTheDocument();

    // Czech empty state
    useStore.setState({ selectedLanguage: 'czech' });
    rerender(<BrowserRouter><Phrases /></BrowserRouter>);
    expect(screen.getByText(/No Czech Phrases Yet/i)).toBeInTheDocument();
  });

  it('should only display phrases for selected language', () => {
    useStore.setState({
      selectedLanguage: 'german',
      trainingPhrases: [
        {
          id: 'german-phrase',
          patternId: 'p1',
          language: 'german',
          english: 'I went to the cinema',
          targetCorrect: 'Ich ging ins Kino',
          targetPrompt: 'Ich ging ins Kino',
          selectedWords: {},
        },
        {
          id: 'czech-phrase',
          patternId: 'p2',
          language: 'czech',
          english: 'I went to the cinema',
          targetCorrect: 'Já šel do kina',
          targetPrompt: 'Já šel do kina',
          selectedWords: {},
        },
      ],
    });

    renderWithRouter(<Phrases />);
    
    // Should show German phrase
    expect(screen.getByText('Ich ging ins Kino')).toBeInTheDocument();
    // Should NOT show Czech phrase
    expect(screen.queryByText('Já šel do kina')).not.toBeInTheDocument();
  });

  it('should update displayed phrases when language changes', () => {
    useStore.setState({
      selectedLanguage: 'german',
      trainingPhrases: [
        {
          id: 'german-phrase',
          patternId: 'p1',
          language: 'german',
          english: 'I went',
          targetCorrect: 'Ich ging',
          targetPrompt: 'Ich ging',
          selectedWords: {},
        },
        {
          id: 'czech-phrase',
          patternId: 'p2',
          language: 'czech',
          english: 'I went',
          targetCorrect: 'Já šel',
          targetPrompt: 'Já šel',
          selectedWords: {},
        },
      ],
    });

    const { rerender } = renderWithRouter(<Phrases />);
    expect(screen.getByText('Ich ging')).toBeInTheDocument();

    // Switch to Czech
    useStore.setState({ selectedLanguage: 'czech' });
    rerender(<BrowserRouter><Phrases /></BrowserRouter>);

    // Should now show Czech phrase
    expect(screen.getByText('Já šel')).toBeInTheDocument();
    expect(screen.queryByText('Ich ging')).not.toBeInTheDocument();
  });

  it('should show pronoun-dropped alternative for Czech', () => {
    useStore.setState({
      selectedLanguage: 'czech',
      trainingPhrases: [
        {
          id: 'czech-phrase',
          patternId: 'p1',
          language: 'czech',
          english: 'I went',
          targetCorrect: 'Já šel jsem',
          targetPrompt: 'Já šel jsem',
          targetWithoutPronoun: 'Šel jsem',
          selectedWords: {},
        },
      ],
    });

    renderWithRouter(<Phrases />);
    
    expect(screen.getByText('Já šel jsem')).toBeInTheDocument();
    expect(screen.getByText(/Or: Šel jsem/i)).toBeInTheDocument();
  });

  it('should show correct phrase count for selected language', () => {
    useStore.setState({
      selectedLanguage: 'german',
      trainingPhrases: [
        { id: '1', patternId: 'p1', language: 'german', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
        { id: '2', patternId: 'p2', language: 'german', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
        { id: '3', patternId: 'p3', language: 'czech', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
      ],
    });

    renderWithRouter(<Phrases />);
    
    // Should show count for German only (2 phrases)
    expect(screen.getByText(/2 German practice phrases/i)).toBeInTheDocument();
  });
});

