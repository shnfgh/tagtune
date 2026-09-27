// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { useFargharTheme, FargharTheme } from '../context/FargharThemeContext';

interface FargharHeaderProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

// Theme icons (each theme has a unique icon)
const FargharSunIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const FargharMoonIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FargharFlameIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const FargharSnowflakeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    <polyline points="9 5 12 2 15 5" />
    <polyline points="9 19 12 22 15 19" />
    <polyline points="5 9 2 12 5 15" />
    <polyline points="19 9 22 12 19 15" />
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

const FargharChevronDownIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FargharCheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const FargharHeader: React.FC<FargharHeaderProps> = ({ isFullscreen, onToggleFullscreen }) => {
  const { theme, setTheme } = useFargharTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes: { value: FargharTheme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <FargharSunIcon /> },
    { value: 'dark', label: 'Dark', icon: <FargharMoonIcon /> },
    { value: 'warm', label: 'Warm', icon: <FargharFlameIcon /> },
    { value: 'cool', label: 'Cool', icon: <FargharSnowflakeIcon /> },
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-20 gap-2">
          {/* Right: Theme Switcher */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all farghar-native-touch"
              style={{
                backgroundColor: 'var(--farghar-btn-bg)',
                border: '1px solid var(--farghar-btn-border)',
                color: 'var(--farghar-btn-text)',
              }}
              title="Change Theme"
            >
              {currentTheme?.icon}
              <span className="hidden sm:inline text-sm">{currentTheme?.label}</span>
              <FargharChevronDownIcon />
            </button>

            {showThemeMenu && (
              <div className="absolute top-full mt-2 right-0 w-48 farghar-menu-panel farghar-fade-in">
                {themes.map(t => {
                  const isActive = theme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value);
                        setShowThemeMenu(false);
                      }}
                      className={`farghar-menu-item w-full flex items-center gap-3 px-4 py-3 text-sm text-right ${isActive ? 'bg-purple-500/20 text-purple-300' : ''}`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                      {isActive && (
                        <span className="mr-auto text-purple-400">
                          <FargharCheckIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Center: Site Title (3-tier responsive layout) */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0">
            {/* Desktop (>= 640px): single-line full title */}
            <h1 className="hidden sm:block text-2xl font-bold farghar-gradient-text truncate max-w-full">
              Farghar Tag Editor
            </h1>
            {/* Mobile large (>= 380px): brand name on first line */}
            <h1 className="sm:hidden text-base font-bold farghar-gradient-text leading-tight truncate max-w-full">
              Farghar
            </h1>
            {/* Mobile large (>= 380px): uppercase subtitle on second line */}
            <span
              className="sm:hidden hidden min-[380px]:block text-[9px] font-medium tracking-[0.15em] uppercase leading-tight mt-0.5"
              style={{ color: 'var(--farghar-text-muted)' }}
            >
              Tag Editor
            </span>
          </div>

          {/* Left: Fullscreen Button only */}
          <div className="flex-shrink-0">
            <button
              onClick={onToggleFullscreen}
              className="p-2 farghar-icon-btn farghar-native-touch"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <FargharCompressIcon /> : <FargharExpandIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
