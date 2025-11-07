import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PatternEditor } from '@/components/PatternEditor';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useStore } from '@/store/useStore';
import { generateMultiplePhrases } from '@/utils/phraseGenerator';
import { getLanguageConfig } from '@/config/languages';
import { Plus, Trash2, RefreshCw, Edit, X } from 'lucide-react';
import { PhrasePattern, GeneratedPhrase } from '@/types';

export function Config() {
  const { patterns, addPattern, updatePattern, deletePattern, trainingPhrases, selectedLanguage, verbs, addVerb } = useStore();
  const languageConfig = getLanguageConfig(selectedLanguage);
  const [initialized, setInitialized] = useState(false);
  const [editingPattern, setEditingPattern] = useState<PhrasePattern | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletePatternConfirm, setDeletePatternConfirm] = useState<{
    isOpen: boolean;
    patternId: string | null;
    patternName: string | null;
  }>({ isOpen: false, patternId: null, patternName: null });
  const [previewPhrases, setPreviewPhrases] = useState<Record<string, GeneratedPhrase[]>>({});

  useEffect(() => {
    // Initialize with default patterns and verbs for selected language if none exist
    const languagePatterns = patterns.filter(p => p.language === selectedLanguage);
    const languageVerbs = verbs.filter(v => v.language === selectedLanguage);
    
    if (languagePatterns.length === 0 && !initialized) {
      languageConfig.defaultPatterns.forEach(pattern => addPattern(pattern));
    }
    
    if (languageVerbs.length === 0 && !initialized) {
      // Load default verbs
      languageConfig.defaultVerbs.forEach(verb => addVerb(verb));
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patterns.length, verbs.length, initialized, selectedLanguage]);

  const handleGeneratePhrases = (patternId: string, count: number = 5) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;

    const newPhrases = generateMultiplePhrases(pattern, count, verbs);
    setPreviewPhrases(prev => ({
      ...prev,
      [patternId]: newPhrases
    }));
  };

  const handleClosePreview = (patternId: string) => {
    setPreviewPhrases(prev => {
      const updated = { ...prev };
      delete updated[patternId];
      return updated;
    });
  };

  const handleDeletePattern = (patternId: string, patternName: string) => {
    setDeletePatternConfirm({ isOpen: true, patternId, patternName });
  };

  const confirmDeletePattern = () => {
    if (deletePatternConfirm.patternId) {
      deletePattern(deletePatternConfirm.patternId);
    }
  };

  const handleSavePattern = (pattern: PhrasePattern) => {
    if (editingPattern) {
      updatePattern(pattern.id, pattern);
    } else {
      addPattern(pattern);
    }
    setEditingPattern(null);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingPattern(null);
    setIsCreating(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuration
          </h1>
          <p className="text-gray-600">
            Manage your phrase patterns and word combinations
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          New Pattern
        </Button>
      </div>

      <div className="grid gap-6">
        {patterns.filter(p => p.language === selectedLanguage).map((pattern) => (
          <Card key={pattern.id} className="space-y-4">
            <div className="pattern-card-header grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start gap-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pattern.name}
                </h3>
                {pattern.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {pattern.description}
                  </p>
                )}
              </div>
              <div className="pattern-card-actions grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingPattern(pattern)}
                  className="gap-1 px-3"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeletePattern(pattern.id, pattern.name)}
                  className="gap-1 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  English Template:
                </p>
                <p className="text-sm font-mono text-gray-900 break-words">
                  {pattern.englishTemplate}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {getLanguageConfig(pattern.language).name} Template:
                </p>
                <p className="text-sm font-mono text-gray-900 break-words">
                  {pattern.targetTemplate}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Slots ({pattern.slots.length}):
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {pattern.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-gray-900 mb-1 break-words">
                      {slot.label}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded">
                        {slot.type}
                      </span>
                      {slot.requiredCase && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                          {slot.requiredCase}
                        </span>
                      )}
                      {slot.verbId && (
                        <span className="text-gray-400">
                          {verbs.find(v => v.id === slot.verbId)?.infinitive || slot.verbId}
                        </span>
                      )}
                      {slot.preposition && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-mono">
                          {slot.preposition}
                        </span>
                      )}
                      {slot.options && (
                        <span className="text-gray-400">
                          {slot.options.length} options
                        </span>
                      )}
                      {slot.fixedText && (
                        <span className="text-gray-400 font-mono">
                          "{slot.fixedText}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleGeneratePhrases(pattern.id, 5)}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Show 5 Examples
              </Button>
            </div>

            {previewPhrases[pattern.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Example Phrases
                  </h4>
                  <button
                    onClick={() => handleClosePreview(pattern.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {previewPhrases[pattern.id].map((phrase, idx) => (
                    <div
                      key={phrase.id}
                      className="bg-gray-50 p-3 rounded-lg space-y-1"
                    >
                      <div className="grid grid-cols-[auto_1fr] gap-2">
                        <span className="text-xs font-medium text-gray-500 mt-0.5">
                          {idx + 1}.
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">
                            {phrase.english}
                          </p>
                          <p className="text-sm font-semibold text-primary-700">
                            {phrase.targetCorrect}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {patterns.filter(p => p.language === selectedLanguage).length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No {languageConfig.name} patterns configured yet
          </p>
          <Button onClick={() => {
            languageConfig.defaultPatterns.forEach(pattern => addPattern(pattern));
            languageConfig.defaultVerbs.forEach(verb => addVerb(verb));
          }}>
            Load Default {languageConfig.name} Patterns
          </Button>
        </Card>
      )}

      {trainingPhrases.length > 0 && (
        <Card className="bg-green-50 border-green-200" variant="bordered">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Generated Phrases Ready
              </h3>
              <p className="text-sm text-green-800">
                You have {trainingPhrases.length} {languageConfig.name} practice {trainingPhrases.length === 1 ? 'phrase' : 'phrases'} ready to use in training.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = '/phrases'}
            >
              View Phrases
            </Button>
          </div>
        </Card>
      )}

      {(isCreating || editingPattern) && (
        <PatternEditor
          pattern={editingPattern || undefined}
          onSave={handleSavePattern}
          onCancel={handleCancelEdit}
        />
      )}

      <ConfirmModal
        isOpen={deletePatternConfirm.isOpen}
        onClose={() => setDeletePatternConfirm({ isOpen: false, patternId: null, patternName: null })}
        onConfirm={confirmDeletePattern}
        title="Delete Pattern"
        message={`Are you sure you want to delete "${deletePatternConfirm.patternName}"? All associated training phrases will be lost.`}
        confirmText="Delete Pattern"
        cancelText="Cancel"
      />
    </div>
  );
}

