import { useStore } from '@/store/useStore';
import { LANGUAGES } from '@/config/languages';
import { Language } from '@/types';
import { Languages } from 'lucide-react';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSelector() {
  const { selectedLanguage, setLanguage } = useStore();

  return (
    <div className="language-selector flex items-center gap-2">
      <Languages className="w-4 h-4 text-gray-500" />
      <SelectPrimitive value={selectedLanguage} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-auto border-none shadow-none bg-transparent h-auto py-0 px-0 gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
        {Object.values(LANGUAGES).map((lang) => (
            <SelectItem key={lang.id} value={lang.id}>
            {lang.name}
            </SelectItem>
        ))}
        </SelectContent>
      </SelectPrimitive>
    </div>
  );
}

