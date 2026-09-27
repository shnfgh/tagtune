// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useEffect } from 'react';

interface FargharConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

const FargharAlertIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const FargharConfirmModal: React.FC<FargharConfirmModalProps> = ({
  isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onCancel, variant = 'danger',
}) => {
  // Close on Escape / Confirm on Enter
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/20',
      confirmBtn: 'farghar-btn-danger',
    },
    warning: {
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      confirmBtn: 'farghar-btn-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 min-[400px]:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full h-full min-[400px]:w-auto min-[400px]:h-auto min-[400px]:max-w-md farghar-modal-panel farghar-slide-up flex flex-col">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-3 min-[400px]:top-4 left-3 min-[400px]:left-4 p-1.5 farghar-icon-btn farghar-native-touch z-10"
        >
          <FargharCloseIcon />
        </button>

        {/* Content - centered vertically */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Icon */}
          <div className={`w-12 min-[400px]:w-14 h-12 min-[400px]:h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center ${styles.iconColor} mb-4`}>
            <FargharAlertIcon />
          </div>

          {/* Title */}
          <h3
            className="text-base min-[400px]:text-lg font-semibold text-center mb-2 px-4"
            style={{ color: 'var(--farghar-text)' }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            className="text-xs min-[400px]:text-sm text-center mb-6 leading-relaxed max-w-md px-4"
            style={{ color: 'var(--farghar-text-muted)' }}
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-2 min-[400px]:gap-3 w-full max-w-md px-4">
            <button
              onClick={onCancel}
              className="farghar-btn-secondary flex-1 text-xs min-[400px]:text-sm farghar-native-touch"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`${styles.confirmBtn} flex-1 text-xs min-[400px]:text-sm farghar-native-touch`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
