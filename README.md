# Language Trainer - German Declension Practice

A modern web application for practicing German declension through customizable phrase patterns. Built with React 18, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **Custom Phrase Patterns**: Create and manage different phrase patterns with variable word combinations
- **Declension Training**: Practice German articles, adjectives, and noun declensions in context
- **Instant Feedback**: Get immediate validation on your answers
- **Progress Tracking**: Monitor your accuracy and improvement over time

### 📚 German Grammar Support
- All four grammatical cases (Nominative, Accusative, Dative, Genitive)
- Article declension (definite and indefinite)
- Adjective endings (weak, mixed, and strong declension)
- Possessive pronouns
- Preposition-article contractions (ins, zum, etc.)

### 🎨 User Experience
- Mobile-responsive design
- Clean, modern interface
- Intuitive navigation
- Hint system for difficult phrases

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management with persistence
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon set

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

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Layout.tsx
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Train.tsx
│   └── Config.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── germanDeclension.ts
│   └── phraseGenerator.ts
├── store/            # State management
│   └── useStore.ts
├── data/             # Default data and patterns
│   └── defaultPatterns.ts
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## How It Works

### 1. Configuration
Navigate to the Configuration page to:
- View existing phrase patterns
- See the slots and word options for each pattern
- Generate practice phrases from patterns

The app comes with two default patterns:
- **Going to a place**: Practice accusative case with motion verbs (e.g., "I went to the cinema")
- **Giving something to someone**: Practice dative case with indirect objects (e.g., "I gave my old car to my youngest son")

### 2. Training
On the Training page:
1. You'll see an English sentence
2. Type the correct German translation with proper declensions
3. Get instant feedback
4. After 2 incorrect attempts, a hint will appear
5. Successfully complete the phrase to move to the next one

### 3. Progress Tracking
The home page shows:
- Number of active patterns
- Total exercises completed
- Your accuracy percentage

## German Declension Examples

### Example 1: "I went to the cinema"
**Correct:** `Ich ging ins Kino`

- `ins` is a contraction of `in` + `das` (accusative)
- `Kino` is neuter, requiring `das` in accusative case

### Example 2: "I gave my old car to my youngest son"
**Correct:** `Ich gab mein altes Auto meinem jüngsten Sohn`

- `mein altes Auto` - accusative case (direct object)
  - `mein` (possessive) + `altes` (adjective with mixed ending) + `Auto` (neuter noun)
- `meinem jüngsten Sohn` - dative case (indirect object)
  - `meinem` (possessive, dative) + `jüngsten` (adjective) + `Sohn` (masculine noun)

## Extending the Application

### Adding New Patterns

You can add new phrase patterns by creating a `PhrasePattern` object in `src/data/defaultPatterns.ts`:

```typescript
{
  id: 'pattern-3',
  name: 'Your Pattern Name',
  englishTemplate: '{pronoun} {verb} {object}',
  germanTemplate: '{pronoun} {verb} {object}',
  description: 'Description of what this pattern teaches',
  slots: [
    {
      id: 'pronoun',
      type: 'pronoun',
      label: 'Pronoun',
      options: PRONOUNS,
    },
    // Add more slots...
  ],
}
```

### Adding New Words

Add new words to the respective arrays in `src/data/defaultPatterns.ts`:
- `PRONOUNS`
- `NOUNS` (with gender specification)
- `ADJECTIVES`
- `SUPERLATIVES`

## Future Enhancements

Potential features for future development:
- [ ] Custom pattern creation UI
- [ ] More language support (Spanish, French, etc.)
- [ ] Detailed statistics and progress charts
- [ ] Spaced repetition algorithm
- [ ] Audio pronunciation
- [ ] Export/import patterns
- [ ] User accounts and cloud sync

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

