import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigator from "./app/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BooksProvider } from "./app/context/BooksContext";
import { FlashcardProvider } from "./app/context/FlashcardContext";
// import FlashcardTest from "./app/screens/FlashcardTest3";
import FlashcardTest from "./app/screens/FlashcardTest";
import { SettingsProvider } from "./app/context/useSettingsContext";
import LoadingText from "./app/components/LoadingText";
import { View } from "react-native";
import { APIKeyProvider } from "./app/context/APIKeyContext";
import FlashcardModuleBox from "./app/components/FlashcardModuleBox";
import { StatusBar } from "react-native";
import { TabBarVisibilityProvider } from "./app/navigation/TabBarVisibilityContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <TabBarVisibilityProvider>
      <APIKeyProvider>
        <StatusBar hidden={true} />

        <SettingsProvider>
          <NavigationContainer>
            <BooksProvider>
              <AppNavigator />
            </BooksProvider>
          </NavigationContainer>
        </SettingsProvider>
      </APIKeyProvider>
    </TabBarVisibilityProvider>
  );
}

// const text = `TThis approach is relatively simple to implement and doesn't require a backend.It provides a nice welcome experience for first-time users of your app. Remember to customize the welcome message and styling to fit your app's branding and purpose. You can also expand this to include multiple onboarding screens if you want to provide more information or guide users through initial setup steps. Is there anything specificyou'd like to add or modify in this welcome screen implementation?his approach is relatively simple to implement and doesn't require a backend.It provides a nice welcome experience for first-time users of your app. Remember to customize the welcome message and styling to fit your app's branding and purpose. You can also expand this to include multiple onboarding screens if you want to provide more information or guide users through initial setup steps. Is there anything specificyou'd like to add or modify in this welcome screen implementation?`
// export default function App() {
//   return (
//     <GestureHandlerRootView>

//     <FlashcardModuleBox text={text}/>
//     </GestureHandlerRootView>
//   );
// }

// export default function App() {
//   return(
//       <FlashcardProvider>
//     <FlashcardTest />
//     </FlashcardProvider>
//   )
// }

// export default function App() {
//   return (
//     <View style={{ justifyContent: "center", flex: 1, justifyContent: "center" }}>
//       <View>
//         <LoadingText text="Loading..." />
//       </View>
//     </View>
//   );
// }
