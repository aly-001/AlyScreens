   // app/navigation/AppNavigator.js
   import React from 'react';
   import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
   import HomeNavigator from './HomeNavigator';
   import Reader from '../nativeReader/Reader';
   import PracticeNavigator from './PracticeNavigator';
   import SettingsNavigator from './SettingsNavigator';
   import { useThemeColors } from '../config/colors';
   import CustomBar from '../components/misc/CustomBar';

   const Tab = createBottomTabNavigator();

   export default function AppNavigator() {
     const colors = useThemeColors();
     return (
       <Tab.Navigator
         initialRouteName="Home"
         tabBar={(props) => <CustomBar {...props} />} // Use custom tab bar
         screenOptions={{
           headerShown: false, // Disable navigation headers
         }}
       >
         <Tab.Screen name="Home" component={HomeNavigator} />
         <Tab.Screen name="Reader" component={Reader} />
         <Tab.Screen name="Practice" component={PracticeNavigator} />
         <Tab.Screen name="Settings" component={SettingsNavigator} />
       </Tab.Navigator>
     );
   }