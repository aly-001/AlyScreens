import React from "react";
import ReadScreen from "./app/screens/ReadScreen";
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App({}) {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
