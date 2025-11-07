import { describe, it, expect } from 'vitest';
import { LANGUAGES, getLanguageConfig } from './languages';

describe('Language Configuration', () => {
  it('should define German language correctly', () => {
    const german = LANGUAGES.german;
    
    expect(german.id).toBe('german');
    expect(german.name).toBe('German');
    expect(german.nativeName).toBe('Deutsch');
    expect(german.cases).toHaveLength(4);
    expect(german.cases).toEqual(['nominative', 'accusative', 'dative', 'genitive']);
    expect(german.hasGenders).toBe(true);
    expect(german.allowPronounDrop).toBe(false);
  });

  it('should define Czech language correctly', () => {
    const czech = LANGUAGES.czech;
    
    expect(czech.id).toBe('czech');
    expect(czech.name).toBe('Czech');
    expect(czech.nativeName).toBe('Čeština');
    expect(czech.cases).toHaveLength(7);
    expect(czech.cases).toContain('locative');
    expect(czech.cases).toContain('instrumental');
    expect(czech.cases).toContain('vocative');
    expect(czech.hasGenders).toBe(true);
    expect(czech.allowPronounDrop).toBe(true);
  });

  it('should get language config by id', () => {
    expect(getLanguageConfig('german').name).toBe('German');
    expect(getLanguageConfig('czech').name).toBe('Czech');
  });

  it('should fallback to German for unknown languages', () => {
    expect(getLanguageConfig('unknown').name).toBe('German');
  });
});

