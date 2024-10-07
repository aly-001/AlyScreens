import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import Reader from '../nativeReader/reader';
import PracticeNavigator from './PracticeNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Optional: For tab icons

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        // Optional: Customize tab icons
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reader') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Practice') {
            iconName = focused ? 'hammer' : 'hammer-outline';
          }

          // Return the appropriate icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Reader" component={Reader} />
      <Tab.Screen name="Practice" component={PracticeNavigator} />
    </Tab.Navigator>
  );
}