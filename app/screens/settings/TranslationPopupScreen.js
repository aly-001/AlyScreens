import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSettingsContext } from '../../context/useSettingsContext';
import SettingSwitch from '../../components/SettingsSwitch';
import { useThemeColors } from '../../config/colors';
import { Divider } from 'react-native-paper';
import PromptEditModal from '../../components/PromptEditModal';
import defaultPrompts from '../../config/defaultPrompts.json';

const TranslationPopupScreen = () => {
  const colors = useThemeColors();
  const { settings, updateSettings } = useSettingsContext();
  const [isGrammarModalVisible, setIsGrammarModalVisible] = useState(false);
  const [isModuleAModalVisible, setIsModuleAModalVisible] = useState(false);
  const [isModuleBModalVisible, setIsModuleBModalVisible] = useState(false);
  const [isTranslationModalVisible, setIsTranslationModalVisible] = useState(false);

  const toggleSetting = (setting) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  return (
    <View style={[styles.container,     {backgroundColor: colors.homeScreenBackground}]}>
      <View style={styles.group}>
        <SettingSwitch
          label="Translation"
          disabled={true}
          value={settings.translationPopupTranslation}
          onValueChange={() => toggleSetting('translationPopupTranslation')}
          onEdit={() => setIsTranslationModalVisible(true)}
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
          onEdit={() => setIsGrammarModalVisible(true)}
        />
        <Divider />
        <SettingSwitch
          label="Custom Module A"
          value={settings.translationPopupModuleA}
          onValueChange={() => toggleSetting('translationPopupModuleA')}
          onEdit={() => setIsModuleAModalVisible(true)}
        />
        <Divider />
        <SettingSwitch
          label="Custom Module B"
          value={settings.translationPopupModuleB}
          onValueChange={() => toggleSetting('translationPopupModuleB')}
          onEdit={() => setIsModuleBModalVisible(true)}
        />
      </View>
      
      <PromptEditModal
        isVisible={isGrammarModalVisible}
        onClose={() => setIsGrammarModalVisible(false)}
        promptType="grammarPrompt"
        initialPrompt={settings.grammarPrompt}
        greyPromptPart={'Give a grammar explanation of *word* in the context of *context*.'}
        onReset={() => updateSettings({ grammarPrompt: defaultPrompts.defaultGrammarPrompt })}
      />
     <PromptEditModal
        isVisible={isModuleAModalVisible}
        onClose={() => setIsModuleAModalVisible(false)}
        promptType="moduleAPrompt"
        initialPrompt={settings.moduleAPrompt}
        greyPromptPart={'Use *word* in the context of *context*.'}
        onReset={() => updateSettings({ moduleAPrompt: defaultPrompts.defaultModuleAPrompt })}
      /> 
      <PromptEditModal
        isVisible={isModuleBModalVisible}
        onClose={() => setIsModuleBModalVisible(false)}
        promptType="moduleBPrompt"
        initialPrompt={settings.moduleBPrompt}
        greyPromptPart={'Use *word* in the context of *context*.'}
        onReset={() => updateSettings({ moduleBPrompt: defaultPrompts.defaultModuleBPrompt })}
      />
      <PromptEditModal
        isVisible={isTranslationModalVisible}
        onClose={() => setIsTranslationModalVisible(false)}
        promptType="translationPrompt"
        initialPrompt={settings.translationPrompt}
        greyPromptPart={'Give a translation of *word* in the context of *context*.'}
        onReset={() => updateSettings({ translationPrompt: defaultPrompts.defaultTranslationPrompt })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
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