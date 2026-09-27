// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useEffect } from 'react';
import { useFargharSettings } from '../context/FargharSettingsContext';

interface FargharSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

const FargharSettingsIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FargharChevronDownIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FargharTrashIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Format bytes for display
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const FargharSettingsModal: React.FC<FargharSettingsModalProps> = ({ isOpen, onClose, onClearAll }) => {
  const { autoSave, setAutoSave, confirmDelete, setConfirmDelete, storageUsage, refreshStorageUsage } = useFargharSettings();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Refresh storage usage when modal opens
  useEffect(() => {
    if (isOpen) refreshStorageUsage();
  }, [isOpen, refreshStorageUsage]);

  if (!isOpen) return null;

  const handleClearAll = () => {
    onClose();
    onClearAll();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 min-[400px]:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full h-full min-[400px]:w-auto min-[400px]:h-auto min-[400px]:max-w-2xl min-[400px]:max-h-[90vh] farghar-modal-panel farghar-slide-up flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 min-[400px]:p-6 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--farghar-glass-border)' }}
        >
          <div className="flex items-center gap-2 min-[400px]:gap-3">
            <div className="w-8 min-[400px]:w-10 h-8 min-[400px]:h-10 farghar-gradient rounded-xl flex items-center justify-center text-white">
              <FargharSettingsIcon />
            </div>
            <h2 className="text-base min-[400px]:text-xl font-bold" style={{ color: 'var(--farghar-text)' }}>Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 farghar-icon-btn farghar-native-touch">
            <FargharCloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-[400px]:p-6 space-y-5 min-[400px]:space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-xs min-[400px]:text-sm font-semibold mb-3 min-[400px]:mb-4" style={{ color: 'var(--farghar-text)' }}>General</h3>
            <div className="space-y-3 min-[400px]:space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs min-[400px]:text-sm" style={{ color: 'var(--farghar-text)' }}>Auto-save changes</p>
                  <p className="text-[10px] min-[400px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Automatically save changes</p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className="relative w-11 min-[400px]:w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: autoSave ? 'rgb(168, 85, 247)' : 'var(--farghar-bg-tertiary)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: autoSave ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs min-[400px]:text-sm" style={{ color: 'var(--farghar-text)' }}>Confirm before delete</p>
                  <p className="text-[10px] min-[400px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Show confirmation dialog</p>
                </div>
                <button
                  onClick={() => setConfirmDelete(!confirmDelete)}
                  className="relative w-11 min-[400px]:w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: confirmDelete ? 'rgb(168, 85, 247)' : 'var(--farghar-bg-tertiary)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: confirmDelete ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full text-right">
              <h3 className="text-xs min-[400px]:text-sm font-semibold" style={{ color: 'var(--farghar-text)' }}>Advanced</h3>
              <span
                className="transition-transform"
                style={{
                  color: 'var(--farghar-text-muted)',
                  transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <FargharChevronDownIcon />
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-3 min-[400px]:mt-4 space-y-3 min-[400px]:space-y-4 farghar-fade-in">
                <div
                  className="p-3 min-[400px]:p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}
                >
                  <p className="text-xs min-[400px]:text-sm mb-2" style={{ color: 'var(--farghar-text)' }}>Storage Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--farghar-bg-tertiary)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${storageUsage.percent}%`, backgroundColor: 'rgb(168, 85, 247)' }}
                      />
                    </div>
                    <span className="text-[10px] min-[400px]:text-xs whitespace-nowrap" style={{ color: 'var(--farghar-text-muted)' }}>
                      {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleClearAll}
                  className="farghar-btn-danger w-full text-xs min-[400px]:text-sm flex items-center justify-center gap-2 farghar-native-touch"
                >
                  <FargharTrashIcon />
                  Clear All Data
                </button>
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs min-[400px]:text-sm font-semibold mb-3 min-[400px]:mb-4" style={{ color: 'var(--farghar-text)' }}>About</h3>
            <div
              className="p-3 min-[400px]:p-4 rounded-xl space-y-2"
              style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}
            >
              <p className="text-xs min-[400px]:text-sm" style={{ color: 'var(--farghar-text)' }}>Farghar Tag Editor</p>
              <p className="text-[10px] min-[400px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Version 1.0.0</p>
              <p className="text-[10px] min-[400px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Designed & Architected by Farghar</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-4 min-[400px]:p-6 flex-shrink-0"
          style={{ borderTop: '1px solid var(--farghar-glass-border)' }}
        >
          <button onClick={onClose} className="farghar-btn-secondary text-xs min-[400px]:text-sm farghar-native-touch">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
