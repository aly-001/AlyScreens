import React, { useState, useEffect, useCallback, Dimensions, StyleSheet } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import WelcomeScreen from "./app/screens/welcome/WelcomeScreen";
import { SettingsProvider } from "./app/context/useSettingsContext";
import { APIKeyProvider, useAPIKey } from "./app/context/APIKeyContext";
import { TabBarVisibilityProvider } from "./app/navigation/TabBarVisibilityContext";
import { FlashcardProvider } from "./app/context/FlashcardContext";
import AppNavigator from "./app/navigation/AppNavigator";
import * as Font from 'expo-font';
// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

const MainApp = () => {
  const { apiKey } = useAPIKey();
  const [appIsReady, setAppIsReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem("hasLaunchedBefore");
        if (hasLaunchedBefore === null) {
          await AsyncStorage.setItem("hasLaunchedBefore", "true");
          setShowWelcome(true);
        } else {
          setShowWelcome(!apiKey);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [apiKey]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  // AsyncStorage.removeItem("hasLaunchedBefore");

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {showWelcome ? (
          <WelcomeScreen onApiKeySet={() => setShowWelcome(false)} />
        ) : (
          <AppNavigator />
        )}
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Lora': require('./assets/fonts/lora-standard.ttf'),
      // Add other fonts here
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading component
  }
  return (
    <APIKeyProvider>
      <TabBarVisibilityProvider>
        <SettingsProvider>
          <FlashcardProvider>
            <StatusBar hidden={true} />
            <MainApp />
          </FlashcardProvider>
        </SettingsProvider>
      </TabBarVisibilityProvider>
    </APIKeyProvider>
  );
}