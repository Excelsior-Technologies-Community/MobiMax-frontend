import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [globalSettings, setGlobalSettings] = useState({
    maintenance_mode: 'false',
    support_email: 'support@mobimax.com',
    popup_enabled: 'true',
    popup_delay: '1000',
    popup_frequency: 'session',
    ad_duration: '5000'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/public/settings');
        const json = await res.json();
        if (json.status === 'success') {
          setGlobalSettings(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch global settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ globalSettings, loadingSettings: loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
