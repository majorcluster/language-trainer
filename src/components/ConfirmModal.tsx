import { Button } from './Button';
import { Card } from './Card';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
      <Card className="confirm-modal max-w-md w-full">
        <div className="confirm-modal-header grid grid-cols-[1fr_auto] items-start gap-4 mb-4">
          <div className="grid grid-flow-col auto-cols-max items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full grid place-items-center ${
                variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  variant === 'danger' ? 'text-red-600' : 'text-yellow-600'
                }`}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="confirm-modal-footer grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}

