import React from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import colors from "../config/colors";
import { TabBarVisibilityProvider, useTabBarVisibility } from "./TabBarVisibilityContext";
import HomeNavigator from "./HomeNavigator";
import ReadNavigator from "./ReadNavigator";
import PracticeNavigator from "./PracticeNavigator";

const Tab = createBottomTabNavigator();

const TabBar = ({ state, descriptors, navigation }) => {
  const { tabBarOpacity } = useTabBarVisibility();

  return (
    <Animated.View style={[styles.tabBar, { opacity: tabBarOpacity }]}>
      <View style={styles.tabBarBackground} />
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabBarItem}
            >
              {options.tabBarIcon({ focused: isFocused, color: '', size: 0 })}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const AppNavigator = () => {
  return (
    <TabBarVisibilityProvider>
      <View style={styles.container}>
        <Tab.Navigator
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="HomeScreen"
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
            component={PracticeNavigator}
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
    </TabBarVisibilityProvider>
  );
};

const styles = StyleSheet.create({
  container: {
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
    height: 78,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;