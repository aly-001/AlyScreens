import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSettingsContext } from '../../context/useSettingsContext';
import colors from '../../config/colors';

const PromptEngineeringScreen = () => {
  const { settings, updateSettings } = useSettingsContext();
  const [imagePrompt, setImagePrompt] = useState(settings.imagePrompt || '');
  const [grammarPrompt, setGrammarPrompt] = useState(settings.grammarPrompt || '');

  const handleSave = () => {
    updateSettings({ imagePrompt, grammarPrompt });
  };

  const renderInput = (label, value, onChangeText, placeholder) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.settingGroup}>
      <View style={styles.description}>
          <Text style={styles.descriptionText}>IMAGE</Text>
        </View>
        {renderInput(
          "Image Generation Prompt",
          imagePrompt,
          setImagePrompt,
          "Enter image generation prompt"
        )}
      </View>

      <View style={styles.settingGroup}>
      <View style={styles.description}>
          <Text style={styles.descriptionText}>GRAMMAR</Text>
        </View>
        {renderInput(
          "Grammar Prompt",
          grammarPrompt,
          setGrammarPrompt,
          "Enter grammar prompt"
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: colors.homeScreenBackground,
  },
  settingGroup: {
    backgroundColor: 'white',
    marginBottom: 45,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.utilityGrey,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.appleBlue,
    fontSize: 16,
    fontWeight: 'bold',

  },
  description: {
    flex: 1,
    position: 'absolute',
    top: -22,
    left: 15,
    opacity: 0.6,
  },
});

export default PromptEngineeringScreen;