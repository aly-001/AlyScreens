import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreenTemp from '../screens/home/HomeScreenTemp';
import NativeLibrary from '../nativeReader/NativeLibrary';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreenTemp}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Library"
        component={NativeLibrary}
        options={{ title: 'My Library' }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;