import React from 'react';
import { View, StyleSheet } from 'react-native';
import APIKeyManagement from '../../components/settings/APIKeyManagement';
import { useThemeColors } from '../../config/colors';

const SettingsScreen = () => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.homeScreenBackground }]}>
      {/* Other settings options */}
      <APIKeyManagement />
      {/* More settings options */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;