import React, { createContext, useState, useContext } from 'react';

const DefinitionContext = createContext();

export const DefinitionProvider = ({ children }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentDefinition, setCurrentDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleWebViewMessageDefinition = (message) => {
    if (message.type === 'definition') {
      setCurrentWord(message.word);
      setIsLoading(true);
      setPopupVisible(true);
      // Simulating API call to get definition
      setTimeout(() => {
        setCurrentDefinition(`Definition for ${message.word}`);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setCurrentWord('');
    setCurrentDefinition('');
    setAdded(false);
    setStarted(false);
    setFinished(false);
  };

  const handleToggleCheck = () => {
    setAdded(!added);
    setStarted(true);
    setTimeout(() => {
      setFinished(true);
    }, 400); // Adjust this timing as needed
  };

  return (
    <DefinitionContext.Provider
      value={{
        popupVisible,
        currentWord,
        currentDefinition,
        isLoading,
        added,
        started,
        finished,
        handleWebViewMessageDefinition,
        handleClosePopup,
        handleToggleCheck,
      }}
    >
      {children}
    </DefinitionContext.Provider>
  );
};

export const useDefinition = () => {
  const context = useContext(DefinitionContext);
  if (context === undefined) {
    throw new Error('useDefinition must be used within a DefinitionProvider');
  }
  return context;
};