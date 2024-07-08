import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import PracticeScreenStart from "../screens/PracticeScreenStart";
import colors from "../config/colors";
import { TabBarVisibilityProvider, TabBarVisibilityContext } from "./TabBarVisibilityContext";
import HomeNavigator from "./HomeNavigator";
import ReadNavigator from "./ReadNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <TabBarVisibilityProvider>
      <TabBarVisibilityContext.Consumer>
        {({ isTabBarVisible }) => (
          <View style={styles.container}>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: isTabBarVisible ? styles.tabBar : { display: 'none' },
                tabBarBackground: () => (
                  <View style={styles.tabBarBackground} />
                ),
                tabBarItemStyle: styles.tabBarItem,
                tabBarShowLabel: false,
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons 
                        name="home" 
                        color={focused ? colors.utilityGrey : colors.inactiveGrey} 
                        size={30} 
                      />
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="Read"
                component={ReadNavigator}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                      <FontAwesome6 
                        name="book-open" 
                        color={focused ? colors.utilityGrey : colors.inactiveGrey} 
                        size={25} 
                      />
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="Practice"
                component={PracticeScreenStart}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons 
                        name="pencil" 
                        color={focused ? colors.utilityGrey : colors.inactiveGrey} 
                        size={30} 
                      />
                    </View>
                  ),
                }}
              />
            </Tab.Navigator>
          </View>
        )}
      </TabBarVisibilityContext.Consumer>
    </TabBarVisibilityProvider>
  );
};


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
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;