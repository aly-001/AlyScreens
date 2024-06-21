import React, { createContext, useState, useContext } from 'react';

const CheckStateContext = createContext();

export const useCheckState = () => useContext(CheckStateContext);

export const CheckStateProvider = ({ children }) => {
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);

  const resetCheckState = () => {
    setChecked(false);
    setFinished(false);
  };

  return (
    <CheckStateContext.Provider value={{ checked, setChecked, finished, setFinished, resetCheckState }}>
      {children}
    </CheckStateContext.Provider>
  );
};
