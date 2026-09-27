// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useEffect } from 'react';
import { Farghar } from '../types';
import { useFargharSettings } from '../context/FargharSettingsContext';
import { useFargharTheme, FargharTheme } from '../context/FargharThemeContext';

interface FargharSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

// --- Icons ---
const FargharCloseIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FargharChevronIcon: React.FC = () => (
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

const FargharRefreshIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const FargharSunIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FargharFlameIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const FargharSnowflakeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// --- Reusable sub-components ---

// Segmented Control: replaces toggle switches for native-app feel
const SegmentedControl: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => (
  <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--farghar-glass-border)' }}>
    {options.map(opt => {
      const isActive = opt.value === value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-2.5 min-[360px]:px-3 py-1 min-[360px]:py-1.5 text-[10px] min-[360px]:text-xs font-medium transition-colors farghar-native-touch"
          style={{
            backgroundColor: isActive ? 'rgb(168, 85, 247)' : 'transparent',
            color: isActive ? '#ffffff' : 'var(--farghar-text-muted)',
          }}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

// Accordion section
const SettingsSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}>
    <button onClick={onToggle} className="w-full flex items-center justify-between p-2.5 min-[360px]:p-3 min-[400px]:p-4 text-right farghar-native-touch">
      <span className="text-xs min-[360px]:text-sm font-semibold" style={{ color: 'var(--farghar-text)' }}>{title}</span>
      <span style={{ color: 'var(--farghar-text-muted)', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
        <FargharChevronIcon />
      </span>
    </button>
    {isOpen && <div className="px-2.5 min-[360px]:px-3 min-[400px]:px-4 pb-2.5 min-[360px]:pb-3 min-[400px]:pb-4 space-y-2.5 min-[360px]:space-y-3 farghar-fade-in">{children}</div>}
  </div>
);

// Settings row: label + control
const SettingsRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-2 min-[360px]:gap-3">
    <div className="flex-1 min-w-0">
      <p className="text-xs min-[360px]:text-sm" style={{ color: 'var(--farghar-text)' }}>{label}</p>
      {description && <p className="text-[10px] min-[360px]:text-xs mt-0.5" style={{ color: 'var(--farghar-text-muted)' }}>{description}</p>}
    </div>
    {children}
  </div>
);

// Theme option button
const ThemeOption: React.FC<{
  theme: FargharTheme;
  current: FargharTheme;
  onSelect: (t: FargharTheme) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ theme, current, onSelect, icon, label }) => {
  const isActive = theme === current;
  return (
    <button
      onClick={() => onSelect(theme)}
      className="flex flex-col items-center justify-center gap-1 p-2 min-[360px]:p-2.5 rounded-lg transition-all farghar-native-touch"
      style={{
        backgroundColor: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
        border: `1px solid ${isActive ? 'rgb(168, 85, 247)' : 'var(--farghar-glass-border)'}`,
        color: isActive ? 'rgb(168, 85, 247)' : 'var(--farghar-text-muted)',
      }}
    >
      {icon}
      <span className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-xs">{label}</span>
    </button>
  );
};

// Format bytes for display
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Convert boolean to segmented control value
const boolToSeg = (b: boolean) => (b ? 'on' : 'off');
const segToBool = (v: string) => v === 'on';

export const FargharSettingsModal: React.FC<FargharSettingsModalProps> = ({ isOpen, onClose, onClearAll }) => {
  const { settings, updateSetting, resetToDefaults, storageUsage, refreshStorageUsage } = useFargharSettings();
  const { theme, setTheme } = useFargharTheme();

  // Accordion open state — General/Appearance/Behavior/Data open by default
  const [openSections, setOpenSections] = useState({
    general: true,
    appearance: true,
    behavior: true,
    data: true,
    about: false,
  });

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Refresh storage usage when modal opens
  useEffect(() => {
    if (isOpen) refreshStorageUsage();
  }, [isOpen, refreshStorageUsage]);

  if (!isOpen) return null;

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearAll = () => {
    onClose();
    onClearAll();
  };

  const handleResetDefaults = () => {
    resetToDefaults();
    setResetConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 min-[400px]:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full h-full min-[400px]:w-auto min-[400px]:h-auto min-[400px]:max-w-2xl min-[400px]:max-h-[90vh] farghar-modal-panel farghar-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 min-[360px]:p-4 min-[400px]:p-6 flex-shrink-0" style={{ borderBottom: '1px solid var(--farghar-glass-border)' }}>
          <h2 className="text-sm min-[360px]:text-base min-[400px]:text-xl font-bold" style={{ color: 'var(--farghar-text)' }}>Settings</h2>
          <button onClick={onClose} className="p-1.5 min-[360px]:p-2 farghar-icon-btn farghar-native-touch">
            <FargharCloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2.5 min-[360px]:p-3 min-[400px]:p-6 space-y-2 min-[360px]:space-y-3">
          {/* General */}
          <SettingsSection title="General" isOpen={openSections.general} onToggle={() => toggleSection('general')}>
            <SettingsRow label="Auto-save" description="Save changes to localStorage automatically">
              <SegmentedControl
                value={boolToSeg(settings.autoSave)}
                onChange={(v) => updateSetting('autoSave', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
            <SettingsRow label="Confirm before delete" description="Show dialog before removing files">
              <SegmentedControl
                value={boolToSeg(settings.confirmDelete)}
                onChange={(v) => updateSetting('confirmDelete', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
            <SettingsRow label="Confirm before clear" description="Show dialog before clearing all files">
              <SegmentedControl
                value={boolToSeg(settings.confirmClearAll)}
                onChange={(v) => updateSetting('confirmClearAll', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection title="Appearance" isOpen={openSections.appearance} onToggle={() => toggleSection('appearance')}>
            <div>
              <p className="text-xs min-[360px]:text-sm mb-1.5 min-[360px]:mb-2" style={{ color: 'var(--farghar-text)' }}>Theme</p>
              <div className="grid grid-cols-2 min-[360px]:grid-cols-4 gap-1.5 min-[360px]:gap-2">
                <ThemeOption theme="light" current={theme} onSelect={setTheme} icon={<FargharSunIcon />} label="Light" />
                <ThemeOption theme="dark" current={theme} onSelect={setTheme} icon={<FargharMoonIcon />} label="Dark" />
                <ThemeOption theme="warm" current={theme} onSelect={setTheme} icon={<FargharFlameIcon />} label="Warm" />
                <ThemeOption theme="cool" current={theme} onSelect={setTheme} icon={<FargharSnowflakeIcon />} label="Cool" />
              </div>
            </div>
            <SettingsRow label="Compact mode" description="Reduce padding for denser layout">
              <SegmentedControl
                value={boolToSeg(settings.compactMode)}
                onChange={(v) => updateSetting('compactMode', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
            <SettingsRow label="Animations" description="Enable smooth transitions">
              <SegmentedControl
                value={boolToSeg(settings.animations)}
                onChange={(v) => updateSetting('animations', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
          </SettingsSection>

          {/* Behavior */}
          <SettingsSection title="Behavior" isOpen={openSections.behavior} onToggle={() => toggleSection('behavior')}>
            <SettingsRow label="Show file sizes" description="Display file size in file list">
              <SegmentedControl
                value={boolToSeg(settings.showFileSizes)}
                onChange={(v) => updateSetting('showFileSizes', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
            <SettingsRow label="Show duration" description="Display track duration in file list">
              <SegmentedControl
                value={boolToSeg(settings.showDuration)}
                onChange={(v) => updateSetting('showDuration', segToBool(v))}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
              />
            </SettingsRow>
            <div>
              <p className="text-xs min-[360px]:text-sm mb-1.5 min-[360px]:mb-2" style={{ color: 'var(--farghar-text)' }}>Default cover type</p>
              <div className="flex flex-wrap gap-1 min-[360px]:gap-1.5">
                {Farghar.COVER_TYPES.map(ct => {
                  const isActive = settings.defaultCoverType === ct.value;
                  return (
                    <button
                      key={ct.value}
                      onClick={() => updateSetting('defaultCoverType', ct.value)}
                      className="px-2 min-[360px]:px-2.5 py-1 rounded-lg text-[10px] min-[360px]:text-xs transition-all farghar-native-touch"
                      style={{
                        backgroundColor: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgb(168, 85, 247)' : 'var(--farghar-glass-border)'}`,
                        color: isActive ? 'rgb(168, 85, 247)' : 'var(--farghar-text-muted)',
                      }}
                    >
                      {ct.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </SettingsSection>

          {/* Data */}
          <SettingsSection title="Data" isOpen={openSections.data} onToggle={() => toggleSection('data')}>
            <div className="p-2.5 min-[360px]:p-3 rounded-lg" style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}>
              <div className="flex items-center justify-between mb-1.5 min-[360px]:mb-2 gap-2">
                <p className="text-xs min-[360px]:text-sm" style={{ color: 'var(--farghar-text)' }}>Storage Usage</p>
                <span className="text-[10px] min-[360px]:text-xs whitespace-nowrap" style={{ color: 'var(--farghar-text-muted)' }}>{formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 min-[360px]:h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--farghar-bg-tertiary)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${storageUsage.percent}%`, backgroundColor: 'rgb(168, 85, 247)' }} />
                </div>
                <span className="text-[10px] min-[360px]:text-xs font-medium whitespace-nowrap" style={{ color: 'var(--farghar-text-muted)' }}>{storageUsage.percent}%</span>
              </div>
            </div>
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="farghar-btn-secondary w-full text-xs min-[360px]:text-sm farghar-native-touch flex items-center justify-center gap-2"
            >
              <FargharRefreshIcon />
              Reset to Defaults
            </button>
            <button
              onClick={handleClearAll}
              className="farghar-btn-danger w-full text-xs min-[360px]:text-sm farghar-native-touch flex items-center justify-center gap-2"
            >
              <FargharTrashIcon />
              Clear All Data
            </button>
          </SettingsSection>

          {/* About */}
          <SettingsSection title="About" isOpen={openSections.about} onToggle={() => toggleSection('about')}>
            <div className="space-y-1.5">
              <p className="text-xs min-[360px]:text-sm font-semibold" style={{ color: 'var(--farghar-text)' }}>Farghar Tag Editor</p>
              <p className="text-[10px] min-[360px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Version 1.0.0</p>
              <p className="text-[10px] min-[360px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>© {new Date().getFullYear()} Farghar. All rights reserved.</p>
            </div>
          </SettingsSection>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-3 min-[360px]:p-4 min-[400px]:p-6 flex-shrink-0" style={{ borderTop: '1px solid var(--farghar-glass-border)' }}>
          <button onClick={onClose} className="farghar-btn-secondary text-xs min-[360px]:text-sm farghar-native-touch">
            Close
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 min-[400px]:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm farghar-fade-in" onClick={() => setResetConfirmOpen(false)} />
          <div className="relative w-full h-full min-[400px]:w-auto min-[400px]:h-auto min-[400px]:max-w-sm farghar-modal-panel farghar-slide-up p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm min-[400px]:text-lg font-semibold mb-2" style={{ color: 'var(--farghar-text)' }}>Reset Settings?</h3>
            <p className="text-xs min-[400px]:text-sm mb-4" style={{ color: 'var(--farghar-text-muted)' }}>All settings will be reset to their default values.</p>
            <div className="flex flex-col min-[400px]:flex-row gap-2 w-full">
              <button onClick={() => setResetConfirmOpen(false)} className="farghar-btn-secondary flex-1 text-xs min-[400px]:text-sm farghar-native-touch">Cancel</button>
              <button onClick={handleResetDefaults} className="farghar-btn-primary flex-1 text-xs min-[400px]:text-sm farghar-native-touch">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
