import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ReadScreen from "../screens/ReadScreen";
import PracticeScreen from "../screens/PracticeScreen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarBackground: () => (
        <View style={styles.tabBarBackground} />
      ),
      tabBarItemStyle: styles.tabBarItem,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Read"
      component={ReadScreen}
      options={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="book-open" color={color} size={size} />
        ),
        tabBarStyle: route.params?.hideTabBar 
          ? { display: 'none' } 
          : styles.tabBar,
      })}
    />
    <Tab.Screen
      name="Practice"
      component={PracticeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="pencil" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    height: 80, // Increased height
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1.0)', // semi-transparent white
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarItem: {
    height: 80, // Match the tabBar height
    paddingBottom: 10, // Add some padding at the bottom for better touch area
  },
});

export default AppNavigator;