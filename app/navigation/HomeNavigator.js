import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreenTemp from '../screens/home/HomeScreenTemp';
import NativeLibrary from '../nativeReader/NativeLibrary';
import SettingsNavigator from './SettingsNavigator';
import DictionaryScreen from '../screens/home/DictionaryScreen';
import DonateScreen from '../screens/home/DonateScreen';
import HelpScreen from '../screens/home/HelpScreen'; // Import the HelpScreen

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreenTemp}
        options={{ title: 'Home', headerShown: false }} // No header for HomeScreen
      />
      <Stack.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{ title: 'Dictionary', headerShown: true, headerBackTitle: 'Home' }}
      />
      <Stack.Screen
        name="Library"
        component={NativeLibrary}
        options={{ 
          title: 'My Library', 
          headerShown: true, // Show header for Library
          headerBackTitle: 'Home' // Customize back button title
        }}
      />
      <Stack.Screen
        name="Donate"
        component={DonateScreen}
        options={{ 
          title: 'Donate', 
          headerShown: true, // Show header for Donate
          headerBackTitle: 'Home' // Customize back button title
        }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{ 
          title: 'Help', 
          headerShown: true, // Show header for Help
          headerBackTitle: 'Home' // Customize back button title
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;