import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  currency: 'USD',
  dateFormat: 'MMM dd, yyyy',
  compactNumbers: false,
  showNotifications: true,
  defaultRole: 'admin',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('aureus_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const updateSettings = (partial) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    localStorage.setItem('aureus_settings', JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
