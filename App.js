import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import WelcomeScreen from "./app/screens/welcome/WelcomeScreen";
import AppNavigator from "./app/navigation/AppNavigator";
import { BooksProvider } from "./app/context/BooksContext";
import { SettingsProvider } from "./app/context/useSettingsContext";
import { APIKeyProvider, useAPIKey } from "./app/context/APIKeyContext";
import { TabBarVisibilityProvider } from "./app/navigation/TabBarVisibilityContext";
import Toggle from "./app/components/Toggle";
import Reader from "./app/nativeReader/Reader";

// // Keep the splash screen visible while we fetch the resources
// SplashScreen.preventAutoHideAsync();

// const MainApp = () => {
//   const { apiKey } = useAPIKey();
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(false);

//   useEffect(() => {
//     async function prepare() {
//       try {
//         // Pre-load fonts, make any API calls you need to do here
//         const hasLaunchedBefore = await AsyncStorage.getItem(
//           "hasLaunchedBefore"
//         );
//         if (hasLaunchedBefore === null) {
//           await AsyncStorage.setItem("hasLaunchedBefore", "true");
//           setShowWelcome(true);
//         } else {
//           setShowWelcome(!apiKey);
//         }
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         // Tell the application to render
//         setAppIsReady(true);
//       }
//     }

//     prepare();
//   }, [apiKey]);

//   // AsyncStorage.removeItem('hasLaunchedBefore');

//   const onLayoutRootView = useCallback(async () => {
//     if (appIsReady) {
//       // This tells the splash screen to hide immediately
//       await SplashScreen.hideAsync();
//     }
//   }, [appIsReady]);

//   if (!appIsReady) {
//     return null;
//   }

//   return (
//     <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
//       <NavigationContainer>
//         {showWelcome ? (
//           <WelcomeScreen onApiKeySet={() => setShowWelcome(false)} />
//         ) : (
//           <AppNavigator />
//         )}
//       </NavigationContainer>
//     </View>
//   );
// };

// export default function App() {
//   return (
//     <APIKeyProvider>
//       <TabBarVisibilityProvider>
//         <StatusBar hidden={true} />
//         <SettingsProvider>
//           <BooksProvider>
//             <MainApp />
//           </BooksProvider>
//         </SettingsProvider>
//       </TabBarVisibilityProvider>
//     </APIKeyProvider>
//   );
// }

export default function App() {
  return (
    <View
      style={{flex: 1 }}
    >
      <Reader />
    </View>
  );
}
