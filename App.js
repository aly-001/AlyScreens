import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import WelcomeScreen from "./app/screens/welcome/WelcomeScreen";
import { SettingsProvider } from "./app/context/useSettingsContext";
import { APIKeyProvider } from "./app/context/APIKeyContext";
import { TabBarVisibilityProvider } from "./app/navigation/TabBarVisibilityContext";
import { FlashcardProvider } from "./app/context/FlashcardContext";
import AppNavigator from "./app/navigation/AppNavigator";
import * as Font from "expo-font";
import { ReadingProvider } from "./app/context/ReadingContext";

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

const MainApp = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem(
          "hasLaunchedBefore"
        );
        if (hasLaunchedBefore === null) {
          await AsyncStorage.setItem("hasLaunchedBefore", "true");
          setShowWelcome(true);
        } else {
          setShowWelcome(false);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleStart = () => {
    setShowWelcome(false);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {showWelcome ? (
          <WelcomeScreen onClickStart={handleStart} />
        ) : (
          <AppNavigator />
        )}
      </NavigationContainer>
    </View>
  );
};

// AsyncStorage.removeItem("hasLaunchedBefore");

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      Lora: require("./assets/fonts/lora-standard.ttf"),
      LibreBaskerville: require("./assets/fonts/libre-baskerville.ttf"),
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
            <ReadingProvider>
              <StatusBar hidden={true} />
              <MainApp />
            </ReadingProvider>
          </FlashcardProvider>
        </SettingsProvider>
      </TabBarVisibilityProvider>
    </APIKeyProvider>
  );
}

// export default function App() {
//   return (
//     <SettingsProvider>

//     <WelcomeScreen /> 
//     </SettingsProvider>
//   )
// }
