import { ReactNode } from 'react';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clsx } from 'clsx';

interface SelectProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Select = ({
  label,
  error,
  value,
  onChange,
  children,
  placeholder,
  className,
  required,
  disabled,
}: SelectProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <SelectPrimitive value={value || undefined} onValueChange={onChange} disabled={disabled} required={required}>
        <SelectTrigger className={clsx(className, { 'border-red-500': error })}>
          <SelectValue placeholder={placeholder || 'Select...'} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </SelectPrimitive>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

Select.displayName = 'Select';

// Export SelectItem for use in parent components
export { SelectItem };

