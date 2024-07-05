import React, { createContext, useState } from "react";

export const TabBarVisibilityContext = createContext();

export const TabBarVisibilityProvider = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};
