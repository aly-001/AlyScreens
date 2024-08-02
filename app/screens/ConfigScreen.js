import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSettingsContext } from "../context/useSettingsContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const ConfigScreen = () => {
  const { settings, updateSettings } = useSettingsContext();

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

  return (
    <ScrollView style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
});

export default ConfigScreen;
