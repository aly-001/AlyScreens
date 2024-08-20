import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import SettingSwitch from "../../components/SettingsSwitch";
import { useThemeColors } from "../../config/colors";
import { Divider } from "react-native-paper";
import PromptEditModal from "../../components/PromptEditModal";
import defaultPrompts from "../../config/defaultPrompts.json";

const FlashcardMediaScreen = () => {
  const colors = useThemeColors();
  const { settings, updateSettings } = useSettingsContext();
  const [isGrammarModalVisible, setIsGrammarModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isModuleAModalVisible, setIsModuleAModalVisible] = useState(false);
  const [isModuleBModalVisible, setIsModuleBModalVisible] = useState(false);

  const toggleSetting = (setting) => {
    let newSettings = { [setting]: !settings[setting] };
    const contextSettings = {
      flashcardsFrontContext: ["flashcardsFrontContextTranslation"],
      flashcardsBackContext: ["flashcardsBackContextTranslation"],
    };
    Object.entries(contextSettings).forEach(([context, dependents]) => {
      if (setting === context && !newSettings[setting]) {
        dependents.forEach((dependent) => (newSettings[dependent] = false));
      }
      if (dependents.includes(setting) && newSettings[setting]) {
        newSettings[context] = true;
      }
    });
    updateSettings(newSettings);
  };

  const renderSwitch = (label, setting, onEdit = null) => (
    <SettingSwitch
      key={setting}
      label={label}
      value={settings[setting]}
      onValueChange={() => toggleSetting(setting)}
      disabled={!settings.flashcardsEnabled || label === "Word" || label === "Word Translation"}
      onEdit={onEdit}
    />
  );

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.homeScreenBackground}]}>
      <View style={[styles.group, {backgroundColor: colors.mainComponentBackground}]}>
        <SettingSwitch
          label="Enable Flashcards"
          value={settings.flashcardsEnabled}
          onValueChange={() => toggleSetting("flashcardsEnabled")}
        />
      </View>
      <View style={[styles.group, {marginTop: 30, backgroundColor: colors.mainComponentBackground}]}>
        <View style={styles.description}>
          <Text style={[styles.descriptionText, {color: colors.utilityGrey}]}>FRONT</Text>
        </View>
        {renderSwitch("Word", "flashcardsFrontWord")}
        <Divider />
        {renderSwitch("Context", "flashcardsFrontContext")}
        <Divider />
        {renderSwitch("Grammar", "flashcardsFrontGrammar", () => setIsGrammarModalVisible(true))}
        <Divider />
        {renderSwitch("Custom Module A", "flashcardsFrontModuleA", () => setIsModuleAModalVisible(true))}
        <Divider />
        {renderSwitch("Custom Module B", "flashcardsFrontModuleB", () => setIsModuleBModalVisible(true))}
        
      </View>
      <View style={[styles.group, {marginTop: 15, marginBottom: 50, backgroundColor: colors.mainComponentBackground}]}>
        <View style={styles.description}>
          <Text style={[styles.descriptionText, {color: colors.utilityGrey}]}>BACK</Text>
        </View>
        {renderSwitch("Word", "flashcardsBackWord")}
        <Divider />
        {renderSwitch("Word Translation", "flashcardsBackWordTranslation")}
        <Divider />
        {renderSwitch("Context", "flashcardsBackContext")}
        <Divider />
        {renderSwitch("Context Translation", "flashcardsBackContextTranslation")}
        <Divider />
        {renderSwitch("Audio", "flashcardsBackAudio")}
        <Divider />
        {renderSwitch("Context Audio", "flashcardsBackContextAudio")}
        <Divider />
        {renderSwitch("Image", "flashcardsBackImage", () => setIsImageModalVisible(true))}
        <Divider />
        {renderSwitch("Grammar", "flashcardsBackGrammar", () => setIsGrammarModalVisible(true))}
        <Divider/>
        {renderSwitch("Custom Module A", "flashcardsBackModuleA", () => setIsModuleAModalVisible(true))}
        <Divider/>
        {renderSwitch("Custom Module B", "flashcardsBackModuleB", () => setIsModuleBModalVisible(true))}
      </View>

      <PromptEditModal
        isVisible={isGrammarModalVisible}
        onClose={() => setIsGrammarModalVisible(false)}
        promptType="grammarPrompt"
        initialPrompt={settings.grammarPrompt}
        greyPromptPart={"Give a grammar explanation of *word* in the context of *context*."}
        onReset={() => updateSettings({ grammarPrompt: defaultPrompts.defaultGrammarPrompt })}
      />
      <PromptEditModal
        isVisible={isImageModalVisible}
        onClose={() => setIsImageModalVisible(false)}
        promptType="imagePrompt"
        initialPrompt={settings.imagePrompt}
        greyPromptPart={"Make a picture of *word* in the context of *context*. Do it in this style:"}
        onReset={() => updateSettings({ imagePrompt: defaultPrompts.defaultImagePrompt })}
      />
      <PromptEditModal
        isVisible={isModuleAModalVisible}
        onClose={() => setIsModuleAModalVisible(false)}
        promptType="moduleAPrompt"
        initialPrompt={settings.moduleAPrompt}
        greyPromptPart={"Use *word* in the context of *context*."}
        onReset={() => updateSettings({ moduleAPrompt: defaultPrompts.defaultModuleAPrompt })}
      />
      <PromptEditModal
        isVisible={isModuleBModalVisible}
        onClose={() => setIsModuleBModalVisible(false)}
        promptType="moduleBPrompt"
        initialPrompt={settings.moduleBPrompt}
        greyPromptPart={"Use *word* in the context of *context*."}
        onReset={() => updateSettings({ moduleBPrompt: defaultPrompts.defaultModuleBPrompt })}
      />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    paddingBottom: 50,
    marginBottom: 100,
  },
  group: {
    marginHorizontal: 20,
    marginBottom: 45,
    borderRadius: 10,
  },
  description: {
    flex: 1,
    position: "absolute",
    top: -22,
    left: 15,
    opacity: 0.6,
  },
  descriptionText: {
    fontSize: 12,
  },
});

export default FlashcardMediaScreen;