import { describe, it, expect } from 'vitest';
import { checkAnswer } from './answerChecker';

describe('Answer Checker', () => {
  it('should accept exact matches', () => {
    expect(checkAnswer('Ich ging ins Kino', 'Ich ging ins Kino')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(checkAnswer('ich ging ins kino', 'Ich ging ins Kino')).toBe(true);
    expect(checkAnswer('ICH GING INS KINO', 'Ich ging ins Kino')).toBe(true);
  });

  it('should normalize whitespace', () => {
    expect(checkAnswer('Ich  ging   ins Kino', 'Ich ging ins Kino')).toBe(true);
    expect(checkAnswer(' Ich ging ins Kino ', 'Ich ging ins Kino')).toBe(true);
  });

  it('should ignore punctuation', () => {
    expect(checkAnswer('Ich ging ins Kino.', 'Ich ging ins Kino')).toBe(true);
    expect(checkAnswer('Ich ging ins Kino!', 'Ich ging ins Kino')).toBe(true);
    expect(checkAnswer('Ich, ging ins Kino?', 'Ich ging ins Kino')).toBe(true);
  });

  it('should reject incorrect answers', () => {
    expect(checkAnswer('Ich gehe ins Kino', 'Ich ging ins Kino')).toBe(false);
    expect(checkAnswer('Wrong answer', 'Ich ging ins Kino')).toBe(false);
  });

  it('should accept alternative answers (pro-drop languages)', () => {
    expect(checkAnswer('Šel jsem', 'Já šel jsem', 'Šel jsem')).toBe(true);
    expect(checkAnswer('Já šel jsem', 'Já šel jsem', 'Šel jsem')).toBe(true);
  });

  it('should handle empty strings', () => {
    expect(checkAnswer('', 'test')).toBe(false);
    expect(checkAnswer('test', '')).toBe(false);
  });
});

