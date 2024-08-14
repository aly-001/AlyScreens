import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import LibraryScreen from "../screens/home/LibraryScreen";
import SettingsNavigator from "./SettingsNavigator";
import DictionaryScreen from "../screens/home/DictionaryScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const ModalScreen = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
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
    backgroundColor: colors.homeScreenBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.utilityGreyLight,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default HomeNavigator;