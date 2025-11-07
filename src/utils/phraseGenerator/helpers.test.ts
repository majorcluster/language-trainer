import { describe, it, expect } from 'vitest';
import { capitalizeFirst, normalizeText, generateId } from './helpers';

describe('Phrase Generator Helpers', () => {
  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('test')).toBe('Test');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A');
    });
  });

  describe('normalizeText', () => {
    it('should normalize to lowercase', () => {
      expect(normalizeText('HELLO WORLD')).toBe('hello world');
    });

    it('should trim whitespace', () => {
      expect(normalizeText('  hello  world  ')).toBe('hello world');
    });

    it('should collapse multiple spaces', () => {
      expect(normalizeText('hello    world')).toBe('hello world');
    });

    it('should remove punctuation', () => {
      expect(normalizeText('Hello, world!')).toBe('hello world');
      expect(normalizeText('Test? Yes.')).toBe('test yes');
    });

    it('should handle complex normalization', () => {
      expect(normalizeText('  HELLO,  World!  ')).toBe('hello world');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should include timestamp', () => {
      const before = Date.now();
      const id = generateId();
      const after = Date.now();
      
      const timestamp = parseInt(id.split('-')[0]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });
});

