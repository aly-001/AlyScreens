// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your components
import NativeLibrary from './NativeLibrary';
import Reader from './reader';

const Stack = createNativeStackNavigator();

function BookNavigator() {
  return (
      <Stack.Navigator initialRouteName="Library">
        <Stack.Screen
          name="Library"
          component={NativeLibrary}
          options={{ title: 'My Library' }}
        />
        <Stack.Screen
          name="Reader"
          component={Reader}
          options={{ title: 'Reader' }}
        />
      </Stack.Navigator>
  );
}

export default BookNavigator;