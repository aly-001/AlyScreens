import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import SettingSwitch from "../../components/SettingsSwitch";
import colors from "../../config/colors";
import { Divider } from "react-native-paper";
import PromptEditModal from "../../components/PromptEditModal";
import defaultPrompts from "../../config/defaultPrompts.json";

const FlashcardMediaScreen = () => {
  const { settings, updateSettings } = useSettingsContext();
  const [isGrammarModalVisible, setIsGrammarModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

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
    <ScrollView style={styles.container}>
      <View style={styles.group}>
        <SettingSwitch
          label="Enable Flashcards"
          value={settings.flashcardsEnabled}
          onValueChange={() => toggleSetting("flashcardsEnabled")}
        />
      </View>
      <View style={[styles.group, {marginTop: 30}]}>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>FRONT</Text>
        </View>
        {renderSwitch("Word", "flashcardsFrontWord")}
        <Divider />
        {renderSwitch("Context", "flashcardsFrontContext")}
      </View>
      <View style={[styles.group, {marginTop: 15}]}>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>BACK</Text>
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
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  group: {
    backgroundColor: "white",
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
    color: colors.utilityGrey,
  },
});

export default FlashcardMediaScreen;