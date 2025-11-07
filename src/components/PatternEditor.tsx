import { useState, useRef, useEffect } from 'react';
import { PhrasePattern, PhraseSlot, WordVariant, GrammaticalCase, Gender } from '@/types';
import { Button } from './Button';
import { Input } from './Input';
import { Select, SelectItem } from './Select';
import { Card } from './Card';
import { ConfirmModal } from './ConfirmModal';
import { useStore } from '@/store/useStore';
import { getLanguageConfig } from '@/config/languages';
import { X, Plus, Trash2, UserPlus } from 'lucide-react';

interface PatternEditorProps {
  pattern?: PhrasePattern;
  onSave: (pattern: PhrasePattern) => void;
  onCancel: () => void;
}

export function PatternEditor({ pattern, onSave, onCancel }: PatternEditorProps) {
  const { verbs, selectedLanguage } = useStore();
  const [formData, setFormData] = useState<PhrasePattern>(
    pattern || {
      id: `pattern-${Date.now()}`,
      name: '',
      language: selectedLanguage,
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

  const [lastAddedSlotIndex, setLastAddedSlotIndex] = useState<number | null>(null);
  const [lastAddedWord, setLastAddedWord] = useState<{ slotIndex: number; wordIndex: number } | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const wordInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (lastAddedSlotIndex !== null && slotRefs.current[lastAddedSlotIndex]) {
      slotRefs.current[lastAddedSlotIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setLastAddedSlotIndex(null);
    }
  }, [lastAddedSlotIndex]);

  useEffect(() => {
    if (lastAddedWord !== null) {
      const key = `${lastAddedWord.slotIndex}-${lastAddedWord.wordIndex}`;
      const wordElement = wordRefs.current[key];
      const inputElement = wordInputRefs.current[key];
      
      if (wordElement) {
        wordElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        
        // Focus the first input field after scrolling
        setTimeout(() => {
          inputElement?.focus();
        }, 300); // Wait for scroll animation
      }
      setLastAddedWord(null);
    }
  }, [lastAddedWord]);

  const handleAddSlot = () => {
    const newSlot: PhraseSlot = {
      id: `slot-${Date.now()}`,
      type: 'object-phrase',
      label: 'New Slot',
      options: [],
    };
    const newSlots = [...formData.slots, newSlot];
    setFormData({
      ...formData,
      slots: newSlots,
    });
    setLastAddedSlotIndex(newSlots.length - 1);
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
    const currentOptions = newSlots[slotIndex].options || [];
    newSlots[slotIndex].options = [...currentOptions, newWord];
    setFormData({ ...formData, slots: newSlots });
    
    // Scroll to the newly added word
    setLastAddedWord({ slotIndex, wordIndex: currentOptions.length });
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

  const handleAddAllPronouns = (slotIndex: number) => {
    const newSlots = [...formData.slots];
    const languageConfig = getLanguageConfig(formData.language);
    const defaultPronouns = languageConfig.defaultPronounWords;
    const existingOptions = newSlots[slotIndex].options || [];
    
    // Merge with existing, avoiding duplicates by ID
    const existingIds = new Set(existingOptions.map(opt => opt.id));
    const newPronouns = defaultPronouns.filter(pron => !existingIds.has(pron.id));
    
    newSlots[slotIndex].options = [...existingOptions, ...newPronouns];
    setFormData({ ...formData, slots: newSlots });
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
    
    // Filter out incomplete words (missing baseForm or english)
    const cleanedSlots = formData.slots.map(slot => {
      if (!slot.options) return slot;
      
      const validWords = slot.options.filter(word => {
        // Keep words that have both baseForm and english filled
        const hasBaseForm = word.baseForm && word.baseForm.trim() !== '';
        const hasEnglish = word.english && word.english.trim() !== '';
        const isPronoun = word.category === 'pronoun';
        
        return hasBaseForm && (hasEnglish || isPronoun);
      });
      
      return { ...slot, options: validWords };
    });
    
    onSave({ ...formData, slots: cleanedSlots });
  };

  const currentLanguageConfig = getLanguageConfig(formData.language);

  return (
    <div className="pattern-editor-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="pattern-editor-modal max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 pt-0 pb-0">
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
              label={`${getLanguageConfig(formData.language).name} Template *`}
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
              <Card 
                key={slot.id} 
                variant="bordered" 
                className="slot-card space-y-3"
                ref={(el) => {
                  slotRefs.current[slotIndex] = el;
                }}
              >
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
                  <Select
                    label="Slot Type"
                      value={slot.type}
                    onChange={(value) =>
                      handleUpdateSlot(slotIndex, {
                        type: value as PhraseSlot['type'],
                      })
                    }
                    className="text-sm"
                  >
                    <SelectItem value="pronoun">Pronoun</SelectItem>
                    <SelectItem value="object-phrase">Object Phrase</SelectItem>
                    <SelectItem value="verb">Verb</SelectItem>
                    <SelectItem value="fixed">Fixed Text</SelectItem>
                  </Select>

                  {slot.type !== 'fixed' && (
                    <Select
                      label="Required Case"
                      value={slot.requiredCase || undefined}
                      onChange={(value) =>
                        handleUpdateSlot(slotIndex, {
                          requiredCase: value as GrammaticalCase | undefined,
                          })
                        }
                      className="text-sm"
                      placeholder="None"
                    >
                      <SelectItem value="nominative">Nominative</SelectItem>
                      <SelectItem value="accusative">Accusative</SelectItem>
                      <SelectItem value="dative">Dative</SelectItem>
                      <SelectItem value="genitive">Genitive</SelectItem>
                    </Select>
                  )}

                  {slot.type === 'object-phrase' && (
                    <Input
                      label="Preposition (optional)"
                      value={slot.preposition || ''}
                      onChange={(e) =>
                        handleUpdateSlot(slotIndex, { preposition: e.target.value })
                      }
                      placeholder={`e.g., ${currentLanguageConfig.examples.prepositions} (leave empty for direct object)`}
                      className="text-sm"
                    />
                  )}

                  {slot.type === 'fixed' && (
                    <Input
                      label="Fixed Text"
                      value={slot.fixedText || ''}
                      onChange={(e) =>
                        handleUpdateSlot(slotIndex, { fixedText: e.target.value })
                      }
                      placeholder="e.g., to"
                      className="text-sm"
                    />
                  )}

                  {slot.type === 'verb' && (
                    <Select
                      label="Select Verb"
                      value={slot.verbId || undefined}
                      onChange={(value) =>
                        handleUpdateSlot(slotIndex, { verbId: value })
                        }
                      className="text-sm"
                      placeholder="Choose a verb..."
                    >
                        {verbs
                          .filter(v => v.language === formData.language)
                          .map(verb => (
                          <SelectItem key={verb.id} value={verb.id}>
                              {verb.infinitive} ({verb.tense}) - {verb.english}
                          </SelectItem>
                          ))}
                    </Select>
                  )}
                </div>

                {slot.type !== 'fixed' && slot.type !== 'verb' && (
                  <div className="word-options-section space-y-2">
                    <div className="word-options-header grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Word Options ({slot.options?.length || 0})
                      </label>
                      <div className="word-options-buttons grid grid-cols-[1fr_1fr] gap-1 sm:grid-cols-2 sm:gap-2 sm:contents">
                        {slot.type === 'pronoun' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddAllPronouns(slotIndex)}
                            className="gap-1 text-xs px-2"
                            title="Add all default pronouns"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span className="hidden sm:inline">All Pronouns</span>
                            <span className="inline sm:hidden text-xs">All</span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddWord(slotIndex)}
                          className="gap-1 px-2"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="hidden sm:inline">Add Word</span>
                          <span className="inline sm:hidden text-xs">Add</span>
                        </Button>
                      </div>
                    </div>

                    <div className="word-options-list space-y-2 max-h-60 overflow-y-auto">
                      {(slot.options || []).map((word, wordIndex) => (
                        <div
                          key={word.id}
                          className="word-option-item bg-gray-50 p-3 rounded-lg space-y-2"
                          ref={(el) => {
                            wordRefs.current[`${slotIndex}-${wordIndex}`] = el;
                          }}
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
                              ref={(el) => {
                                wordInputRefs.current[`${slotIndex}-${wordIndex}`] = el;
                              }}
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
      </div>

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

