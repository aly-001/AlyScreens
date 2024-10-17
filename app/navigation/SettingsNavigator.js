import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Dimensions, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MainSettingsScreen from '../screens/settings/MainSettingsScreen';
import LLMKeyScreen from '../screens/settings/LLMKeyScreen';
import TranslationPopupScreen from '../screens/settings/TranslationPopupScreen';
import FlashcardMediaScreen from '../screens/settings/FlashcardMediaScreen';
import { Divider } from 'react-native-paper';
import { useThemeColors } from '../config/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AppearanceScreen from '../screens/settings/AppearanceScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DRAWER_WIDTH = 300; // Adjust as needed

const isTablet = () => {
  const { width } = Dimensions.get('window');
  return width >= 768;
};

const DrawerItem = ({ label, onPress, isSelected, colors }) => (

  <TouchableWithoutFeedback 
    style={[
      styles.drawerItem, 
      {backgroundColor: colors.mainComponentBackground},
      isSelected && {backgroundColor: colors.appleBlueShade}
    ]} 
    onPress={onPress}
  >
    <Text style={[
      styles.drawerItemText,
      {color: colors.utilityGrey},
      isSelected && styles.drawerItemTextSelected
    ]}>
      {label}
    </Text>
  </TouchableWithoutFeedback>
);

const CustomDrawerContent = (props) => {
  const currentRouteName = props.state.routeNames[props.state.index];
  const colors = useThemeColors();

  return (
    <DrawerContentScrollView {...props} style={[styles.drawerContent, {backgroundColor: colors.homeScreenBackground}]}>
      <View style={{alignSelf: "flex-start", marginLeft: 20}}>
        <View style={{marginBottom: 50}}>
          <Text style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: colors.utilityGreyLight}}>
            Settings
          </Text>
        </View>
      </View>
      
      <View style={styles.drawerGroup}>
        <DrawerItem
          label="Translation Popup"
          onPress={() => props.navigation.navigate('Translation Popup')}
          isSelected={currentRouteName === 'Translation Popup'}
          colors={colors}
        />
        <Divider />
        <DrawerItem
          label="Flashcard Media"
          onPress={() => props.navigation.navigate('Flashcard Media')}
          isSelected={currentRouteName === 'Flashcard Media'}
          colors={colors}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const TabletNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        width: DRAWER_WIDTH,
      },
      drawerType: 'permanent',
      headerShown: false,
      drawerPosition: 'left',
      swipeEnabled: false,
      overlayColor: 'transparent',
    }}
  >
    <Drawer.Screen name="Translation Popup" component={TranslationPopupScreen} />
    <Drawer.Screen name="Flashcard Media" component={FlashcardMediaScreen} />
    <Drawer.Screen name="Appearance" component={AppearanceScreen} />
  </Drawer.Navigator>
);

const PhoneNavigator = () => {
  const colors = useThemeColors();
  
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.homeScreenBackground },
        headerStyle: { backgroundColor: colors.homeScreenBackground },
        headerTintColor: colors.utilityGrey,
      }}
    >
      <Stack.Screen name="Settings" component={MainSettingsScreen} />
      <Stack.Screen name="LLM Key" component={LLMKeyScreen} />
      <Stack.Screen name="Translation Popup" component={TranslationPopupScreen} />
      <Stack.Screen name="Flashcard Media" component={FlashcardMediaScreen} />
      <Stack.Screen name="Appearance" component={AppearanceScreen} />
    </Stack.Navigator>
  );
};
const SettingsNavigator = () => {
  return isTablet() ? <TabletNavigator /> : <PhoneNavigator />;
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerGroup: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 45,
    borderRadius: 10,
    overflow: 'hidden',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 48,
    overflow: 'hidden',
  },
  drawerItemSelected: {
  },
  drawerItemText: {
    fontSize: 16,
  },
  drawerItemTextSelected: {
    color: 'white',
  },
  
});

export default SettingsNavigator;