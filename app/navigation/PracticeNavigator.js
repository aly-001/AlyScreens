import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TransitionPresets } from "@react-navigation/stack";
import PracticeScreenStart from "../screens/practice/PracticeScreenStart";  
import PracticeScreenDef from "../screens/practice/PracticeScreenDef";
import PracticeScreenWord from "../screens/practice/PracticeScreenWord";
import { FlashcardProvider } from "../context/FlashcardContext";

const Stack = createStackNavigator();

const PracticeNavigator = () => {
  return (
    <FlashcardProvider>
      <Stack.Navigator
        initialRouteName="PracticeStart"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          ...TransitionPresets.SlideFromLeftIOS,
        }}
      >
        <Stack.Screen
          name="PracticeStart"
          component={PracticeScreenStart}
        />
        <Stack.Screen
          name="Def"
          component={PracticeScreenDef}
        />
        <Stack.Screen
          name="Word"
          component={PracticeScreenWord}
        />
      </Stack.Navigator>
    </FlashcardProvider>
  );
};

export default PracticeNavigator;