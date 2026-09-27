// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { useFargharTheme, FargharTheme } from '../context/FargharThemeContext';

interface FargharHeaderProps {
  fileCount: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
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

const FargharExpandIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const FargharCompressIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const FargharMenuIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const FargharChevronDownIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const FargharHeader: React.FC<FargharHeaderProps> = ({ fileCount, isFullscreen, onToggleFullscreen }) => {
  const { theme, setTheme } = useFargharTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const themes: { value: FargharTheme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <FargharSunIcon /> },
    { value: 'dark', label: 'Dark', icon: <FargharMoonIcon /> },
    { value: 'warm', label: 'Warm', icon: <FargharSunIcon /> },
    { value: 'cool', label: 'Cool', icon: <FargharMoonIcon /> },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <header 
      className="sticky top-0 z-50 border-b shadow-lg"
      style={{
        backgroundColor: 'var(--farghar-header-bg)',
        borderColor: 'var(--farghar-header-border)',
        boxShadow: `0 4px 6px -1px var(--farghar-header-shadow)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Right: Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all farghar-native-touch"
              style={{
                backgroundColor: 'var(--farghar-btn-bg)',
                border: '1px solid var(--farghar-btn-border)',
              }}
              title="Change Theme"
            >
              {currentTheme?.icon}
              <span className="hidden sm:inline text-sm">{currentTheme?.label}</span>
              <FargharChevronDownIcon />
            </button>

            {showThemeMenu && (
              <div 
                className="absolute top-full mt-2 right-0 w-48 rounded-xl shadow-2xl overflow-hidden farghar-fade-in"
                style={{
                  backgroundColor: 'var(--farghar-bg-secondary)',
                  border: '1px solid var(--farghar-glass-border)',
                }}
              >
                {themes.map(t => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-right ${
                      theme === t.value ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'
                    }`}
                    style={{ color: theme === t.value ? undefined : 'var(--farghar-text)' }}
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
              <p className="text-[10px] sm:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Professional Music Tag Editor</p>
            </div>
          </div>

          {/* Left: Menu & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-lg transition-all farghar-native-touch"
              style={{
                backgroundColor: 'var(--farghar-btn-bg)',
                border: '1px solid var(--farghar-btn-border)',
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <FargharCompressIcon /> : <FargharExpandIcon />}
            </button>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowSubMenu(!showSubMenu)}
                className="p-2 rounded-lg transition-all farghar-native-touch"
                style={{
                  backgroundColor: 'var(--farghar-btn-bg)',
                  border: '1px solid var(--farghar-btn-border)',
                }}
                title="Menu"
              >
                <FargharMenuIcon />
              </button>

              {showSubMenu && (
                <div 
                  className="absolute top-full mt-2 left-0 w-64 rounded-xl shadow-2xl overflow-hidden farghar-fade-in"
                  style={{
                    backgroundColor: 'var(--farghar-bg-secondary)',
                    border: '1px solid var(--farghar-glass-border)',
                  }}
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--farghar-text)' }}>Status</h3>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                      {fileCount > 0 && (
                        <div className="farghar-badge bg-purple-500/20 text-purple-300">
                          <span className="mr-1 flex items-center"><FargharFolderIcon /></span>
                          {fileCount} files
                        </div>
                      )}
                      <div className="farghar-badge bg-green-500/20 text-green-300">
                        <span className="mr-1 flex items-center"><FargharLockIcon /></span>
                        Secure & Local
                      </div>
                      <div className="farghar-badge bg-blue-500/20 text-blue-300">
                        <span className="mr-1">🎵</span>
                        MP3, FLAC, WAV
                      </div>
                      <div className="farghar-badge bg-yellow-500/20 text-yellow-300">
                        <span className="mr-1">🏷️</span>
                        ID3v1 & ID3v2
                      </div>
                      <div className="farghar-badge bg-pink-500/20 text-pink-300">
                        <span className="mr-1">🖼️</span>
                        Multi Artwork
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
