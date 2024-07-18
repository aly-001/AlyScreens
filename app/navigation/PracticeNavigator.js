// PracticeNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PracticeScreenStart from "../screens/PracticeScreenStart";
import PracticeScreenDef from "../screens/PracticeScreenDef";
import PracticeScreenWord from "../screens/PracticeScreenWord";
import { FlashcardProvider } from "../context/FlashcardContext";
const Stack = createStackNavigator();

const PracticeNavigator = () => {
  return (
    <FlashcardProvider>
      <Stack.Navigator
        initialRouteName="PracticeStart"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="PracticeStart" component={PracticeScreenStart} />
        <Stack.Screen name="Word" component={PracticeScreenWord} />
        <Stack.Screen name="Def" component={PracticeScreenDef} />
      </Stack.Navigator>
    </FlashcardProvider>
  );
};

export default PracticeNavigator;
