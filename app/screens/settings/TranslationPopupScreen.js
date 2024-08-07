import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSettingsContext } from '../../context/useSettingsContext';
import SettingSwitch from '../../components/SettingsSwitch';
import colors from '../../config/colors';
import { Divider } from 'react-native-paper';

const TranslationPopupScreen = () => {
  const { settings, updateSettings } = useSettingsContext();

  const toggleSetting = (setting) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.group}>
      <SettingSwitch
        label="Translation"
        disabled={true}
        value={settings.translationPopupTranslation}
        onValueChange={() => toggleSetting('translationPopupTranslation')}
      />
      <Divider />
      <SettingSwitch
        label="Audio"
        value={settings.translationPopupAudio}
        onValueChange={() => toggleSetting('translationPopupAudio')}
      />
      <Divider />
      <SettingSwitch
        label="Grammar"
        value={settings.translationPopupGrammar}
        onValueChange={() => toggleSetting('translationPopupGrammar')}
      />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: colors.homeScreenBackground,
    flex: 1,
  },
  group: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 45,
    borderRadius: 10,
  },
});

export default TranslationPopupScreen;
