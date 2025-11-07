# Language Trainer - Multi-Language Grammar Practice

A modern, extensible web application for practicing grammatical declensions and conjugations across multiple languages. Currently supports **German** and **Czech** with a fully language-agnostic architecture that makes adding new languages straightforward.

Built with React 18, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### 🎯 Core Functionality
- **Multi-Language Support**: Switch between German and Czech (easily extensible to more languages)
- **Custom Phrase Patterns**: Create and manage phrase patterns with variable word combinations
- **Verb Conjugations**: Practice verb conjugations with support for gender-specific forms
- **Declension Training**: Practice articles, adjectives, and noun declensions in context
- **Instant Feedback**: Get immediate validation on your answers
- **Progress Tracking**: Monitor your accuracy and improvement over time
- **Language-Specific Features**: Automatic case governance, pronoun dropping, gender forms

### 📚 Grammar Support

#### German
- All four grammatical cases (Nominative, Accusative, Dative, Genitive)
- Article declension (definite and indefinite)
- Adjective endings (weak, mixed, and strong declension)
- Possessive pronouns
- Preposition-article contractions (ins, zum, etc.)
- Verb conjugations (all tenses)

#### Czech
- All seven grammatical cases (Nominative, Genitive, Dative, Accusative, Vocative, Locative, Instrumental)
- No articles (articles-free language)
- Adjective declension (hard pattern)
- Gender-specific past tense conjugations
- Reflexive verbs with case governance
- Pronoun dropping support

### 🎨 User Experience
- Mobile-responsive design
- Clean, modern interface
- Intuitive navigation
- Hint system for difficult phrases

## Tech Stack

### Core
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality accessible components built on Radix UI
- **Lucide React** - Beautiful icon set

### State & Routing
- **Zustand** - Lightweight state management with localStorage persistence
- **React Router** - Client-side routing

### Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test        # Run tests in watch mode
npm test -- --run  # Run tests once
npm run test:ui    # Run tests with UI
npm run test:coverage  # Run tests with coverage report
```

The test suite includes:
- German declension tests (articles, adjectives, possessives, verbs)
- Czech declension tests (7 cases, indeclinable possessives, gender forms)
- Language configuration tests
- Answer validation tests (including pro-drop languages)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── LanguageSelector.tsx
│   ├── PatternEditor.tsx
│   ├── VerbEditor.tsx
│   └── Layout.tsx
├── pages/               # Page components
│   ├── Home.tsx         # Dashboard with stats
│   ├── Train.tsx        # Training mode
│   ├── Phrases.tsx      # Generated phrases library
│   ├── Verbs.tsx        # Verb conjugation management
│   └── Config.tsx       # Pattern configuration
├── config/              # Language configurations
│   └── languages.ts     # Language-specific configs (cases, pronouns, etc.)
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── declension/      # Language declension engines
│   │   ├── german.ts
│   │   ├── czech.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── phraseGenerator/ # Phrase building logic
│       ├── phraseBuilder.ts
│       ├── slotProcessors.ts
│       ├── nounPhraseBuilder.ts
│       ├── prepositionPhraseBuilder.ts
│       └── answerChecker.ts
├── store/               # State management
│   └── useStore.ts      # Zustand store with persistence
├── data/                # Default language data
│   ├── germanPatterns.ts
│   ├── czechPatterns.ts
│   ├── germanVerbs.ts
│   ├── czechVerbs.ts
│   └── verbs.ts
├── constants/           # App-wide constants
│   └── index.ts
├── lib/                 # Utility libraries
│   └── utils.ts         # shadcn/ui utilities
├── test/                # Test setup
│   └── setup.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles & CSS variables
```

## How It Works

### 1. Language Selection
Use the language selector in the header to switch between German and Czech. All pages automatically update to show content for the selected language.

### 2. Configuration Page
Navigate to the Configuration page to:
- View existing phrase patterns for your selected language
- Create custom patterns using the Pattern Editor
- See the slots and word options for each pattern
- Generate and preview practice phrases from patterns
- Load default patterns for the language

### 3. Verbs Page
Manage verb conjugation tables:
- View conjugations for all verb tenses
- Add custom verbs with full conjugation tables
- Support for gender-specific forms (Czech past tense)
- Delete or edit existing verbs

### 4. Phrases Page
Browse your generated phrase library:
- View all phrases generated from patterns
- See both target language and English translations
- Practice specific phrases
- Clear individual phrases or all at once

### 5. Training Mode
On the Training page:
1. You'll see an English sentence
2. Type the correct translation with proper declensions
3. Get instant feedback on your answer
4. After 2 incorrect attempts, a hint will appear
5. Successfully complete the phrase to move to the next one
6. Supports pronoun dropping for Czech (optional)

### 6. Progress Tracking
The home page shows:
- Language-specific statistics
- Number of active patterns per language
- Total exercises completed
- Your accuracy percentage
- Recent training sessions

## Grammar Examples

### German Examples

#### Example 1: "I went to the cinema"
**Correct:** `Ich ging ins Kino`

- `ins` is a contraction of `in` + `das` (accusative)
- `Kino` is neuter, requiring `das` in accusative case
- Motion verbs use accusative case

#### Example 2: "I gave my old car to my youngest son"
**Correct:** `Ich gab mein altes Auto meinem jüngsten Sohn`

- `mein altes Auto` - accusative case (direct object)
  - `mein` (possessive) + `altes` (adjective with mixed ending) + `Auto` (neuter noun)
- `meinem jüngsten Sohn` - dative case (indirect object)
  - `meinem` (possessive, dative) + `jüngsten` (adjective) + `Sohn` (masculine noun)

### Czech Examples

#### Example 1: "I am at the office"
**Correct:** `Já jsem v kanceláři`

- `v` (at/in) requires locative case
- `kancelář` → `kanceláři` (feminine locative)
- No articles in Czech

#### Example 2: "I am afraid of the dog"
**Correct:** `Já bojím se psa`

- `bát se` (to be afraid) governs genitive case
- `pes` → `psa` (masculine genitive)
- Reflexive verb with case governance

#### Example 3: "He went to the cinema" (with pronoun drop)
**Correct:** `Šel do kina` or `On šel do kina`

- Czech allows omitting pronouns (pro-drop language)
- `do` (to) requires genitive case
- `kino` → `kina` (neuter genitive)
- Past tense can show gender through verb form

## Extending the Application

### Adding New Languages

The application is fully language-agnostic and designed for easy extensibility. To add a new language (Spanish, French, Russian, etc.):

📖 **See the comprehensive guide:** [ADDING_NEW_LANGUAGES.md](./ADDING_NEW_LANGUAGES.md)

The guide covers:
- Step-by-step instructions for adding a language
- Language configuration reference
- Declension engine implementation
- Complete Spanish example
- Testing checklist
- Advanced features (gender-specific conjugations, case governance, etc.)

**Summary:** Adding a new language requires only:
1. Creating a declension engine (`src/utils/declension/[language].ts`)
2. Creating default patterns (`src/data/[language]Patterns.ts`)
3. Creating default verbs (`src/data/[language]Verbs.ts`)
4. Adding language configuration (`src/config/languages.ts`)
5. Updating the Language type

Everything else (UI, routing, filtering) works automatically!

### Adding New Patterns (via UI)

You can create custom patterns directly in the app:
1. Go to the **Configuration** page
2. Click **"New Pattern"**
3. Fill in the pattern details
4. Add slots (pronouns, verbs, objects, etc.)
5. Add word options to each slot
6. Save and test

### Adding New Verbs (via UI)

Add custom verb conjugations:
1. Go to the **Verbs** page
2. Click **"New Verb"**
3. Select tense (present, past, future, perfect)
4. Fill in all conjugation forms
5. For Czech past tense, optionally add gender-specific forms
6. Save

## Architecture Highlights

### Language-Agnostic Design
- **Zero hardcoded language checks** - All language logic is configuration-driven
- **Single source of truth** - Language configs in `src/config/languages.ts`
- **Pluggable engines** - Each language has its own declension engine
- **No redundancy** - All data defined exactly once

### Advanced Features
- **Verb Case Governance**: Verbs can specify which case they require for objects
- **Preposition Case Mapping**: Automatic case selection based on prepositions
- **Gender-Specific Conjugations**: Full support for languages with gender-based verb forms
- **Pronoun Dropping**: Automatic support for pro-drop languages
- **Article Merging**: German preposition-article contractions (ins, zum, etc.)

## Future Enhancements

Potential features for future development:
- [ ] More languages (Spanish, French, Russian, Polish, etc.)
- [ ] Detailed statistics and progress charts
- [ ] Spaced repetition algorithm (SRS)
- [ ] Audio pronunciation support
- [ ] Export/import patterns and verbs
- [ ] User accounts and cloud sync
- [ ] Mobile apps (using the same core logic)
- [ ] AI-powered phrase generation
- [ ] Flashcard mode

## Documentation

- **[ADDING_NEW_LANGUAGES.md](./ADDING_NEW_LANGUAGES.md)** - Comprehensive guide for adding new language support
- **[PATTERN_EDITOR_GUIDE.md](./PATTERN_EDITOR_GUIDE.md)** - Guide for using the pattern editor

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Areas for Contribution
- Adding new languages (Spanish, French, Russian, Polish, etc.)
- Improving declension rules for existing languages
- Adding more default patterns and verbs
- UI/UX improvements
- Additional test coverage
- Documentation improvements

## License

MIT

