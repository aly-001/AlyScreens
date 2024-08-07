import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';

import MainSettingsScreen from '../screens/settings/MainSettingsScreen';
import LLMKeyScreen from '../screens/settings/LLMKeyScreen';
import TranslationPopupScreen from '../screens/settings/TranslationPopupScreen';
import FlashcardMediaScreen from '../screens/settings/FlashcardMediaScreen';
import PromptEngineeringScreen from '../screens/settings/PromptEngineeringScreen';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  return Math.max(width, height) >= 768;
};

const TabletNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="LLM Key" component={LLMKeyScreen} />
    <Drawer.Screen name="Translation Popup" component={TranslationPopupScreen} />
    <Drawer.Screen name="Flashcard Media" component={FlashcardMediaScreen} />
    <Drawer.Screen name="Prompt Engineering" component={PromptEngineeringScreen} />
  </Drawer.Navigator>
);

const PhoneNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={MainSettingsScreen} />
    <Stack.Screen name="LLM Key" component={LLMKeyScreen} />
    <Stack.Screen name="Translation Popup" component={TranslationPopupScreen} />
    <Stack.Screen name="Flashcard Media" component={FlashcardMediaScreen} />
    <Stack.Screen name="Prompt Engineering" component={PromptEngineeringScreen} />
  </Stack.Navigator>
);

const SettingsNavigator = () => {
  return isTablet() ? <TabletNavigator /> : <PhoneNavigator />;
};

export default SettingsNavigator;