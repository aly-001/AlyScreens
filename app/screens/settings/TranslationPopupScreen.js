import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSettingsContext } from '../../context/useSettingsContext';
import SettingSwitch from '../../components/SettingsSwitch';

const TranslationPopupScreen = () => {
  const { settings, updateSettings } = useSettingsContext();

  const toggleSetting = (setting) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  return (
    <View style={styles.container}>
      <SettingSwitch
        label="Translation"
        value={settings.translationPopupTranslation}
        onValueChange={() => toggleSetting('translationPopupTranslation')}
      />
      <SettingSwitch
        label="Audio"
        value={settings.translationPopupAudio}
        onValueChange={() => toggleSetting('translationPopupAudio')}
      />
      <SettingSwitch
        label="Grammar"
        value={settings.translationPopupGrammar}
        onValueChange={() => toggleSetting('translationPopupGrammar')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TranslationPopupScreen;
