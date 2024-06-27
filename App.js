import React from "react";
import PracticeScreenDef from "./app/screens/PracticeScreenDef";
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App({}) {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
