import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LibraryScreen from "../screens/LibraryScreen";
import SettingsNavigator from "./SettingsNavigator";
import DictionaryScreen from "../screens/DictionaryScreen";
const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyHome" component={HomeScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Config" component={SettingsNavigator}/>
      <Stack.Screen name="Dictionary" component={DictionaryScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
