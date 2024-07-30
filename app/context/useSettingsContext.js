import React, { createContext, useContext } from "react";
import useSettings from "../hooks/useSettings";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
