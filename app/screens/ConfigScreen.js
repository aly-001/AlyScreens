import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useSettingsContext } from "../context/useSettingsContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const ConfigScreen = () => {
  const { settings, updateSettings } = useSettingsContext();
  const [tempPrompts, setTempPrompts] = useState({
    imagePrompt: settings.imagePrompt,
    grammarPrompt: settings.grammarPrompt,
  });

  const handlePromptChange = (promptType, value) => {
    setTempPrompts(prev => ({ ...prev, [promptType]: value }));
  };

  const handleSavePrompt = (promptType) => {
    updateSettings({ [promptType]: tempPrompts[promptType] });
  };

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

  const renderSwitch = (label, setting, disabled = false) => (
    <View key={setting} style={styles.settingItem}>
      <Text>{label}</Text>
      <Switch
        value={settings[setting]}
        onValueChange={() => toggleSetting(setting)}
        disabled={disabled}
      />
    </View>
  );

  const renderPromptInput = (promptType, label) => (
    <View key={promptType} style={styles.promptInputContainer}>
      <Text style={styles.promptLabel}>{label}</Text>
      <TextInput
        style={styles.promptInput}
        multiline
        numberOfLines={4}
        value={tempPrompts[promptType]}
        onChangeText={(value) => handlePromptChange(promptType, value)}
        placeholder={`Enter ${promptType}`}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleSavePrompt(promptType)}
      >
        <Text style={styles.saveButtonText}>{`Save ${label}`}</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  const flashcardSwitches = [
    { label: "Word", setting: "flashcardsFrontWord" },
    { label: "Context", setting: "flashcardsFrontContext" },
    { label: "Grammar", setting: "flashcardsFrontGrammar" },
  ];

  const backFlashcardSwitches = [
    { label: "Word", setting: "flashcardsBackWord" },
    { label: "Word Translation", setting: "flashcardsBackWordTranslation" },
    { label: "Context", setting: "flashcardsBackContext" },
    { label: "Context Translation", setting: "flashcardsBackContextTranslation" },
    { label: "Audio", setting: "flashcardsBackAudio" },
    { label: "Context Audio", setting: "flashcardsBackContextAudio" },
    { label: "Image", setting: "flashcardsBackImage" },
    { label: "Grammar", setting: "flashcardsBackGrammar" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {renderSection("Prompt Engineering", (
          <>
            {renderPromptInput("imagePrompt", "Image Generation Prompt")}
            {renderPromptInput("grammarPrompt", "Grammar Prompt")}
          </>
        ))}

        {renderSection("OpenAI Key", (
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => {/* Handle edit */}}>
              <Icon name="edit" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        ))}

        {renderSection("Translation Popup", (
          <>
            {renderSwitch("Translation", "translationPopupTranslation")}
            {renderSwitch("Audio", "translationPopupAudio")}
            {renderSwitch("Grammar", "translationPopupGrammar")}
          </>
        ))}

        {renderSection("Flashcards", (
          <>
            {renderSwitch("Enable Flashcards", "flashcardsEnabled")}
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Front</Text>
              {flashcardSwitches.map(({ label, setting }) => 
                renderSwitch(label, setting, !settings.flashcardsEnabled)
              )}
            </View>
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Back</Text>
              {backFlashcardSwitches.map(({ label, setting }) => 
                renderSwitch(label, setting, !settings.flashcardsEnabled)
              )}
            </View>
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, padding: 16 },
  section: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  subsection: { marginTop: 16, marginLeft: 16 },
  subsectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  promptInputContainer: { marginTop: 8 },
  promptLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  promptInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { color: '#ffffff', fontWeight: 'bold' },
});

export default ConfigScreen;