// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Farghar } from '../types';

export interface FargharStorageUsage {
  used: number;
  total: number;
  percent: number;
}

export interface FargharSettings {
  autoSave: boolean;
  confirmDelete: boolean;
  confirmClearAll: boolean;
  compactMode: boolean;
  animations: boolean;
  defaultCoverType: Farghar.CoverType;
  showFileSizes: boolean;
  showDuration: boolean;
}

interface FargharSettingsContextType {
  settings: FargharSettings;
  updateSetting: <K extends keyof FargharSettings>(key: K, value: FargharSettings[K]) => void;
  resetToDefaults: () => void;
  storageUsage: FargharStorageUsage;
  refreshStorageUsage: () => void;
}

const SETTINGS_KEY = 'farghar_settings';
const DEFAULT_STORAGE_TOTAL = 5 * 1024 * 1024;

export const DEFAULT_SETTINGS: FargharSettings = {
  autoSave: true,
  confirmDelete: true,
  confirmClearAll: true,
  compactMode: false,
  animations: true,
  defaultCoverType: 'front',
  showFileSizes: true,
  showDuration: true,
};

const FargharSettingsContext = createContext<FargharSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  resetToDefaults: () => {},
  storageUsage: { used: 0, total: DEFAULT_STORAGE_TOTAL, percent: 0 },
  refreshStorageUsage: () => {},
});

// Load settings from localStorage safely, merging with defaults
function loadSettings(): FargharSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

// Calculate localStorage usage in bytes (UTF-16 estimate)
function calculateStorageUsage(): FargharStorageUsage {
  try {
    let totalChars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) totalChars += key.length + (localStorage.getItem(key) || '').length;
    }
    const usedBytes = totalChars * 2;
    const percent = Math.min(100, Math.round((usedBytes / DEFAULT_STORAGE_TOTAL) * 100));
    return { used: usedBytes, total: DEFAULT_STORAGE_TOTAL, percent };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { used: 0, total: DEFAULT_STORAGE_TOTAL, percent: 0 };
  }
}

export const FargharSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FargharSettings>(() => loadSettings());
  const [storageUsage, setStorageUsage] = useState<FargharStorageUsage>(() => calculateStorageUsage());

  const refreshStorageUsage = useCallback(() => {
    setStorageUsage(calculateStorageUsage());
  }, []);

  // Persist settings and apply document-level attributes
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    // Apply compact mode and animations flags on the html element for global effect
    document.documentElement.setAttribute('data-compact', settings.compactMode ? 'true' : 'false');
    document.documentElement.setAttribute('data-animations', settings.animations ? 'on' : 'off');
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof FargharSettings>(key: K, value: FargharSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  return (
    <FargharSettingsContext.Provider value={{ settings, updateSetting, resetToDefaults, storageUsage, refreshStorageUsage }}>
      {children}
    </FargharSettingsContext.Provider>
  );
};

export const useFargharSettings = () => useContext(FargharSettingsContext);
