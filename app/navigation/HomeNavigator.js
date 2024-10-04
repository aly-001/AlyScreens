import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import LibraryScreen from "../screens/home/LibraryScreen";
import SettingsNavigator from "./SettingsNavigator";
import DictionaryScreen from "../screens/home/DictionaryScreen";

import { useThemeColors } from "../config/colors";
import AIGenScreen from "../screens/home/AIGenScreen";
const Stack = createStackNavigator();

const ModalScreen = ({ children }) => {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <View style={[styles.modalContent, {backgroundColor: colors.homeScreenBackground}]}>
        {children}
      </View>
    </View>
  );
};

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Library">
        {(props) => (
          <ModalScreen>
            <LibraryScreen {...props} />
          </ModalScreen>
        )}
      </Stack.Screen>
      <Stack.Screen name="Config">
        {(props) => (
          <ModalScreen>
            <SettingsNavigator {...props} />
          </ModalScreen>
        )}
      </Stack.Screen>
      <Stack.Screen name="AIGen">
        {(props) => (
          <ModalScreen>
          <AIGenScreen/>
          </ModalScreen>
        )}
      </Stack.Screen>
      <Stack.Screen name="Dictionary">
        {(props) => (
          <ModalScreen>
            <DictionaryScreen {...props} />
          </ModalScreen>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default HomeNavigator;