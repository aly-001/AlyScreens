   // app/components/CustomTabBar.js

   import React from 'react';
   import { View, TouchableOpacity, StyleSheet } from 'react-native';
   import Ionicons from 'react-native-vector-icons/Ionicons';
   import { useThemeColors } from '../config/colors';

   const CustomTabBar = ({ state, descriptors, navigation }) => {
     const colors = useThemeColors();

     return (
       <View style={styles.container}>
         {state.routes.map((route, index) => {
           const { options } = descriptors[route.key];
           const label =
             options.tabBarLabel !== undefined
               ? options.tabBarLabel
               : options.title !== undefined
               ? options.title
               : route.name;

           const isFocused = state.index === index;

           const onPress = () => {
             const event = navigation.emit({
               type: 'tabPress',
               target: route.key,
               canPreventDefault: true,
             });

             if (!isFocused && !event.defaultPrevented) {
               navigation.navigate(route.name);
             }
           };

           const onLongPress = () => {
             navigation.emit({
               type: 'tabLongPress',
               target: route.key,
             });
           };

           // Define icon names based on route name
           let iconName;
           if (route.name === 'Home') {
             iconName = isFocused ? 'home' : 'home-outline';
           } else if (route.name === 'Reader') {
             iconName = isFocused ? 'book' : 'book-outline';
           } else if (route.name === 'Practice') {
             iconName = isFocused ? 'hammer' : 'hammer-outline';
           } else if (route.name === 'Settings') {
             iconName = isFocused ? 'settings' : 'settings-outline';
           }

           return (
             <TouchableOpacity
               accessibilityRole="button"
               accessibilityState={isFocused ? { selected: true } : {}}
               accessibilityLabel={options.tabBarAccessibilityLabel}
               testID={options.tabBarTestID}
               onPress={onPress}
               onLongPress={onLongPress}
               style={styles.tabButton}
               key={route.name}
             >
               <View
                 style={[
                   styles.iconContainer,
                   { backgroundColor: 'rgba(255, 255, 255, 1)' },
                 ]}
               >
                 <Ionicons name={iconName} size={24} color={isFocused ? colors.highlightColor : 'gray'} />
               </View>
             </TouchableOpacity>
           );
         })}
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: {
       flexDirection: 'row',
       justifyContent: 'space-around',
       alignItems: 'center',
       bottom: 12,
       position: 'absolute',
       alignSelf: 'center',

       // make the width 100% minus 20 pixels on each side
       width: '93%',
       height: 100,
       backgroundColor: 'rgba(245, 245, 245, 1)',
       borderRadius: 57,
     },
     tabButton: {
       flex: 1,
       alignItems: 'center',
     },
     iconContainer: {
       width: 65,
       height: 65,
       borderRadius: 57,
       justifyContent: 'center',
       alignItems: 'center',
     },
   });

   export default CustomTabBar;