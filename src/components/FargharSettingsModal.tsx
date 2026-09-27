// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { FargharConfirmModal } from './FargharConfirmModal';

interface FargharSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const FargharSettingsModal: React.FC<FargharSettingsModalProps> = ({ isOpen, onClose }) => {
  const [autoSave, setAutoSave] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in" onClick={onClose} />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl border rounded-2xl shadow-2xl farghar-slide-up overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: 'var(--farghar-bg-secondary)',
          borderColor: 'var(--farghar-glass-border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 farghar-gradient rounded-xl flex items-center justify-center text-white">
              <FargharSettingsIcon />
            </div>
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors farghar-native-touch">
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
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${autoSave ? 'bg-purple-500' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoSave ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--farghar-text)' }}>Confirm before delete</p>
                  <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Show confirmation dialog before deleting files</p>
                </div>
                <button
                  onClick={() => setConfirmDelete(!confirmDelete)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${confirmDelete ? 'bg-purple-500' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${confirmDelete ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-right"
            >
              <h3 className="text-sm font-semibold" style={{ color: 'var(--farghar-text)' }}>Advanced</h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 farghar-fade-in">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}>
                  <p className="text-sm mb-2" style={{ color: 'var(--farghar-text)' }}>Storage Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '35%' }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>35% used</span>
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm transition-colors farghar-native-touch">
                  Clear All Data
                </button>
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--farghar-text)' }}>About</h3>
            <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}>
              <p className="text-sm" style={{ color: 'var(--farghar-text)' }}>Farghar Tag Editor</p>
              <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Version 1.0.0</p>
              <p className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Designed & Architected by Farghar</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="farghar-btn-secondary text-sm farghar-native-touch">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
