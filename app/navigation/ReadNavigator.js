import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReadScreen from '../screens/read/ReadScreen';
import HomeScreen from '../screens/home/HomeScreen';

const ReadStack = createStackNavigator();

const ReadNavigator = () => (
  <ReadStack.Navigator screenOptions={{ headerShown: false }}>
    <ReadStack.Screen name="ReadScreen" component={ReadScreen} />
    <ReadStack.Screen name="ReadHome" component={HomeScreen} />
  </ReadStack.Navigator>
);

export default ReadNavigator;