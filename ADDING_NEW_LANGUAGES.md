# Guide: Adding a New Language

This guide provides step-by-step instructions for adding support for a new language to the Language Trainer application.

## Overview

The application is designed to be language-agnostic, with all language-specific data centralized in configuration files. Adding a new language involves:

1. Creating declension/conjugation rules
2. Creating default patterns and verbs
3. Updating the language configuration
4. Adding the language to TypeScript types

### No Redundancy Design

The configuration system follows the **DRY (Don't Repeat Yourself)** principle:

- **Pronouns**: Defined once in `defaultPronounWords` (as WordVariants with English translations). The simple pronoun list is automatically derived from this.
- **Default Data**: Patterns and verbs are defined in separate files and referenced in the config (not duplicated).
- **Grammar Rules**: Each language has one declension engine implementation.
- **Translations**: All word translations are stored in the config, not scattered across components.

You define each piece of data **exactly once**, and the system reuses it everywhere needed.

## Step-by-Step Instructions

### Step 1: Update Language Types

**File:** `src/types/index.ts`

Add your new language to the `Language` type:

```typescript
export type Language = 'german' | 'czech' | 'spanish'; // Add your language here
```

### Step 2: Create Declension Engine

**Create file:** `src/utils/declension/[language].ts`

Implement the `DeclensionEngine` interface with your language's grammar rules:

```typescript
import { DeclensionEngine } from './types';
import { GrammaticalCase, Gender, Number as GrammaticalNumber } from '@/types';

export const spanishDeclension: DeclensionEngine = {
  // Get definite article (e.g., "el", "la", "los", "las")
  getDefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    // Implement your language's article rules
    if (number === 'plural') {
      return gender === 'masculine' ? 'los' : 'las';
    }
    return gender === 'masculine' ? 'el' : 'la';
  },

  // Get indefinite article (e.g., "un", "una", "unos", "unas")
  getIndefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    // Implement your language's indefinite article rules
    if (number === 'plural') {
      return gender === 'masculine' ? 'unos' : 'unas';
    }
    return gender === 'masculine' ? 'un' : 'una';
  },

  // Decline noun based on case, gender, number
  declineNoun(
    word: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    // Implement noun declension rules
    // For languages without case system (like Spanish), just return the word
    return word;
  },

  // Decline adjective to match noun
  declineAdjective(
    adjective: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    // Implement adjective agreement rules
    // Example: for Spanish, add -a for feminine, -os/-as for plural
    if (number === 'plural') {
      return gender === 'masculine' ? adjective + 's' : adjective.replace(/o$/, 'as');
    }
    return gender === 'feminine' ? adjective.replace(/o$/, 'a') : adjective;
  },

  // Get possessive pronoun (e.g., "mi", "tu", "su")
  getPossessivePronoun(
    possessive: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    // Implement possessive pronoun rules
    return possessive;
  },

  // Conjugate verb for given pronoun
  conjugateVerb(
    verb: string,
    pronoun: string,
    verbs: VerbConjugation[]
  ): string {
    // Look up conjugation in verb tables
    const verbEntry = verbs.find(v => v.infinitive === verb);
    if (!verbEntry) return verb;
    
    return verbEntry.conjugations[pronoun] || verb;
  },
};
```

**Export from:** `src/utils/declension/index.ts`

```typescript
export { spanishDeclension } from './spanish';
```

### Step 3: Create Default Patterns

**Create file:** `src/data/[language]Patterns.ts`

Define default phrase patterns for your language:

```typescript
import { PhrasePattern, WordVariant } from '@/types';

// Pronouns for your language
export const SPANISH_PRONOUNS: WordVariant[] = [
  { id: 'yo', baseForm: 'yo', english: 'I', category: 'pronoun' },
  { id: 'tú', baseForm: 'tú', english: 'you', category: 'pronoun' },
  { id: 'él', baseForm: 'él', english: 'he', category: 'pronoun' },
  { id: 'ella', baseForm: 'ella', english: 'she', category: 'pronoun' },
  { id: 'nosotros', baseForm: 'nosotros', english: 'we', category: 'pronoun' },
  { id: 'vosotros', baseForm: 'vosotros', english: 'you (plural)', category: 'pronoun' },
  { id: 'ellos', baseForm: 'ellos', english: 'they', category: 'pronoun' },
];

// Default patterns
export const SPANISH_PATTERNS: PhrasePattern[] = [
  {
    id: 'spanish-going-places',
    name: 'Going to Places',
    language: 'spanish',
    description: 'Practice going to different places',
    englishTemplate: '{pronoun} went to the {place}',
    targetTemplate: '{pronoun} fue al/a la {place}',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Subject',
        options: SPANISH_PRONOUNS,
      },
      {
        id: 'place',
        type: 'object-phrase',
        label: 'Place',
        preposition: 'a', // Optional - Spanish "a" preposition
        requiredCase: 'nominative', // Spanish doesn't have case declension
        options: [
          { id: 'cine', baseForm: 'cine', english: 'cinema', category: 'noun', gender: 'masculine' },
          { id: 'escuela', baseForm: 'escuela', english: 'school', category: 'noun', gender: 'feminine' },
          { id: 'parque', baseForm: 'parque', english: 'park', category: 'noun', gender: 'masculine' },
        ],
      },
    ],
  },
];
```

### Step 4: Create Default Verbs

**Create file:** `src/data/[language]Verbs.ts`

Define default verb conjugations:

```typescript
import { VerbConjugation } from '@/types';

export const SPANISH_VERBS: VerbConjugation[] = [
  {
    id: 'ir-present',
    infinitive: 'ir',
    english: 'to go',
    language: 'spanish',
    tense: 'present',
    conjugations: {
      'yo': 'voy',
      'tú': 'vas',
      'él': 'va',
      'ella': 'va',
      'nosotros': 'vamos',
      'vosotros': 'vais',
      'ellos': 'van',
    },
  },
  {
    id: 'ir-past',
    infinitive: 'ir',
    english: 'went',
    language: 'spanish',
    tense: 'past',
    conjugations: {
      'yo': 'fui',
      'tú': 'fuiste',
      'él': 'fue',
      'ella': 'fue',
      'nosotros': 'fuimos',
      'vosotros': 'fuisteis',
      'ellos': 'fueron',
    },
  },
  // Example: Verb that governs a specific case (Czech reflexive verbs)
  {
    id: 'temer-present',
    infinitive: 'temer',
    english: 'to fear',
    language: 'spanish',
    tense: 'present',
    conjugations: {
      'yo': 'temo',
      'tú': 'temes',
      'él': 'teme',
      'ella': 'teme',
      'nosotros': 'tememos',
      'vosotros': 'teméis',
      'ellos': 'temen',
    },
    governsCase: 'dative', // Optional - if this verb requires objects in a specific case
  },
];
```

**Note on `governsCase`:**
- **Optional property** for verbs that require their direct object in a specific case
- Common in Czech (reflexive verbs), German (helfen + dative), Russian (verbs with prepositions)
- When set, this **overrides** the `requiredCase` on subsequent object-phrase slots
- See the "Case-Governing Verbs" section in Advanced Features for details

**Update:** `src/data/verbs.ts`

```typescript
import { GERMAN_VERBS } from './germanVerbs';
import { CZECH_VERBS } from './czechVerbs';
import { SPANISH_VERBS } from './spanishVerbs'; // Add import

export { GERMAN_VERBS } from './germanVerbs';
export { CZECH_VERBS } from './czechVerbs';
export { SPANISH_VERBS } from './spanishVerbs'; // Add export

export const DEFAULT_VERBS = [...GERMAN_VERBS, ...CZECH_VERBS, ...SPANISH_VERBS]; // Add to array
```

### Step 5: Add Language Configuration

**File:** `src/config/languages.ts`

Add imports:

```typescript
import { SPANISH_PATTERNS, SPANISH_PRONOUNS } from '@/data/spanishPatterns';
import { SPANISH_VERBS } from '@/data/spanishVerbs';
import { spanishDeclension } from '@/utils/declension/spanish';
```

Add language configuration to the `LANGUAGES` object:

```typescript
export const LANGUAGES: Record<string, LanguageConfig> = {
  // ... existing languages ...
  
  spanish: {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    
    // Grammar rules
    cases: ['nominative'], // Spanish doesn't have grammatical cases
    hasGenders: true,
    genders: ['masculine', 'feminine'], // No neuter in Spanish
    allowPronounDrop: true, // Spanish allows omitting subject pronouns
    
    // Pronouns
    pronouns: ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos'],
    
    // Gender-pronoun mapping (if applicable for past tense)
    // Leave undefined if not needed
    genderPronounMap: undefined,
    
    // Past tense behavior
    usesGenderForPastTense: false, // Spanish doesn't have gender-specific past tense
    
    // Example words for placeholders
    examples: {
      infinitive: 'hablar',
      prepositions: 'a, en, de, con',
    },
    
    // Phrase building vocabulary
    phraseBuilding: {
      possessives: ['mi', 'tu', 'su'],
      adjectives: ['grande', 'pequeño', 'nuevo', 'viejo', 'bonito'],
      dativeAdjectives: undefined, // Optional, only if your language needs it
      translations: {
        possessives: {
          'mi': 'my',
          'tu': 'your',
          'su': 'his/her',
        },
        adjectives: {
          'grande': 'big',
          'pequeño': 'small',
          'nuevo': 'new',
          'viejo': 'old',
          'bonito': 'beautiful',
        },
      },
    },
    
    // Default data for initialization
    defaultPatterns: SPANISH_PATTERNS,
    defaultPronounWords: SPANISH_PRONOUNS,
    defaultVerbs: SPANISH_VERBS,
    declensionEngine: spanishDeclension,
  },
};
```

### Step 6: Add Tests

**Create file:** `src/utils/declension/[language].test.ts`

Test your declension engine:

```typescript
import { describe, it, expect } from 'vitest';
import { spanishDeclension } from './spanish';

describe('Spanish Declension', () => {
  describe('Articles', () => {
    it('should return correct definite articles', () => {
      expect(spanishDeclension.getDefiniteArticle('nominative', 'masculine', 'singular')).toBe('el');
      expect(spanishDeclension.getDefiniteArticle('nominative', 'feminine', 'singular')).toBe('la');
      expect(spanishDeclension.getDefiniteArticle('nominative', 'masculine', 'plural')).toBe('los');
      expect(spanishDeclension.getDefiniteArticle('nominative', 'feminine', 'plural')).toBe('las');
    });

    it('should return correct indefinite articles', () => {
      expect(spanishDeclension.getIndefiniteArticle('nominative', 'masculine', 'singular')).toBe('un');
      expect(spanishDeclension.getIndefiniteArticle('nominative', 'feminine', 'singular')).toBe('una');
    });
  });

  describe('Adjective Agreement', () => {
    it('should agree adjectives with gender', () => {
      expect(spanishDeclension.declineAdjective('bonito', 'nominative', 'feminine', 'singular')).toBe('bonita');
      expect(spanishDeclension.declineAdjective('grande', 'nominative', 'masculine', 'singular')).toBe('grande');
    });
  });
});
```

**Update:** `src/config/languages.test.ts`

Add tests for your language config:

```typescript
it('should have Spanish configuration', () => {
  const spanish = getLanguageConfig('spanish');
  
  expect(spanish.id).toBe('spanish');
  expect(spanish.name).toBe('Spanish');
  expect(spanish.pronouns).toBeDefined();
  expect(spanish.defaultPatterns).toBeDefined();
  expect(spanish.defaultVerbs).toBeDefined();
  expect(spanish.declensionEngine).toBeDefined();
});
```

### Step 7: Verify the Integration

Run the following checks:

```bash
# Run all tests
npm test

# Run the app
npm run dev

# Check that your language appears in:
# - Language selector (header)
# - Pattern editor
# - Verb editor
# - All pages show correct language data
```

## What Happens Automatically

Once you add a language to the `LANGUAGES` configuration object, the following components **automatically** update without any additional code changes:

### ✅ Language Selector (Header)
The language selector in the header automatically displays all languages from the `LANGUAGES` config. No additional code needed.

### ✅ Pattern Editor
When creating a new pattern, the language field is automatically set to the currently selected language from the header.

### ✅ Verb Editor
When creating a new verb, the language field is automatically set to the currently selected language from the header.

### ✅ All Pages
All pages (Home, Config, Verbs, Phrases, Train) automatically filter and display data for the currently selected language.

### ✅ Default Data Loading
When you switch to a language with no patterns/verbs, the app automatically offers to load the `defaultPatterns` and `defaultVerbs` from your language config.

### 🔧 What You Need to Configure

The only files you need to modify are:
1. Language type definition
2. Declension engine implementation
3. Default patterns file
4. Default verbs file
5. Language configuration entry

Everything else (UI updates, filtering, routing) works automatically through the configuration system!

## Complete Example: Adding Spanish

Here's a minimal example for adding Spanish support:

### 1. Update Types

```typescript
// src/types/index.ts
export type Language = 'german' | 'czech' | 'spanish';
```

### 2. Create Declension Engine

```typescript
// src/utils/declension/spanish.ts
import { DeclensionEngine } from './types';
import { GrammaticalCase, Gender, Number as GrammaticalNumber, VerbConjugation } from '@/types';

export const spanishDeclension: DeclensionEngine = {
  getDefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    if (number === 'plural') {
      return gender === 'masculine' ? 'los' : 'las';
    }
    return gender === 'masculine' ? 'el' : 'la';
  },

  getIndefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    if (number === 'plural') {
      return gender === 'masculine' ? 'unos' : 'unas';
    }
    return gender === 'masculine' ? 'un' : 'una';
  },

  declineNoun(
    word: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    if (number === 'plural') {
      // Simple plural rules (you may need more sophisticated logic)
      if (word.endsWith('z')) {
        return word.slice(0, -1) + 'ces';
      }
      if (['a', 'e', 'i', 'o', 'u'].includes(word.slice(-1))) {
        return word + 's';
      }
      return word + 'es';
    }
    return word;
  },

  declineAdjective(
    adjective: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    let result = adjective;
    
    // Gender agreement
    if (gender === 'feminine' && adjective.endsWith('o')) {
      result = adjective.slice(0, -1) + 'a';
    }
    
    // Number agreement
    if (number === 'plural') {
      if (result.endsWith('z')) {
        result = result.slice(0, -1) + 'ces';
      } else if (['a', 'e', 'i', 'o', 'u'].includes(result.slice(-1))) {
        result = result + 's';
      } else {
        result = result + 'es';
      }
    }
    
    return result;
  },

  getPossessivePronoun(
    possessive: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number: GrammaticalNumber = 'singular'
  ): string {
    return possessive;
  },

  conjugateVerb(
    verb: string,
    pronoun: string,
    verbs: VerbConjugation[]
  ): string {
    const verbEntry = verbs.find(v => v.infinitive === verb);
    if (!verbEntry) return verb;
    
    return verbEntry.conjugations[pronoun] || verb;
  },
};
```

### 3. Create Default Data

```typescript
// src/data/spanishPatterns.ts
import { PhrasePattern, WordVariant } from '@/types';

export const SPANISH_PRONOUNS: WordVariant[] = [
  { id: 'yo', baseForm: 'yo', english: 'I', category: 'pronoun' },
  { id: 'tú', baseForm: 'tú', english: 'you', category: 'pronoun' },
  { id: 'él', baseForm: 'él', english: 'he', category: 'pronoun' },
  { id: 'ella', baseForm: 'ella', english: 'she', category: 'pronoun' },
  { id: 'nosotros', baseForm: 'nosotros', english: 'we', category: 'pronoun' },
  { id: 'vosotros', baseForm: 'vosotros', english: 'you (plural)', category: 'pronoun' },
  { id: 'ellos', baseForm: 'ellos', english: 'they (m)', category: 'pronoun' },
];

export const SPANISH_PATTERNS: PhrasePattern[] = [
  {
    id: 'spanish-ir-a',
    name: 'Going to Places (Ir a)',
    language: 'spanish',
    description: 'Practice the verb "ir" with destinations',
    englishTemplate: '{pronoun} went to the {place}',
    targetTemplate: '{pronoun} fue al/a la {place}',
    slots: [
      {
        id: 'pronoun',
        type: 'pronoun',
        label: 'Subject',
        options: SPANISH_PRONOUNS,
      },
      {
        id: 'place',
        type: 'object-phrase',
        label: 'Place',
        preposition: 'a', // Spanish "a" for direction
        options: [
          { id: 'cine', baseForm: 'cine', english: 'cinema', category: 'noun', gender: 'masculine' },
          { id: 'escuela', baseForm: 'escuela', english: 'school', category: 'noun', gender: 'feminine' },
          { id: 'parque', baseForm: 'parque', english: 'park', category: 'noun', gender: 'masculine' },
        ],
      },
    ],
  },
];
```

```typescript
// src/data/spanishVerbs.ts
import { VerbConjugation } from '@/types';

export const SPANISH_VERBS: VerbConjugation[] = [
  {
    id: 'ir-present',
    infinitive: 'ir',
    english: 'to go',
    language: 'spanish',
    tense: 'present',
    conjugations: {
      'yo': 'voy',
      'tú': 'vas',
      'él': 'va',
      'ella': 'va',
      'nosotros': 'vamos',
      'vosotros': 'vais',
      'ellos': 'van',
    },
  },
  {
    id: 'ir-past',
    infinitive: 'ir',
    english: 'went',
    language: 'spanish',
    tense: 'past',
    conjugations: {
      'yo': 'fui',
      'tú': 'fuiste',
      'él': 'fue',
      'ella': 'fue',
      'nosotros': 'fuimos',
      'vosotros': 'fuisteis',
      'ellos': 'fueron',
    },
  },
];
```

### 4. Update Language Configuration

```typescript
// src/config/languages.ts
import { SPANISH_PATTERNS, SPANISH_PRONOUNS } from '@/data/spanishPatterns';
import { SPANISH_VERBS } from '@/data/spanishVerbs';
import { spanishDeclension } from '@/utils/declension/spanish';

export const LANGUAGES: Record<string, LanguageConfig> = {
  // ... existing languages ...
  
  spanish: {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    cases: ['nominative'], // Spanish doesn't have grammatical cases
    hasGenders: true,
    genders: ['masculine', 'feminine'], // No neuter in Spanish
    allowPronounDrop: true,
    genderPronounMap: undefined, // Spanish doesn't need this
    usesGenderForPastTense: false,
    examples: {
      infinitive: 'hablar',
      prepositions: 'a, en, de, con',
    },
    prepositionConfig: {
      usesArticles: true, // Spanish uses articles (el, la)
      prepositionToEnglish: {
        'a': 'to',
        'en': 'in/at',
        'de': 'from/of',
        'con': 'with',
        'para': 'for',
        'por': 'for/by',
      },
      // prepositionToCase: undefined - Spanish doesn't have grammatical cases
    },
    phraseBuilding: {
      possessives: ['mi', 'tu', 'su'],
      adjectives: ['grande', 'pequeño', 'nuevo', 'viejo', 'bonito'],
      dativeAdjectives: undefined,
      translations: {
        possessives: {
          'mi': 'my',
          'tu': 'your',
          'su': 'his/her',
        },
        adjectives: {
          'grande': 'big',
          'pequeño': 'small',
          'nuevo': 'new',
          'viejo': 'old',
          'bonito': 'beautiful',
        },
      },
    },
    defaultPatterns: SPANISH_PATTERNS,
    defaultPronounWords: SPANISH_PRONOUNS,
    defaultVerbs: SPANISH_VERBS,
    declensionEngine: spanishDeclension,
  },
};
```

## Language Configuration Reference

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `Language` | Unique identifier matching the Language type |
| `name` | `string` | English name (e.g., "Spanish") |
| `nativeName` | `string` | Native name (e.g., "Español") |
| `cases` | `GrammaticalCase[]` | List of grammatical cases (use ['nominative'] if none) |
| `hasGenders` | `boolean` | Whether the language has grammatical gender |
| `genders` | `Gender[]` | List of genders (e.g., ['masculine', 'feminine']) |
| `allowPronounDrop` | `boolean` | Whether pronouns can be omitted |
| `usesGenderForPastTense` | `boolean` | Whether past tense conjugations vary by gender |
| `examples.infinitive` | `string` | Example verb for placeholders |
| `examples.prepositions` | `string` | Example prepositions for placeholders |
| `prepositionConfig.usesArticles` | `boolean` | Whether prepositions merge with articles (German: true, Czech: false) |
| `prepositionConfig.prepositionToEnglish` | `Record<string, string>` | Maps prepositions to English translations |
| `phraseBuilding.possessives` | `string[]` | Possessive pronouns for phrase generation |
| `phraseBuilding.adjectives` | `string[]` | Common adjectives for phrase generation |
| `phraseBuilding.translations` | `object` | English translations for possessives and adjectives |
| `defaultPatterns` | `PhrasePattern[]` | Default patterns to load |
| `defaultPronounWords` | `WordVariant[]` | Pronouns as WordVariants (also used to derive pronoun list) |
| `defaultVerbs` | `VerbConjugation[]` | Default verbs to load |
| `declensionEngine` | `DeclensionEngine` | Grammar engine for the language |

**Note:** The pronoun list for verb conjugations is automatically derived from `defaultPronounWords` by extracting the `baseForm` property. You don't need to specify pronouns separately.

### Optional Properties

| Property | Type | Description |
|----------|------|-------------|
| `genderPronounMap` | `Record<Gender, string[]>` | Maps genders to valid pronouns (for gender-specific past tense like Czech) |
| `prepositionConfig.prepositionToCase` | `Record<string, GrammaticalCase>` | Maps prepositions to required cases (Czech, Russian, etc.) |
| `phraseBuilding.dativeAdjectives` | `string[]` | Dative-specific adjectives (if applicable) |

## Testing Checklist

After adding a new language, verify:

- [ ] Language appears in the language selector
- [ ] Can create new patterns for the language
- [ ] Can create new verbs for the language
- [ ] Patterns generate correct phrases
- [ ] Declension rules work correctly
- [ ] Training mode works with the new language
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Can switch between languages without issues
- [ ] Default patterns and verbs load correctly

## Tips and Best Practices

### Grammar Rules

1. **Simple is better**: Start with basic rules and add complexity later
2. **Handle edge cases**: Consider irregular forms in your declension engine
3. **Test thoroughly**: Add test cases for all grammar rules

### Default Data

1. **Quality over quantity**: Start with 3-5 high-quality patterns
2. **Common verbs first**: Include the most frequently used verbs
3. **Variety**: Include different verb tenses and sentence structures
4. **Real examples**: Use authentic language examples

### Declension Engine

1. **Case systems**: If your language doesn't have cases, you can simplify the implementation
2. **Gender agreement**: Ensure articles and adjectives agree with nouns
3. **Number agreement**: Handle singular/plural correctly
4. **Verb conjugation**: Use the verb conjugation tables, don't implement conjugation in the engine

### Common Pitfalls

1. **Don't hardcode language checks**: Use the configuration system instead of `if (language === 'spanish')`
2. **Don't skip translations**: Every word/adjective needs an English translation
3. **Test edge cases**: Empty strings, missing verbs, irregular forms
4. **Follow naming conventions**: Use kebab-case for file names, matching other languages

## File Checklist

When adding a language, you'll create/modify these files:

### New Files (Required)
- [ ] `src/utils/declension/[language].ts` - Declension engine
- [ ] `src/utils/declension/[language].test.ts` - Declension tests
- [ ] `src/data/[language]Patterns.ts` - Default patterns
- [ ] `src/data/[language]Verbs.ts` - Default verbs

### Modified Files (Required)
- [ ] `src/types/index.ts` - Add language to `Language` type
- [ ] `src/config/languages.ts` - Add language configuration
- [ ] `src/utils/declension/index.ts` - Export new declension engine
- [ ] `src/data/verbs.ts` - Import and export new verbs
- [ ] `src/config/languages.test.ts` - Add configuration test

## Example: Czech (Reference Implementation)

The Czech implementation is a good reference for languages with:
- Complex case systems (7 cases)
- Gender-specific past tense conjugations
- Pronoun-drop capability

Key files to reference:
- `src/utils/declension/czech.ts` - Complex declension rules
- `src/data/czechPatterns.ts` - Patterns with case usage
- `src/data/czechVerbs.ts` - Verbs with gender-specific forms

## Example: German (Reference Implementation)

The German implementation is a good reference for languages with:
- Moderate case systems (4 cases)
- Mandatory pronouns
- Regular past tense (no gender variation)

Key files to reference:
- `src/utils/declension/german.ts` - Case-based declension
- `src/data/germanPatterns.ts` - Preposition-case relationships
- `src/data/germanVerbs.ts` - Regular conjugation tables

## Need Help?

If you encounter issues:

1. Check the console for TypeScript errors
2. Run `npm test` to verify all tests pass
3. Compare your implementation with German or Czech
4. Review the `LanguageConfig` interface for required fields
5. Ensure all imports/exports are correct

## Advanced Features

### Case-Governing Verbs (Verb Rection)

Some verbs require their objects to be in a specific grammatical case. For example, Czech reflexive verbs:
- "bát se" (to be afraid of) requires **genitive**
- "ptát se" (to ask about) requires **genitive**  
- "bavit se" (to enjoy) requires **instrumental**
- German: "helfen" (to help) requires **dative**

To support this:

**1. Add `governsCase` to verb definition:**

```typescript
// src/data/czechVerbs.ts
{
  id: 'bát-se-present',
  infinitive: 'bát se',
  english: 'to be afraid of',
  language: 'czech',
  tense: 'present',
  conjugations: {
    'já': 'bojím se',
    'ty': 'bojíš se',
    // ... more conjugations
  },
  governsCase: 'genitive', // ← This verb requires genitive for its object
}
```

**2. In patterns, the object-phrase slot will automatically use the governed case:**

```typescript
// src/data/czechPatterns.ts
slots: [
  {
    id: 'verb',
    type: 'verb',
    verbId: 'bát-se-present',
  },
  {
    id: 'object',
    type: 'object-phrase',
    label: 'Object',
    // No requiredCase needed - will use verb's governsCase (genitive)
    // No preposition - direct object
    options: [
      { id: 'pes', baseForm: 'pes', english: 'dog', category: 'noun', gender: 'masculine' },
    ],
  },
]
```

**3. Result:**
- Pattern: `{pronoun} bojím se {object}`
- Generated: "Já bojím se psa" (I am afraid of the dog)
- Noun "pes" is correctly in **genitive** case: "psa"

**Important:** The verb's `governsCase` **overrides** any `requiredCase` specified on the object-phrase slot. This ensures grammatical correctness when verbs have specific case requirements.

### Gender-Specific Past Tense (like Czech)

If your language has gender-specific past tense:

1. Set `usesGenderForPastTense: true`
2. Define `genderPronounMap` with pronoun-to-gender mappings:
   ```typescript
   genderPronounMap: {
     masculine: ['yo', 'tú', 'él'],
     feminine: ['yo', 'tú', 'ella'],
   }
   ```
3. Include `genderForms` in your verb conjugations

### Preposition-Case Relationships

If prepositions govern specific cases (like German):

1. Implement `getCaseForPreposition` in your declension engine
2. Reference the German implementation for examples

### Complex Plural Rules

For irregular plurals:

1. Consider creating a lookup table in your declension engine
2. Handle common patterns programmatically
3. Fall back to a default rule for unknown words

## Data Reuse - No Redundancy

The configuration system is designed to eliminate redundancy:

### Pronouns
You only define pronouns **once** in `defaultPronounWords`:
```typescript
defaultPronounWords: [
  { id: 'yo', baseForm: 'yo', english: 'I', category: 'pronoun' },
  // ...
]
```

These are automatically used for:
- Verb conjugation input fields (derived: `map(p => p.baseForm)`)
- Pattern editor "Add All Pronouns" feature
- Pattern slots

**No separate pronoun array needed!**

### Translations
All translations are in one place:
```typescript
phraseBuilding: {
  translations: {
    adjectives: { 'grande': 'big', 'pequeño': 'small' }
  }
}
```

Used automatically by the phrase generator across all patterns.

### Default Data
Patterns and verbs are defined once in their files, then referenced:
```typescript
defaultPatterns: SPANISH_PATTERNS,  // Reference, not copy
defaultVerbs: SPANISH_VERBS,        // Reference, not copy
```

No duplication of pattern or verb data!

## Slot Types Reference

### `pronoun`
Represents subject pronouns in the sentence.
```typescript
{
  id: 'subject',
  type: 'pronoun',
  label: 'Subject',
  options: SPANISH_PRONOUNS,
}
```

### `verb`
Represents a conjugated verb. Links to a VerbConjugation by ID.
```typescript
{
  id: 'action',
  type: 'verb',
  label: 'Verb',
  verbId: 'ir-past', // References a verb conjugation table
}
```

### `object-phrase`
Represents a noun phrase (subject, object, complement). Can optionally include a preposition.

**Without preposition (direct object):**
```typescript
{
  id: 'object',
  type: 'object-phrase',
  label: 'Direct Object',
  requiredCase: 'accusative',
  options: [/* nouns */],
}
```
→ Generates: "mein neues Buch" (my new book)

**With preposition (prepositional phrase):**
```typescript
{
  id: 'location',
  type: 'object-phrase',
  label: 'Location',
  preposition: 'in', // ← Optional preposition
  requiredCase: 'dative',
  options: [/* nouns */],
}
```
→ Generates: "im neuen Kino" (in the new cinema)

**Key points:**
- Automatically adds possessives and adjectives for variety
- Declines nouns based on `requiredCase`
- If verb governs a case, verb's case overrides `requiredCase`
- With `preposition`: builds prepositional phrase with proper case
- Without `preposition`: builds simple noun phrase

### `fixed`
Represents fixed text that doesn't change.

**Same text in both languages:**
```typescript
{
  id: 'word',
  type: 'fixed',
  label: 'Fixed Word',
  fixedText: 'hello',
}
```

**Different text per language:**
```typescript
{
  id: 'to',
  type: 'fixed',
  label: 'To (English only)',
  fixedTextEnglish: 'to',    // Appears in English
  fixedTextTarget: '',        // Empty = doesn't appear in target language
}
```

Use cases:
- English-only words that don't translate (like "to" in "gave X to Y" where target uses dative case)
- Particles or discourse markers
- Punctuation or formatting

## Conclusion

Adding a new language is straightforward thanks to the configuration-driven architecture. The key is to:

1. Understand your language's grammar rules
2. Fill out the `LanguageConfig` completely
3. Implement the `DeclensionEngine` interface
4. Create quality default patterns and verbs
5. Test thoroughly

**Everything is defined exactly once** - the application automatically handles reuse across all components. No redundancy, no duplication, no scattered data!

