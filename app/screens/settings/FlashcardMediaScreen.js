// FlashcardMediaScreen.js
import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useSettingsContext } from '../../context/useSettingsContext';
import SettingSwitch from '../../components/SettingsSwitch';

const FlashcardMediaScreen = () => {
  const { settings, updateSettings } = useSettingsContext();

  const toggleSetting = (setting) => {
    let newSettings = { [setting]: !settings[setting] };

    const contextSettings = {
      flashcardsFrontContext: ['flashcardsFrontContextTranslation'],
      flashcardsBackContext: ['flashcardsBackContextTranslation'],
    };

    Object.entries(contextSettings).forEach(([context, dependents]) => {
      if (setting === context && !newSettings[setting]) {
        dependents.forEach(dependent => newSettings[dependent] = false);
      }
      if (dependents.includes(setting) && newSettings[setting]) {
        newSettings[context] = true;
      }
    });

    updateSettings(newSettings);
  };

  const renderSwitch = (label, setting) => (
    <SettingSwitch
      key={setting}
      label={label}
      value={settings[setting]}
      onValueChange={() => toggleSetting(setting)}
      disabled={!settings.flashcardsEnabled}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <SettingSwitch
        label="Enable Flashcards"
        value={settings.flashcardsEnabled}
        onValueChange={() => toggleSetting('flashcardsEnabled')}
      />
      
      <Text style={styles.sectionTitle}>Front</Text>
      {renderSwitch("Word", "flashcardsFrontWord")}
      {renderSwitch("Context", "flashcardsFrontContext")}
      {renderSwitch("Grammar", "flashcardsFrontGrammar")}
      
      <Text style={styles.sectionTitle}>Back</Text>
      {renderSwitch("Word", "flashcardsBackWord")}
      {renderSwitch("Word Translation", "flashcardsBackWordTranslation")}
      {renderSwitch("Context", "flashcardsBackContext")}
      {renderSwitch("Context Translation", "flashcardsBackContextTranslation")}
      {renderSwitch("Audio", "flashcardsBackAudio")}
      {renderSwitch("Context Audio", "flashcardsBackContextAudio")}
      {renderSwitch("Image", "flashcardsBackImage")}
      {renderSwitch("Grammar", "flashcardsBackGrammar")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default FlashcardMediaScreen;