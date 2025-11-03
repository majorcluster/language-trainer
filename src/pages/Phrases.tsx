import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useStore } from '@/store/useStore';
import { Trash2, Languages } from 'lucide-react';

export function Phrases() {
  const { trainingPhrases, patterns, removeTrainingPhrase } = useStore();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    phraseId: string | null;
  }>({ isOpen: false, phraseId: null });

  const handleDeletePhrase = (phraseId: string) => {
    setDeleteConfirm({ isOpen: true, phraseId });
  };

  const confirmDeletePhrase = () => {
    if (deleteConfirm.phraseId) {
      removeTrainingPhrase(deleteConfirm.phraseId);
    }
  };

  const getPatternName = (patternId: string) => {
    return patterns.find(p => p.id === patternId)?.name || 'Unknown Pattern';
  };

  if (trainingPhrases.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generated Phrases
          </h1>
          <p className="text-gray-600">
            View and manage all your practice phrases
          </p>
        </div>

        <Card className="text-center py-12">
          <Languages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Phrases Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Go to Configuration and generate some phrases from your patterns
          </p>
          <Button onClick={() => window.location.href = '/config'}>
            Go to Configuration
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generated Phrases
        </h1>
        <p className="text-gray-600">
          {trainingPhrases.length} practice {trainingPhrases.length === 1 ? 'phrase' : 'phrases'} ready for training
        </p>
      </div>

      <div className="grid gap-4">
        {trainingPhrases.map((phrase) => (
          <Card key={phrase.id} className="phrase-card">
            <div className="grid grid-cols-[1fr_auto] items-start gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    English:
                  </p>
                  <p className="text-lg text-gray-900">
                    {phrase.english}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    German (Correct Answer):
                  </p>
                  <p className="text-lg font-semibold text-primary-700">
                    {phrase.germanCorrect}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Pattern: <span className="font-medium text-gray-700">{getPatternName(phrase.patternId)}</span>
                  </p>
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeletePhrase(phrase.id)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, phraseId: null })}
        onConfirm={confirmDeletePhrase}
        title="Delete Phrase"
        message="Are you sure you want to delete this practice phrase?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

