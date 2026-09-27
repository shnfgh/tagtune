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
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          className="absolute top-2 min-[360px]:top-3 min-[400px]:top-4 left-2 min-[360px]:left-3 min-[400px]:left-4 p-1 min-[360px]:p-1.5 farghar-icon-btn farghar-native-touch z-10"
        >
          <FargharCloseIcon />
        </button>

        {/* Content - centered vertically */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 min-[360px]:p-4 min-[400px]:p-6">
          {/* Icon - compact on smartwatch */}
          <div className={`w-10 min-[360px]:w-12 min-[400px]:w-14 h-10 min-[360px]:h-12 min-[400px]:h-14 rounded-xl min-[360px]:rounded-2xl ${styles.iconBg} flex items-center justify-center ${styles.iconColor} mb-2 min-[360px]:mb-3 min-[400px]:mb-4`}>
            <FargharAlertIcon />
          </div>

          {/* Title */}
          <h3
            className="text-xs min-[360px]:text-sm min-[400px]:text-lg font-semibold text-center mb-1.5 min-[360px]:mb-2 px-2"
            style={{ color: 'var(--farghar-text)' }}
          >
            {title}
          </h3>

          {/* Message - clamp long text on smartwatch */}
          <p
            className="text-[10px] min-[360px]:text-xs min-[400px]:text-sm text-center mb-3 min-[360px]:mb-4 min-[400px]:mb-6 leading-relaxed max-w-md px-2 line-clamp-4 min-[360px]:line-clamp-none"
            style={{ color: 'var(--farghar-text-muted)' }}
          >
            {message}
          </p>

          {/* Actions - stacked on smartwatch, row on larger screens */}
          <div className="flex flex-col min-[360px]:flex-row gap-1.5 min-[360px]:gap-2 min-[400px]:gap-3 w-full max-w-md px-2">
            <button
              onClick={onCancel}
              className="farghar-btn-secondary flex-1 text-[11px] min-[360px]:text-xs min-[400px]:text-sm farghar-native-touch min-h-[32px] min-[360px]:min-h-[36px]"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`${styles.confirmBtn} flex-1 text-[11px] min-[360px]:text-xs min-[400px]:text-sm farghar-native-touch min-h-[32px] min-[360px]:min-h-[36px]`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
