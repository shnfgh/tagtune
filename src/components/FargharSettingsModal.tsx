// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useEffect } from 'react';
import { useFargharSettings } from '../context/FargharSettingsContext';

interface FargharSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll?: () => void;
}

const FargharSettingsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Format bytes to human-readable string
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const FargharSettingsModal: React.FC<FargharSettingsModalProps> = ({ isOpen, onClose, onClearAll }) => {
  const { settings, setAutoSave, setConfirmDelete, refreshStorageUsage } = useFargharSettings();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Refresh storage usage when modal opens
  useEffect(() => {
    if (isOpen) refreshStorageUsage();
  }, [isOpen, refreshStorageUsage]);

  if (!isOpen) return null;

  // Calculate storage percentage (assume 5MB limit for localStorage)
  const storageLimit = 5 * 1024 * 1024; // 5MB
  const storagePercentage = Math.min((settings.storageUsage / storageLimit) * 100, 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="farghar-menu-panel relative w-full max-w-2xl farghar-slide-up overflow-hidden" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--farghar-glass-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 farghar-gradient rounded-xl flex items-center justify-center" style={{ color: '#ffffff' }}>
              <FargharSettingsIcon />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--farghar-text)' }}>Settings</h2>
          </div>
          <button onClick={onClose} className="farghar-icon-btn p-2 farghar-native-touch">
            <FargharCloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--farghar-text)' }}>General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--farghar-text)' }}>Auto-save changes</p>
                  <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Automatically save changes to localStorage</p>
                </div>
                <button
                  onClick={() => setAutoSave(!settings.autoSave)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: settings.autoSave ? '#a855f7' : 'var(--farghar-bg-tertiary)' }}
                >
                  <div className="absolute top-1 w-4 h-4 rounded-full transition-transform" style={{ backgroundColor: '#ffffff', transform: settings.autoSave ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--farghar-text)' }}>Confirm before delete</p>
                  <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Show confirmation dialog before deleting files</p>
                </div>
                <button
                  onClick={() => setConfirmDelete(!settings.confirmDelete)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: settings.confirmDelete ? '#a855f7' : 'var(--farghar-bg-tertiary)' }}
                >
                  <div className="absolute top-1 w-4 h-4 rounded-full transition-transform" style={{ backgroundColor: '#ffffff', transform: settings.confirmDelete ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full text-right">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--farghar-text)' }}>Advanced</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform" style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 farghar-fade-in">
                <div className="farghar-card" style={{ padding: '1rem' }}>
                  <p className="text-sm mb-2" style={{ color: 'var(--farghar-text)' }}>Storage Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--farghar-bg-tertiary)' }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${storagePercentage}%`, backgroundColor: '#a855f7' }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>{formatBytes(settings.storageUsage)} used</span>
                  </div>
                </div>

                <button
                  onClick={onClearAll}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-colors farghar-native-touch"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                >
                  Clear All Data
                </button>
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--farghar-text)' }}>About</h3>
            <div className="farghar-card space-y-2" style={{ padding: '1rem' }}>
              <p className="text-sm" style={{ color: 'var(--farghar-text)' }}>Farghar Tag Editor</p>
              <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Version 1.0.0</p>
              <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Designed & Architected by Farghar</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6" style={{ borderTop: '1px solid var(--farghar-glass-border)' }}>
          <button onClick={onClose} className="farghar-btn-secondary text-sm farghar-native-touch">Close</button>
        </div>
      </div>
    </div>
  );
};
