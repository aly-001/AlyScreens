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
  const [tempImagePrompt, setTempImagePrompt] = useState(settings.imagePrompt);

  const toggleSetting = (setting) => {
    let newSettings = { [setting]: !settings[setting] };

    // If turning off context, also turn off context translation
    if (setting === 'flashcardsFrontContext' && !newSettings[setting]) {
      newSettings['flashcardsFrontContextTranslation'] = false;
    }
    if (setting === 'flashcardsBackContext' && !newSettings[setting]) {
      newSettings['flashcardsBackContextTranslation'] = false;
    }

    // If turning on context translation, ensure context is on
    if (setting === 'flashcardsFrontContextTranslation' && newSettings[setting]) {
      newSettings['flashcardsFrontContext'] = true;
    }
    if (setting === 'flashcardsBackContextTranslation' && newSettings[setting]) {
      newSettings['flashcardsBackContext'] = true;
    }

    updateSettings(newSettings);
  };

  // Function to render a flashcard-related switch
  const renderFlashcardSwitch = (label, setting) => (
    <View style={styles.settingItem}>
      <Text>{label}</Text>
      <Switch
        value={settings[setting]}
        onValueChange={() => toggleSetting(setting)}
        disabled={
          !settings.flashcardsEnabled ||
          setting === "flashcardsFrontWord" ||
          setting === "flashcardsBackWord" ||
          setting === "translationPopupGrammar" ||
          setting === "flashcardsFrontGrammar" ||
          setting === "flashcardsBackGrammar" ||
          (setting === "flashcardsFrontContextTranslation" && !settings.flashcardsFrontContext) ||
          (setting === "flashcardsBackContextTranslation" && !settings.flashcardsBackContext)
        }
      />
    </View>
  );

  // Function to render a regular switch
  const renderSwitch = (label, setting) => (
    <View style={styles.settingItem}>
      <Text>{label}</Text>
      <Switch
        value={settings[setting]}
        onValueChange={() => toggleSetting(setting)}
      />
    </View>
  );

  const handleSaveImagePrompt = () => {
    updateSettings({ imagePrompt: tempImagePrompt });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Generation</Text>
          <View style={styles.promptInputContainer}>
            <TextInput
              style={styles.promptInput}
              multiline
              numberOfLines={4}
              value={tempImagePrompt}
              onChangeText={setTempImagePrompt}
              placeholder="Enter image generation prompt"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveImagePrompt}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>OpenAI Key</Text>
            <TouchableOpacity
              onPress={() => {
                /* Handle edit */
              }}
            >
              <Icon name="edit" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translation Popup</Text>
          {renderSwitch("Translation", "translationPopupTranslation")}
          {renderSwitch("Audio", "translationPopupAudio")}
          {renderSwitch("Grammar", "translationPopupGrammar")}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flashcards</Text>
          {renderSwitch("Enable Flashcards", "flashcardsEnabled")}

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Front</Text>
            {renderFlashcardSwitch("Word", "flashcardsFrontWord")}
            {renderFlashcardSwitch("Context", "flashcardsFrontContext")}
            {renderFlashcardSwitch("Grammar", "flashcardsFrontGrammar")}
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Back</Text>
            {renderFlashcardSwitch("Word", "flashcardsBackWord")}
            {renderFlashcardSwitch(
              "Word Translation",
              "flashcardsBackWordTranslation"
            )}
            {renderFlashcardSwitch("Context", "flashcardsBackContext")}
            {renderFlashcardSwitch(
              "Context Translation",
              "flashcardsBackContextTranslation"
            )}
            {renderFlashcardSwitch("Audio", "flashcardsBackAudio")}
            {renderFlashcardSwitch("Context Audio", "flashcardsBackContextAudio")}
            {renderFlashcardSwitch("Image", "flashcardsBackImage")}
            {renderFlashcardSwitch("Grammar", "flashcardsBackGrammar")}
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subsection: {
    marginTop: 16,
    marginLeft: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  promptInputContainer: {
    marginTop: 8,
  },
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
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ConfigScreen;