import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigator from "./app/navigation/AppNavigator";
import { BooksProvider } from "./app/context/BooksContext";
import { SettingsProvider } from "./app/context/useSettingsContext";
import { APIKeyProvider } from "./app/context/APIKeyContext";
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