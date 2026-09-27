// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { useFargharTheme, FargharTheme } from '../context/FargharThemeContext';
import { FargharConfirmModal } from './FargharConfirmModal';

interface FargharHeaderProps {
  fileCount: number;
}

const FargharLogoIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const FargharFolderIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FargharLockIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const FargharSunIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const FargharMoonIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FargharInfoIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const FargharChevronDownIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const FargharHeader: React.FC<FargharHeaderProps> = ({ fileCount }) => {
  const { theme, setTheme } = useFargharTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const themes: { value: FargharTheme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <FargharSunIcon /> },
    { value: 'dark', label: 'Dark', icon: <FargharMoonIcon /> },
    { value: 'warm', label: 'Warm', icon: <FargharSunIcon /> },
    { value: 'cool', label: 'Cool', icon: <FargharMoonIcon /> },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <>
      <header className="sticky top-0 z-50 farghar-glass border-b border-white/5 farghar-native-touch">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Right: Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all farghar-native-touch"
                title="Change Theme"
              >
                {currentTheme?.icon}
                <span className="hidden sm:inline text-sm">{currentTheme?.label}</span>
                <FargharChevronDownIcon />
              </button>

              {showThemeMenu && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden farghar-fade-in">
                  {themes.map(t => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-right ${
                        theme === t.value ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                      {theme === t.value && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-auto">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Center: Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 farghar-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <FargharLogoIcon />
              </div>
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold farghar-gradient-text">Farghar Tag Editor</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Professional Music Tag Editor</p>
              </div>
            </div>

            {/* Left: Info Button & Stats */}
            <div className="flex items-center gap-3">
              {fileCount > 0 && (
                <div className="farghar-badge bg-purple-500/20 text-purple-300">
                  <span className="mr-1 flex items-center"><FargharFolderIcon /></span>
                  {fileCount} files
                </div>
              )}
              <div className="farghar-badge bg-green-500/20 text-green-300">
                <span className="mr-1 flex items-center"><FargharLockIcon /></span>
                <span className="hidden sm:inline">Secure & Local</span>
              </div>
              <button
                onClick={() => setShowInfoModal(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all farghar-native-touch"
                title="About"
              >
                <FargharInfoIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      <FargharConfirmModal
        isOpen={showInfoModal}
        title="About Farghar Tag Editor"
        message="Farghar Tag Editor is a professional online music tag editor that allows you to edit tags and covers of your audio and video files directly in the browser. Free, secure, and no software installation required. Designed & Architected by Farghar."
        confirmLabel="Close"
        cancelLabel=""
        onConfirm={() => setShowInfoModal(false)}
        onCancel={() => setShowInfoModal(false)}
        variant="warning"
      />
    </>
  );
};
