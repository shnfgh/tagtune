// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { useFargharTheme, FargharTheme } from '../context/FargharThemeContext';
import { FargharSettingsModal } from './FargharSettingsModal';

interface FargharFooterProps {
  onClearAll: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const FargharPaletteIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const FargharExpandIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const FargharCompressIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const FargharSettingsIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FargharInfoIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const FargharFooter: React.FC<FargharFooterProps> = ({ onClearAll, isFullscreen, onToggleFullscreen }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const { theme, setTheme } = useFargharTheme();

  const currentYear = new Date().getFullYear();

  // Cycle through the 4 theme values on click
  const themeOrder: FargharTheme[] = ['dark', 'light', 'warm', 'cool'];
  const handleCycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  };

  return (
    <>
      <footer
        className="border-t mt-12"
        style={{
          backgroundColor: 'var(--farghar-footer-bg)',
          borderColor: 'var(--farghar-footer-border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {/* Mobile layout: copyright + 4 action icons */}
          <div className="flex flex-col sm:hidden items-center gap-4">
            <p className="text-xs text-center" style={{ color: 'var(--farghar-text-muted)' }}>
              © {currentYear} Farghar. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleCycleTheme}
                className="p-2 farghar-icon-btn farghar-native-touch min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Change theme"
              >
                <FargharPaletteIcon />
              </button>
              <button
                onClick={onToggleFullscreen}
                className="p-2 farghar-icon-btn farghar-native-touch min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <FargharCompressIcon /> : <FargharExpandIcon />}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 farghar-icon-btn farghar-native-touch min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Settings"
              >
                <FargharSettingsIcon />
              </button>
              <button
                onClick={() => setShowAbout(true)}
                className="p-2 farghar-icon-btn farghar-native-touch min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="About"
              >
                <FargharInfoIcon />
              </button>
            </div>
          </div>

          {/* Desktop layout: copyright + settings button */}
          <div className="hidden sm:flex items-center justify-between gap-6">
            <p className="text-sm" style={{ color: 'var(--farghar-text-secondary)' }}>
              © {currentYear} Farghar. All rights reserved.
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm farghar-native-touch"
              style={{
                backgroundColor: 'var(--farghar-btn-bg)',
                border: '1px solid var(--farghar-btn-border)',
                color: 'var(--farghar-btn-text)',
              }}
            >
              <FargharSettingsIcon />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <FargharSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onClearAll={onClearAll}
      />

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in" onClick={() => setShowAbout(false)} />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-2xl shadow-2xl farghar-slide-up overflow-hidden"
            style={{
              backgroundColor: 'var(--farghar-bg-secondary)',
              border: '1px solid var(--farghar-glass-border)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--farghar-glass-border)' }}>
              <h2 className="text-lg font-bold" style={{ color: 'var(--farghar-text)' }}>About</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 farghar-icon-btn farghar-native-touch"
              >
                <FargharCloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              <p className="text-base font-semibold" style={{ color: 'var(--farghar-text)' }}>Farghar Tag Editor</p>
              <p className="text-sm" style={{ color: 'var(--farghar-text-muted)' }}>Version 1.0.0</p>
              <p className="text-sm" style={{ color: 'var(--farghar-text-muted)' }}>
                © {currentYear} Farghar. All rights reserved.
              </p>
              <p className="text-xs pt-3" style={{ color: 'var(--farghar-text-muted)', borderTop: '1px solid var(--farghar-glass-border)' }}>
                Designed & Architected by Farghar
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
