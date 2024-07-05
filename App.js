import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MyLibraryScreen from "./app/screens/MyLibraryScreen";
import ReadScreen from "./app/screens/ReadScreen"; // Assuming you have this component
import AppNavigator from "./app/navigation/AppNavigator";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <AppNavigator/>
    </NavigationContainer>
  );
}