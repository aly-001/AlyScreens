import React, { createContext, useState } from 'react';

export const ReadingContext = createContext();

export const ReadingProvider = ({ children }) => {
  const [bookDirName, setBookDirName] = useState(null);

  return (
    <ReadingContext.Provider value={{ bookDirName, setBookDirName }}>
      {children}
    </ReadingContext.Provider>
  );
};