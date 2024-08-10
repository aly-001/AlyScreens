import React, { createContext, useState, useContext } from 'react';
import { Animated } from 'react-native';

const TabBarVisibilityContext = createContext();

export const TabBarVisibilityProvider = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const tabBarOpacity = new Animated.Value(1);

  const setTabBarVisible = (visible) => {
    setIsTabBarVisible(visible);
    Animated.timing(tabBarOpacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setTabBarVisible, tabBarOpacity }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);

export { TabBarVisibilityContext };