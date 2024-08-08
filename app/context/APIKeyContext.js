// APIKeyContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { APIKeyManager } from '../services/APIKeyManager';

const APIKeyContext = createContext();

export const APIKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    // Load the API key when the app starts
    loadAPIKey();
  }, []);

  const loadAPIKey = async () => {
    const storedKey = await APIKeyManager.getAPIKey();
    setApiKey(storedKey);
  };

  const updateAPIKey = async (newKey) => {
    const success = await APIKeyManager.saveAPIKey(newKey);
    if (success) {
      setApiKey(newKey);
    }
    return success;
  };

  const removeAPIKey = async () => {
    const success = await APIKeyManager.deleteAPIKey();
    if (success) {
      setApiKey(null);
    }
    return success;
  };

  return (
    <APIKeyContext.Provider value={{ apiKey, updateAPIKey, removeAPIKey }}>
      {children}
    </APIKeyContext.Provider>
  );
};

export const useAPIKey = () => useContext(APIKeyContext);
