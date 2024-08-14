import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '../../config/colors';

const SettingsItem = ({ label, onPress, colors }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <Text style={[styles.settingsItemText, {color: colors.utilityGrey}]}>{label}</Text>
    <MaterialIcons name="chevron-right" size={24} color={colors.text} />
  </TouchableOpacity>
);

const SettingsGroup = ({ children }) => (
  <View style={styles.settingsGroup}>
    {children}
  </View>
);

const MainSettingsScreen = ({ navigation }) => {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, {backgroundColor: colors.homeScreenBackground}]}>
      
      <SettingsGroup>
        <SettingsItem 
          label="Configure AI Key" 
          onPress={() => navigation.navigate('LLM Key')} 
          colors={colors}
        />
      </SettingsGroup>
      
      <SettingsGroup>
        <SettingsItem 
          label="Translation Popup" 
          onPress={() => navigation.navigate('Translation Popup')}
          colors={colors}
        />
        <Divider />
        <SettingsItem 
          label="Flashcard Media" 
          onPress={() => navigation.navigate('Flashcard Media')} 
          colors={colors}
        />
      </SettingsGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  settingsGroup: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    height: 48,
  },
  settingsItemText: {
    fontSize: 16,
  },
});

export default MainSettingsScreen;