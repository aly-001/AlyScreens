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

const Stack = createStackNavigator();

export default function App() {
  return (
    <APIKeyProvider>
      <SettingsProvider>
        <NavigationContainer>
          <BooksProvider>
            <AppNavigator />
          </BooksProvider>
        </NavigationContainer>
      </SettingsProvider>
    </APIKeyProvider>
  );
}

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
