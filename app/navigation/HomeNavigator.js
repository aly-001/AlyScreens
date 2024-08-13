import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import LibraryScreen from "../screens/home/LibraryScreen";
import SettingsNavigator from "./SettingsNavigator";
import DictionaryScreen from "../screens/home/DictionaryScreen";
const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Config" component={SettingsNavigator}/>
      <Stack.Screen name="Dictionary" component={DictionaryScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
