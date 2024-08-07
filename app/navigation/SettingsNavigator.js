import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Dimensions, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainSettingsScreen from '../screens/settings/MainSettingsScreen';
import LLMKeyScreen from '../screens/settings/LLMKeyScreen';
import TranslationPopupScreen from '../screens/settings/TranslationPopupScreen';
import FlashcardMediaScreen from '../screens/settings/FlashcardMediaScreen';
import PromptEngineeringScreen from '../screens/settings/PromptEngineeringScreen';
import { Divider } from 'react-native-paper';
import ScreenHeader from '../components/ScreenHeader';
import colors from '../config/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DRAWER_WIDTH = 300; // Adjust as needed

const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  return Math.max(width, height) >= 768;
};

const DrawerItem = ({ label, onPress, isSelected }) => (
  <TouchableWithoutFeedback 
    style={[
      styles.drawerItem, 
      isSelected && styles.drawerItemSelected
    ]} 
    onPress={onPress}
  >
    <Text style={[
      styles.drawerItemText,
      isSelected && styles.drawerItemTextSelected
    ]}>
      {label}
    </Text>
  </TouchableWithoutFeedback>
);

const CustomDrawerContent = (props) => {
  const currentRouteName = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={{alignSelf: "flex-start", marginLeft: 20}}>
        <View style={{marginBottom: 50}}>
          <Text style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginVertical: 20}}>
            Settings
          </Text>
        </View>
      </View>
      <View style={styles.drawerGroup}>
        <DrawerItem
          label="LLM Key"
          onPress={() => props.navigation.navigate('LLM Key')}
          isSelected={currentRouteName === 'LLM Key'}
        />
      </View>
      
      <View style={styles.drawerGroup}>
        <DrawerItem
          label="Translation Popup"
          onPress={() => props.navigation.navigate('Translation Popup')}
          isSelected={currentRouteName === 'Translation Popup'}
        />
        <Divider />
        <DrawerItem
          label="Flashcard Media"
          onPress={() => props.navigation.navigate('Flashcard Media')}
          isSelected={currentRouteName === 'Flashcard Media'}
        />
        <Divider />
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
    <Drawer.Screen name="LLM Key" component={LLMKeyScreen} />
    <Drawer.Screen name="Translation Popup" component={TranslationPopupScreen} />
    <Drawer.Screen name="Flashcard Media" component={FlashcardMediaScreen} />
  </Drawer.Navigator>
);

const PhoneNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={MainSettingsScreen} />
    <Stack.Screen name="LLM Key" component={LLMKeyScreen} />
    <Stack.Screen name="Translation Popup" component={TranslationPopupScreen} />
    <Stack.Screen name="Flashcard Media" component={FlashcardMediaScreen} />
  </Stack.Navigator>
);

const SettingsNavigator = () => {
  return isTablet() ? <TabletNavigator /> : <PhoneNavigator />;
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
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
    backgroundColor: colors.appleBlueShade,
  },
  drawerItemText: {
    fontSize: 16,
  },
  drawerItemTextSelected: {
    color: 'white',
  },
  
});

export default SettingsNavigator;