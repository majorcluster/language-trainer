import { useState } from 'react';
import { PhrasePattern, PhraseSlot, WordVariant, GrammaticalCase, Gender, Language } from '@/types';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { ConfirmModal } from './ConfirmModal';
import { LANGUAGES } from '@/config/languages';
import { X, Plus, Trash2 } from 'lucide-react';

interface PatternEditorProps {
  pattern?: PhrasePattern;
  onSave: (pattern: PhrasePattern) => void;
  onCancel: () => void;
}

export function PatternEditor({ pattern, onSave, onCancel }: PatternEditorProps) {
  const [formData, setFormData] = useState<PhrasePattern>(
    pattern || {
      id: `pattern-${Date.now()}`,
      name: '',
      language: 'german',
      englishTemplate: '',
      targetTemplate: '',
      description: '',
      slots: [],
    }
  );

  const [deleteSlotConfirm, setDeleteSlotConfirm] = useState<{
    isOpen: boolean;
    slotIndex: number | null;
  }>({ isOpen: false, slotIndex: null });

  const [deleteWordConfirm, setDeleteWordConfirm] = useState<{
    isOpen: boolean;
    slotIndex: number | null;
    wordIndex: number | null;
  }>({ isOpen: false, slotIndex: null, wordIndex: null });

  const handleAddSlot = () => {
    const newSlot: PhraseSlot = {
      id: `slot-${Date.now()}`,
      type: 'noun-phrase',
      label: 'New Slot',
      options: [],
    };
    setFormData({
      ...formData,
      slots: [...formData.slots, newSlot],
    });
  };

  const handleUpdateSlot = (index: number, updates: Partial<PhraseSlot>) => {
    const newSlots = [...formData.slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    setFormData({ ...formData, slots: newSlots });
  };

  const handleDeleteSlot = (index: number) => {
    setDeleteSlotConfirm({ isOpen: true, slotIndex: index });
  };

  const confirmDeleteSlot = () => {
    if (deleteSlotConfirm.slotIndex !== null) {
      const newSlots = formData.slots.filter((_, i) => i !== deleteSlotConfirm.slotIndex);
      setFormData({ ...formData, slots: newSlots });
    }
  };

  const handleAddWord = (slotIndex: number) => {
    const newWord: WordVariant = {
      id: `word-${Date.now()}`,
      baseForm: '',
      english: '',
      category: 'noun',
    };
    const newSlots = [...formData.slots];
    newSlots[slotIndex].options = [...(newSlots[slotIndex].options || []), newWord];
    setFormData({ ...formData, slots: newSlots });
  };

  const handleUpdateWord = (
    slotIndex: number,
    wordIndex: number,
    updates: Partial<WordVariant>
  ) => {
    const newSlots = [...formData.slots];
    const words = [...(newSlots[slotIndex].options || [])];
    words[wordIndex] = { ...words[wordIndex], ...updates };
    newSlots[slotIndex].options = words;
    setFormData({ ...formData, slots: newSlots });
  };

  const handleDeleteWord = (slotIndex: number, wordIndex: number) => {
    setDeleteWordConfirm({ isOpen: true, slotIndex, wordIndex });
  };

  const confirmDeleteWord = () => {
    if (deleteWordConfirm.slotIndex !== null && deleteWordConfirm.wordIndex !== null) {
      const newSlots = [...formData.slots];
      newSlots[deleteWordConfirm.slotIndex].options = (
        newSlots[deleteWordConfirm.slotIndex].options || []
      ).filter((_, i) => i !== deleteWordConfirm.wordIndex);
      setFormData({ ...formData, slots: newSlots });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.englishTemplate || !formData.targetTemplate) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="pattern-editor-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="pattern-editor-modal max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto pt-0 pb-0">
        <form onSubmit={handleSubmit} className="pattern-editor-form space-y-6">
          <div className="pattern-editor-header flex justify-between items-center sticky top-0 bg-white pb-4 border-b pt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {pattern ? 'Edit Pattern' : 'New Pattern'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="pattern-editor-basic-info space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language *
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.values(LANGUAGES).map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Pattern Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Going to a place"
              required
            />

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of what this pattern teaches"
            />

            <Input
              label="English Template *"
              value={formData.englishTemplate}
              onChange={(e) =>
                setFormData({ ...formData, englishTemplate: e.target.value })
              }
              placeholder="e.g., {pronoun} went to the {place}"
              required
            />

            <Input
              label={`${LANGUAGES[formData.language]?.name || 'Target'} Template *`}
              value={formData.targetTemplate}
              onChange={(e) => setFormData({ ...formData, targetTemplate: e.target.value })}
              placeholder="e.g., {pronoun} ging {prep-phrase}"
              required
            />
          </div>

          <div className="pattern-editor-slots-section space-y-4">
            <div className="slots-header grid grid-cols-[1fr_auto] items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Slots ({formData.slots.length})
              </h3>
              <Button type="button" onClick={handleAddSlot} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Slot
              </Button>
            </div>

            {formData.slots.map((slot, slotIndex) => (
              <Card key={slot.id} variant="bordered" className="slot-card space-y-3">
                <div className="slot-header grid grid-cols-[1fr_auto] items-start gap-4">
                  <div className="slot-inputs grid sm:grid-cols-2 gap-3">
                    <Input
                      label="Slot ID"
                      value={slot.id}
                      onChange={(e) =>
                        handleUpdateSlot(slotIndex, { id: e.target.value })
                      }
                      placeholder="e.g., pronoun"
                      className="text-sm"
                    />
                    <Input
                      label="Label"
                      value={slot.label}
                      onChange={(e) =>
                        handleUpdateSlot(slotIndex, { label: e.target.value })
                      }
                      placeholder="e.g., Pronoun"
                      className="text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteSlot(slotIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="slot-config grid sm:grid-cols-2 gap-3">
                  <div className="slot-type-selector">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slot Type
                    </label>
                    <select
                      value={slot.type}
                      onChange={(e) =>
                        handleUpdateSlot(slotIndex, {
                          type: e.target.value as PhraseSlot['type'],
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    >
                      <option value="pronoun">Pronoun</option>
                      <option value="noun-phrase">Noun Phrase</option>
                      <option value="preposition-phrase">Preposition Phrase</option>
                      <option value="verb">Verb</option>
                      <option value="fixed">Fixed Text</option>
                    </select>
                  </div>

                  {slot.type !== 'fixed' && (
                    <div className="case-selector">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Required Case
                      </label>
                      <select
                        value={slot.requiredCase || ''}
                        onChange={(e) =>
                          handleUpdateSlot(slotIndex, {
                            requiredCase: e.target.value ? (e.target.value as GrammaticalCase) : undefined,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        <option value="">None</option>
                        <option value="nominative">Nominative</option>
                        <option value="accusative">Accusative</option>
                        <option value="dative">Dative</option>
                        <option value="genitive">Genitive</option>
                      </select>
                    </div>
                  )}

                  {slot.type === 'fixed' && (
                    <Input
                      label="Fixed Text"
                      value={slot.fixedText || ''}
                      onChange={(e) =>
                        handleUpdateSlot(slotIndex, { fixedText: e.target.value })
                      }
                      placeholder="e.g., ging"
                      className="text-sm"
                    />
                  )}
                </div>

                {slot.type !== 'fixed' && (
                  <div className="word-options-section space-y-2">
                    <div className="word-options-header grid grid-cols-[1fr_auto] items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">
                        Word Options ({slot.options?.length || 0})
                      </label>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddWord(slotIndex)}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Word
                      </Button>
                    </div>

                    <div className="word-options-list space-y-2 max-h-60 overflow-y-auto">
                      {(slot.options || []).map((word, wordIndex) => (
                        <div
                          key={word.id}
                          className="word-option-item bg-gray-50 p-3 rounded-lg space-y-2"
                        >
                          <div className="word-inputs grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2">
                            <input
                              type="text"
                              value={word.baseForm}
                              onChange={(e) =>
                                handleUpdateWord(slotIndex, wordIndex, {
                                  baseForm: e.target.value,
                                })
                              }
                              placeholder="German (e.g., Kino)"
                              className="word-german-input px-2 py-1 rounded border border-gray-300 text-sm"
                            />
                            <input
                              type="text"
                              value={word.english || ''}
                              onChange={(e) =>
                                handleUpdateWord(slotIndex, wordIndex, {
                                  english: e.target.value,
                                })
                              }
                              placeholder="English (e.g., cinema)"
                              className="word-english-input px-2 py-1 rounded border border-gray-300 text-sm"
                            />
                            {word.category === 'noun' && (
                              <select
                                value={word.gender || ''}
                                onChange={(e) =>
                                  handleUpdateWord(slotIndex, wordIndex, {
                                    gender: e.target.value ? (e.target.value as Gender) : undefined,
                                  })
                                }
                                className="word-gender-select px-2 py-1 rounded border border-gray-300 text-sm"
                              >
                                <option value="">Gender</option>
                                <option value="masculine">M</option>
                                <option value="feminine">F</option>
                                <option value="neuter">N</option>
                              </select>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteWord(slotIndex, wordIndex)}
                              className="word-delete-btn text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="pattern-editor-footer grid grid-cols-2 gap-3 sticky bottom-0 bg-white pt-4 border-t pb-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Pattern</Button>
          </div>
        </form>
      </Card>

      <ConfirmModal
        isOpen={deleteSlotConfirm.isOpen}
        onClose={() => setDeleteSlotConfirm({ isOpen: false, slotIndex: null })}
        onConfirm={confirmDeleteSlot}
        title="Delete Slot"
        message="Are you sure you want to delete this slot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmModal
        isOpen={deleteWordConfirm.isOpen}
        onClose={() => setDeleteWordConfirm({ isOpen: false, slotIndex: null, wordIndex: null })}
        onConfirm={confirmDeleteWord}
        title="Delete Word"
        message="Are you sure you want to delete this word option?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

