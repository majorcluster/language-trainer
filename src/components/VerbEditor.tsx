import { useState } from 'react';
import { VerbConjugation, Gender } from '@/types';
import { Button } from './Button';
import { Input } from './Input';
import { Select, SelectItem } from './Select';
import { Card } from './Card';
import { useStore } from '@/store/useStore';
import { getLanguageConfig } from '@/config/languages';
import { X } from 'lucide-react';

interface VerbEditorProps {
  verb?: VerbConjugation;
  onSave: (verb: VerbConjugation) => void;
  onCancel: () => void;
}

export function VerbEditor({ verb, onSave, onCancel }: VerbEditorProps) {
  const { selectedLanguage } = useStore();
  const languageConfig = getLanguageConfig(selectedLanguage);
  
  const [formData, setFormData] = useState<VerbConjugation>(
    verb || {
      id: `verb-${Date.now()}`,
      infinitive: '',
      english: '',
      language: selectedLanguage,
      tense: 'present',
      conjugations: {},
    }
  );

  const [useGenderForms, setUseGenderForms] = useState(
    !!verb?.genderForms || (languageConfig.usesGenderForPastTense && formData.tense === 'past')
  );

  const pronouns = languageConfig.defaultPronounWords.map(p => p.baseForm);

  const handleConjugationChange = (pronoun: string, value: string) => {
    setFormData({
      ...formData,
      conjugations: {
        ...formData.conjugations,
        [pronoun]: value,
      },
    });
  };

  const handleGenderFormChange = (gender: Gender, pronoun: string, value: string) => {
    const genderForms = formData.genderForms || {
      masculine: {},
      feminine: {},
      neuter: {},
    };

    setFormData({
      ...formData,
      genderForms: {
        ...genderForms,
        [gender]: {
          ...genderForms[gender],
          [pronoun]: value,
        },
      },
    });
  };

  const handleTenseChange = (tense: VerbConjugation['tense']) => {
    setFormData({ ...formData, tense });
    if (languageConfig.usesGenderForPastTense && tense === 'past') {
      setUseGenderForms(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up genderForms if not using them
    const dataToSave = { ...formData };
    if (!useGenderForms) {
      delete dataToSave.genderForms;
    }
    
    onSave(dataToSave);
  };

  return (
    <div className="verb-editor-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 !mt-0">
      <Card className="verb-editor-modal max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto !pt-0 !pb-0">
        <form onSubmit={handleSubmit} className="verb-editor-form space-y-6">
          <div className="verb-editor-header flex justify-between items-center sticky top-0 bg-white pb-4 border-b pt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {verb ? 'Edit Verb' : 'New Verb'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="verb-editor-basic-info space-y-4">
            <Select
              label="Tense *"
                  value={formData.tense}
              onChange={(value) => handleTenseChange(value as VerbConjugation['tense'])}
              required
            >
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="future">Future</SelectItem>
              <SelectItem value="perfect">Perfect</SelectItem>
            </Select>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Infinitive *"
                value={formData.infinitive}
                onChange={(e) => setFormData({ ...formData, infinitive: e.target.value })}
                placeholder={`e.g., ${languageConfig.examples.infinitive}`}
                required
              />

              <Input
                label="English Translation *"
                value={formData.english}
                onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                placeholder="e.g., to go"
                required
              />
            </div>

            {languageConfig.usesGenderForPastTense && formData.tense === 'past' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useGenderForms}
                    onChange={(e) => setUseGenderForms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium text-blue-900">
                    Use gender-specific forms (recommended for {languageConfig.name} past tense)
                  </span>
                </label>
              </div>
            )}
          </div>

          {!useGenderForms ? (
            <div className="verb-conjugations-section space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Conjugations
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {pronouns.map((pronoun) => (
                  <div key={pronoun} className="conjugation-input">
                    <Input
                      label={pronoun}
                      value={formData.conjugations[pronoun] || ''}
                      onChange={(e) => handleConjugationChange(pronoun, e.target.value)}
                      placeholder={`e.g., ${pronoun === 'ich' ? 'gehe' : ''}`}
                      className="text-sm"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="verb-gender-forms-section space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Gender-Specific Conjugations
              </h3>
              
              {(['masculine', 'feminine', 'neuter'] as Gender[]).map((gender) => (
                <Card key={gender} variant="bordered" className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 capitalize">
                    {gender}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pronouns
                      .filter((pronoun) => {
                        // Check if this pronoun is valid for this gender
                        const genderPronouns = languageConfig.genderPronounMap?.[gender];
                        return genderPronouns ? genderPronouns.includes(pronoun) : true;
                      })
                      .map((pronoun) => (
                        <div key={pronoun}>
                          <Input
                            label={pronoun}
                            value={formData.genderForms?.[gender]?.[pronoun] || ''}
                            onChange={(e) => handleGenderFormChange(gender, pronoun, e.target.value)}
                            placeholder={`e.g., ${pronoun} ${gender === 'masculine' ? 'šel' : gender === 'feminine' ? 'šla' : 'šlo'}`}
                            className="text-sm"
                            required
                          />
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="verb-editor-footer grid grid-cols-2 gap-3 sticky bottom-0 bg-white pt-4 border-t pb-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Verb</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

