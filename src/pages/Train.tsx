import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useStore } from '@/store/useStore';
import { generatePhraseFromPattern, checkAnswer } from '@/utils/phraseGenerator';
import { CheckCircle2, XCircle, RefreshCw, Lightbulb } from 'lucide-react';

export function Train() {
  const { patterns, addSession, currentPhrase, setCurrentPhrase, addTrainingPhrase, trainingPhrases } = useStore();
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (patterns.length > 0 && !currentPhrase) {
      generateNewPhrase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patterns.length, currentPhrase]);

  const generateNewPhrase = () => {
    if (patterns.length === 0) return;
    
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const phrase = generatePhraseFromPattern(randomPattern);
    
    // Check if this phrase already exists in trainingPhrases
    const phraseExists = trainingPhrases.some(
      tp => tp.germanCorrect === phrase.germanCorrect && tp.english === phrase.english
    );
    
    // Add to training phrases if it doesn't exist
    if (!phraseExists) {
      addTrainingPhrase(phrase);
    }
    
    setCurrentPhrase(phrase);
    setUserAnswer('');
    setFeedback({ type: null, message: '' });
    setAttempts(0);
    setShowHint(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPhrase || !userAnswer.trim()) return;

    const isCorrect = checkAnswer(userAnswer, currentPhrase.germanCorrect);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: '✓ Correct! Well done!',
      });
      
      addSession({
        id: `${Date.now()}-${Math.random()}`,
        phraseId: currentPhrase.id,
        userAnswer,
        correctAnswer: currentPhrase.germanCorrect,
        isCorrect: true,
        timestamp: Date.now(),
        attempts: newAttempts,
      });

      setTimeout(() => {
        generateNewPhrase();
      }, 2000);
    } else {
      setFeedback({
        type: 'error',
        message: '✗ Not quite right. Try again!',
      });
      
      if (newAttempts >= 2) {
        setShowHint(true);
      }
    }
  };

  const handleSkip = () => {
    if (currentPhrase) {
      addSession({
        id: `${Date.now()}-${Math.random()}`,
        phraseId: currentPhrase.id,
        userAnswer: userAnswer || '(skipped)',
        correctAnswer: currentPhrase.germanCorrect,
        isCorrect: false,
        timestamp: Date.now(),
        attempts: attempts + 1,
      });
    }
    generateNewPhrase();
  };

  if (patterns.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Patterns Configured
          </h2>
          <p className="text-gray-600 mb-6">
            You need to configure at least one phrase pattern before you can start training.
          </p>
          <Button onClick={() => window.location.href = '/config'}>
            Go to Configuration
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentPhrase) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <p className="text-gray-600">Loading phrase...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Training Session
        </h1>
        <p className="text-gray-600">
          Translate the English sentence to German with correct declensions
        </p>
      </div>

      <Card className="space-y-6">
        <div className="bg-primary-50 p-6 rounded-lg">
          <p className="text-sm text-primary-700 font-medium mb-2">
            English:
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {currentPhrase.english}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your German Translation:"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="text-lg"
            autoFocus
            disabled={feedback.type === 'success'}
          />

          {feedback.type && (
            <div
              className={`p-4 rounded-lg grid grid-cols-[auto_1fr] items-center gap-3 ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{feedback.message}</span>
            </div>
          )}

          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 mb-1">Hint:</p>
                  <p className="text-sm text-yellow-800">
                    The correct answer is: <span className="font-semibold">{currentPhrase.germanCorrect}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Button
              type="submit"
              disabled={!userAnswer.trim() || feedback.type === 'success'}
            >
              Check Answer
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
              className="px-6"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Attempts: {attempts} | Pattern: {patterns.find(p => p.id === currentPhrase.patternId)?.name}
          </p>
        </div>
      </Card>

      <Card variant="bordered" className="bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2 grid grid-flow-col auto-cols-max items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Tip
        </h3>
        <p className="text-sm text-blue-800">
          Pay attention to the grammatical case required by prepositions and verbs. 
          Articles and adjectives must match the gender, case, and number of the noun.
        </p>
      </Card>
    </div>
  );
}

