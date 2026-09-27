// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FargharSettings {
  autoSave: boolean;
  confirmDelete: boolean;
  storageUsage: number;
}

interface FargharSettingsContextType {
  settings: FargharSettings;
  setAutoSave: (value: boolean) => void;
  setConfirmDelete: (value: boolean) => void;
  refreshStorageUsage: () => void;
}

const FARGHAR_SETTINGS_KEY = 'farghar_settings';

const defaultSettings: FargharSettings = {
  autoSave: true,
  confirmDelete: true,
  storageUsage: 0,
};

const FargharSettingsContext = createContext<FargharSettingsContextType>({
  settings: defaultSettings,
  setAutoSave: () => {},
  setConfirmDelete: () => {},
  refreshStorageUsage: () => {},
});

// Calculate storage usage in bytes (UTF-16 estimation)
const calculateStorageUsage = (): number => {
  try {
    const data = localStorage.getItem('farghar_tag_editor_data');
    if (!data) return 0;
    return data.length * 2; // UTF-16 estimation
  } catch {
    return 0;
  }
};

export const FargharSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FargharSettings>(() => {
    try {
      const saved = localStorage.getItem(FARGHAR_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          autoSave: parsed.autoSave ?? true,
          confirmDelete: parsed.confirmDelete ?? true,
          storageUsage: calculateStorageUsage(),
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { ...defaultSettings, storageUsage: calculateStorageUsage() };
  });

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FARGHAR_SETTINGS_KEY, JSON.stringify({
        autoSave: settings.autoSave,
        confirmDelete: settings.confirmDelete,
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings.autoSave, settings.confirmDelete]);

  const setAutoSave = useCallback((value: boolean) => {
    setSettings(prev => ({ ...prev, autoSave: value }));
  }, []);

  const setConfirmDelete = useCallback((value: boolean) => {
    setSettings(prev => ({ ...prev, confirmDelete: value }));
  }, []);

  const refreshStorageUsage = useCallback(() => {
    setSettings(prev => ({ ...prev, storageUsage: calculateStorageUsage() }));
  }, []);

  return (
    <FargharSettingsContext.Provider value={{ settings, setAutoSave, setConfirmDelete, refreshStorageUsage }}>
      {children}
    </FargharSettingsContext.Provider>
  );
};

export const useFargharSettings = () => useContext(FargharSettingsContext);
