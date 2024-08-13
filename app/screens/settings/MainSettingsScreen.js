import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../config/colors';

const SettingsItem = ({ label, onPress }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <Text style={styles.settingsItemText}>{label}</Text>
    <MaterialIcons name="chevron-right" size={24} color={colors.text} />
  </TouchableOpacity>
);

const SettingsGroup = ({ children }) => (
  <View style={styles.settingsGroup}>
    {children}
  </View>
);

const MainSettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <SettingsGroup>
        <SettingsItem 
          label="Configure AI Key" 
          onPress={() => navigation.navigate('LLM Key')} 
        />
      </SettingsGroup>
      
      <SettingsGroup>
        <SettingsItem 
          label="Translation Popup" 
          onPress={() => navigation.navigate('Translation Popup')} 
        />
        <Divider />
        <SettingsItem 
          label="Flashcard Media" 
          onPress={() => navigation.navigate('Flashcard Media')} 
        />
      </SettingsGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.homeScreenBackground,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 40,
    color: colors.text,
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
    color: colors.text,
  },
});

export default MainSettingsScreen;