import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { VerbEditor } from '@/components/VerbEditor';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useStore } from '@/store/useStore';
import { getLanguageConfig } from '@/config/languages';
import { Plus, Trash2, Edit, Zap } from 'lucide-react';
import { VerbConjugation, Gender } from '@/types';

export function Verbs() {
  const { verbs, addVerb, updateVerb, deleteVerb, selectedLanguage } = useStore();
  const languageConfig = getLanguageConfig(selectedLanguage);
  const [initialized, setInitialized] = useState(false);
  const [editingVerb, setEditingVerb] = useState<VerbConjugation | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    verbId: string | null;
    verbName: string | null;
  }>({ isOpen: false, verbId: null, verbName: null });

  useEffect(() => {
    const languageVerbs = verbs.filter(v => v.language === selectedLanguage);
    if (languageVerbs.length === 0 && !initialized) {
      languageConfig.defaultVerbs.forEach(verb => addVerb(verb));
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbs.length, initialized, selectedLanguage]);

  const handleDeleteVerb = (verbId: string, verbName: string) => {
    setDeleteConfirm({ isOpen: true, verbId, verbName });
  };

  const confirmDeleteVerb = () => {
    if (deleteConfirm.verbId) {
      deleteVerb(deleteConfirm.verbId);
    }
  };

  const handleSaveVerb = (verb: VerbConjugation) => {
    if (editingVerb) {
      updateVerb(verb.id, verb);
    } else {
      addVerb(verb);
    }
    setEditingVerb(null);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingVerb(null);
    setIsCreating(false);
  };

  const languageVerbs = verbs.filter(v => v.language === selectedLanguage);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verb Conjugations
          </h1>
          <p className="text-gray-600">
            Manage verb conjugation tables for {languageConfig.name}
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          New Verb
        </Button>
      </div>

      <div className="grid gap-6">
        {languageVerbs.map((verb) => (
          <Card key={verb.id} className="verb-card space-y-4">
            <div className="verb-card-header grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start gap-3">
              <div>
                <div className="grid grid-flow-col auto-cols-max items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {verb.infinitive}
                  </h3>
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {verb.tense}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {verb.english}
                </p>
              </div>
              <div className="verb-card-actions grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingVerb(verb)}
                  className="gap-1 px-3"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteVerb(verb.id, verb.infinitive)}
                  className="gap-1 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-3">Conjugations:</p>
              
              {!verb.genderForms ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.entries(verb.conjugations).map(([pronoun, form]) => (
                    <div key={pronoun} className="text-sm">
                      <span className="text-gray-600">{pronoun}:</span>{' '}
                      <span className="font-medium text-gray-900">{form}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
              {(['masculine', 'feminine', 'neuter'] as const).map((gender: Gender) => {
                const forms = verb.genderForms?.[gender];
                if (!forms) return null;
                
                return (
                  <div key={gender}>
                    <p className="text-xs font-semibold text-gray-700 capitalize mb-2">
                      {gender}:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(forms).map(([pronoun, form]) => (
                        <div key={pronoun} className="text-sm">
                          <span className="text-gray-600">{pronoun}:</span>{' '}
                          <span className="font-medium text-gray-900">{form}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {languageVerbs.length === 0 && (
        <Card className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            No {languageConfig.name} verbs configured yet
          </p>
          <Button onClick={() => {
            languageConfig.defaultVerbs.forEach(verb => addVerb(verb));
          }}>
            Load Default {languageConfig.name} Verbs
          </Button>
        </Card>
      )}

      {(isCreating || editingVerb) && (
        <VerbEditor
          verb={editingVerb || undefined}
          onSave={handleSaveVerb}
          onCancel={handleCancelEdit}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, verbId: null, verbName: null })}
        onConfirm={confirmDeleteVerb}
        title="Delete Verb"
        message={`Are you sure you want to delete the verb "${deleteConfirm.verbName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

