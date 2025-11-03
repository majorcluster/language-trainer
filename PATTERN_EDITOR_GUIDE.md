# Pattern Editor Guide

## Features

### ✨ Create New Patterns
Click the **"New Pattern"** button on the Configuration page to create a custom phrase pattern from scratch.

### ✏️ Edit Existing Patterns
Click the **"Edit"** button on any pattern card to modify its settings, slots, and word options.

## How to Create/Edit a Pattern

### 1. Basic Information
- **Pattern Name**: A descriptive name (e.g., "Going to a place")
- **Description**: Brief explanation of what the pattern teaches
- **English Template**: The English sentence structure with placeholders (e.g., `{pronoun} went to the {place}`)
- **German Template**: The German sentence structure with placeholders (e.g., `{pronoun} ging {prep-phrase}`)

### 2. Slots
Slots are the variable parts of your sentence. Each slot can be configured with:

#### Slot Properties:
- **Slot ID**: Unique identifier used in templates (e.g., `pronoun`, `place`)
- **Label**: Human-readable name shown in the UI
- **Slot Type**: Choose from:
  - `Pronoun`: Personal pronouns (ich, du, er, sie, wir)
  - `Noun Phrase`: Nouns with articles/adjectives
  - `Preposition Phrase`: Prepositional phrases
  - `Verb`: Verb forms
  - `Fixed`: Static text that doesn't change
- **Required Case**: Grammatical case for declension (Nominative, Accusative, Dative, Genitive)
- **Fixed Text**: (Only for Fixed type) The static text to display

#### Word Options:
Each slot (except Fixed) needs word options. For each word, provide:
- **German**: The German base form (e.g., `Kino`, `alt`, `mein`)
- **English**: The English translation (e.g., `cinema`, `old`, `my`)
- **Gender**: (For nouns only) Masculine (M), Feminine (F), or Neuter (N)

### 3. Example Pattern

**Pattern Name**: Going to a place

**English Template**: `{pronoun} went to the {place}`

**German Template**: `{pronoun} ging {prep-phrase}`

**Slots**:
1. **pronoun**
   - Type: Pronoun
   - Options: ich, du, er, sie, wir

2. **prep-phrase**
   - Type: Preposition Phrase
   - Required Case: Accusative
   - Options:
     - Kino (cinema) - Neuter
     - Haus (house) - Neuter
     - Schule (school) - Feminine

**Result Examples**:
- English: "I went to the cinema"
- German: "Ich ging ins Kino" (in + das = ins)

## Tips

### Template Placeholders
- Use `{slot-id}` in templates where you want the slot content to appear
- Make sure slot IDs match between templates and slot definitions
- Use descriptive slot IDs (e.g., `subject`, `object`, `place`)

### Word Translations
- Always provide both German and English for accurate training
- Include gender for all German nouns (critical for proper declension)
- Use base forms (uninflected) - the system will handle declension

### Grammatical Cases
- **Nominative**: Subject of the sentence
- **Accusative**: Direct object, or after certain prepositions (in, durch, für, etc.)
- **Dative**: Indirect object, or after certain prepositions (mit, nach, bei, etc.)
- **Genitive**: Possession (less common in modern German)

### Testing Your Pattern
1. Save the pattern
2. Click **"Generate 5 Phrases"** to test it
3. Go to the Training page to practice with your new pattern
4. If something doesn't work, edit and adjust

## Common Patterns to Create

### Simple Patterns
- **Present Tense**: `{pronoun} {verb} {object}`
- **Location**: `{person} is in the {place}`
- **Possession**: `{person} has {adjective} {object}`

### Complex Patterns
- **Ditransitive Verbs**: `{pronoun} gave {possessive} {adj} {object} to {possessive2} {adj2} {person}`
- **Subordinate Clauses**: `{pronoun} said that {pronoun2} {verb} {object}`
- **Modal Verbs**: `{pronoun} wants to {verb} {object}`

## Troubleshooting

### Pattern doesn't generate correctly
- Check that all slot IDs in templates match the actual slot definitions
- Verify that word options have both German and English translations
- Ensure nouns have gender specified

### Declension is wrong
- Verify the Required Case for each slot
- Check that nouns have the correct gender (M/F/N)
- Make sure you're using base forms, not inflected forms

### Can't save pattern
- All required fields must be filled (marked with *)
- Pattern name, English template, and German template are required
- At least one slot is recommended for variable patterns

