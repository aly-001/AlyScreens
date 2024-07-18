import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigator from "./app/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BooksProvider } from "./app/context/BooksContext";
import { FlashcardProvider } from "./app/context/FlashcardContext";
// import FlashcardTest from "./app/screens/FlashcardTest3";
import FlashcardTest from "./app/screens/FlashcardTest";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <BooksProvider>
        <AppNavigator />
      </BooksProvider>
    </NavigationContainer>
  );
}

// export default function App() {
//   return(
//       <FlashcardProvider>
//     <FlashcardTest />
//     </FlashcardProvider>
//   )
// }