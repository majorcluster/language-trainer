import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Home } from './Home';
import { useStore } from '@/store/useStore';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Page - Language-Specific Stats', () => {
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

  it('should show correct pattern count for selected language', () => {
    useStore.setState({
      selectedLanguage: 'german',
      patterns: [
        { id: '1', name: 'German 1', language: 'german', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
        { id: '2', name: 'German 2', language: 'german', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
        { id: '3', name: 'Czech 1', language: 'czech', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
      ],
    });

    renderWithRouter(<Home />);
    
    // Should show 2 (German patterns only)
    const patternCards = screen.getAllByText(/patterns configured/i);
    expect(patternCards[0].previousSibling?.textContent).toBe('2');
  });

  it('should show correct phrase count for selected language', () => {
    useStore.setState({
      selectedLanguage: 'german',
      trainingPhrases: [
        { id: '1', patternId: 'p1', language: 'german', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
        { id: '2', patternId: 'p2', language: 'german', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
        { id: '3', patternId: 'p3', language: 'czech', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
        { id: '4', patternId: 'p4', language: 'czech', english: 'test', targetCorrect: 'test', targetPrompt: 'test', selectedWords: {} },
      ],
    });

    renderWithRouter(<Home />);
    
    // Find the phrases card and verify the count
    const phrasesCard = screen.getByText('Phrases').closest('.rounded-xl');
    expect(phrasesCard).toBeTruthy();
    expect(phrasesCard?.textContent).toContain('2'); // German phrases count
  });

  it('should update stats when language changes', () => {
    useStore.setState({
      selectedLanguage: 'german',
      patterns: [
        { id: 'g1', name: 'German', language: 'german', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
      ],
    });

    const { rerender } = renderWithRouter(<Home />);
    const patternsCard = screen.getByText('Patterns').closest('.rounded-xl');
    expect(patternsCard?.textContent).toContain('1'); // 1 German pattern

    // Switch to Czech with different counts
    useStore.setState({
      selectedLanguage: 'czech',
      patterns: [
        { id: 'g1', name: 'German', language: 'german', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
        { id: 'c1', name: 'Czech 1', language: 'czech', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
        { id: 'c2', name: 'Czech 2', language: 'czech', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
        { id: 'c3', name: 'Czech 3', language: 'czech', englishTemplate: 'test', targetTemplate: 'test', slots: [] },
      ],
    });

    rerender(<BrowserRouter><Home /></BrowserRouter>);
    
    const patternsCardAfter = screen.getByText('Patterns').closest('.rounded-xl');
    expect(patternsCardAfter?.textContent).toContain('3'); // 3 Czech patterns now
  });

  it('should show correct verb count for selected language', () => {
    useStore.setState({
      selectedLanguage: 'german',
      verbs: [
        { id: 'g1', infinitive: 'gehen', english: 'go/goes', language: 'german', tense: 'present', conjugations: {} },
        { id: 'g2', infinitive: 'haben', english: 'have/has', language: 'german', tense: 'present', conjugations: {} },
        { id: 'c1', infinitive: 'jít', english: 'go/goes', language: 'czech', tense: 'present', conjugations: {} },
      ],
    });

    renderWithRouter(<Home />);
    
    // Should show 2 (German verbs only)
    expect(screen.getByText(/Conjugation tables available/i).previousSibling?.textContent).toBe('2');
  });

  it('should display welcome message for selected language', () => {
    useStore.setState({ selectedLanguage: 'german' });
    const { rerender } = renderWithRouter(<Home />);
    expect(screen.getByText(/Master German declension/i)).toBeInTheDocument();

    useStore.setState({ selectedLanguage: 'czech' });
    rerender(<BrowserRouter><Home /></BrowserRouter>);
    expect(screen.getByText(/Master Czech declension/i)).toBeInTheDocument();
  });
});

