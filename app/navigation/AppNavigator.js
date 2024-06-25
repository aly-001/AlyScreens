import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ReadScreen from "../screens/ReadScreen";
import PracticeScreen from "../screens/PracticeScreen";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <View style={styles.container}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground} />
        ),
        tabBarItemStyle: styles.tabBarItem,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="home" color={colors.utilityGrey} size={30} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Read"
        component={ReadScreen}
        options={({ route }) => ({
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="book-open" color={colors.utilityGrey} size={30} />
            </View>
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
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="pencil" color={colors.utilityGrey} size={30} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 100,
    flex: 1,
    backgroundColor: "pink",
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    height: 80,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderTopWidth: 0,
    borderTopColor: "#e0e0e0",
  },
  tabBarItem: {
    height: 80,
    paddingBottom: 10,
  },
  iconContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;