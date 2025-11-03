import { Link } from 'react-router-dom';
import { BookOpen, Settings, TrendingUp, FileText } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';

export function Home() {
  const { patterns, sessions, trainingPhrases } = useStore();
  
  const totalSessions = sessions.length;
  const correctSessions = sessions.filter(s => s.isCorrect).length;
  const accuracy = totalSessions > 0 
    ? Math.round((correctSessions / totalSessions) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Language Trainer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master German declension through practice. Build custom phrase patterns and train with real-world examples.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patterns</h3>
            <Settings className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-2">
            {patterns.length}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Active phrase patterns configured
          </p>
          <Link to="/config">
            <Button variant="secondary" className="w-full">
              Manage Patterns
            </Button>
          </Link>
        </Card>

        <Card>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Practice</h3>
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-2">
            {totalSessions}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Total exercises completed
          </p>
          <Link to="/train">
            <Button className="w-full">
              Start Training
            </Button>
          </Link>
        </Card>

        <Card>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Phrases</h3>
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-2">
            {trainingPhrases.length}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Ready for practice
          </p>
          <Link to="/phrases">
            <Button variant="secondary" className="w-full">
              View Phrases
            </Button>
          </Link>
        </Card>

        <Card>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accuracy</h3>
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-2">
            {accuracy}%
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Correct on first attempt
          </p>
          <Button variant="ghost" className="w-full" disabled>
            View Stats
          </Button>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-lg grid place-items-center mb-3">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Configure Patterns</h3>
            <p className="text-sm text-primary-100">
              Create phrase patterns with different word combinations and grammatical cases
            </p>
          </div>
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-lg grid place-items-center mb-3">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Practice Declension</h3>
            <p className="text-sm text-primary-100">
              Type the correct German translation with proper article and adjective declensions
            </p>
          </div>
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-lg grid place-items-center mb-3">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-primary-100">
              See your accuracy improve as you master different declension patterns
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

