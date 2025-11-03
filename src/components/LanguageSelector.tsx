import { useStore } from '@/store/useStore';
import { LANGUAGES } from '@/config/languages';
import { Language } from '@/types';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
  const { selectedLanguage, setLanguage } = useStore();

  return (
    <div className="language-selector grid grid-flow-col auto-cols-max items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
      <Languages className="w-4 h-4 text-gray-500" />
      <select
        value={selectedLanguage}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
      >
        {Object.values(LANGUAGES).map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

