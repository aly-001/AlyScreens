import React from 'react';
import { View } from 'react-native';
import APIKeyManagement from '../../components/APIKeyManagement';

const SettingsScreen = () => {
  return (
    <View>
      {/* Other settings options */}
      <APIKeyManagement />
      {/* More settings options */}
    </View>
  );
};

export default SettingsScreen;