// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FargharStorageUsage {
  used: number;
  total: number;
  percent: number;
}

interface FargharSettingsContextType {
  autoSave: boolean;
  setAutoSave: (v: boolean) => void;
  confirmDelete: boolean;
  setConfirmDelete: (v: boolean) => void;
  storageUsage: FargharStorageUsage;
  refreshStorageUsage: () => void;
}

const SETTINGS_KEY = 'farghar_settings';
const DEFAULT_STORAGE_TOTAL = 5 * 1024 * 1024;

const FargharSettingsContext = createContext<FargharSettingsContextType>({
  autoSave: true,
  setAutoSave: () => {},
  confirmDelete: true,
  setConfirmDelete: () => {},
  storageUsage: { used: 0, total: DEFAULT_STORAGE_TOTAL, percent: 0 },
  refreshStorageUsage: () => {},
});

// Read settings from localStorage safely
function loadSettings(): { autoSave: boolean; confirmDelete: boolean } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        autoSave: typeof parsed.autoSave === 'boolean' ? parsed.autoSave : true,
        confirmDelete: typeof parsed.confirmDelete === 'boolean' ? parsed.confirmDelete : true,
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return { autoSave: true, confirmDelete: true };
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
  const initial = loadSettings();
  const [autoSave, setAutoSave] = useState<boolean>(initial.autoSave);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(initial.confirmDelete);
  const [storageUsage, setStorageUsage] = useState<FargharStorageUsage>(() => calculateStorageUsage());

  const refreshStorageUsage = useCallback(() => {
    setStorageUsage(calculateStorageUsage());
  }, []);

  // Persist settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ autoSave, confirmDelete }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [autoSave, confirmDelete]);

  return (
    <FargharSettingsContext.Provider value={{
      autoSave,
      setAutoSave,
      confirmDelete,
      setConfirmDelete,
      storageUsage,
      refreshStorageUsage,
    }}>
      {children}
    </FargharSettingsContext.Provider>
  );
};

export const useFargharSettings = () => useContext(FargharSettingsContext);
