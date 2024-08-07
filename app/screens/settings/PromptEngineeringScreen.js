import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useSettingsContext } from '../../context/useSettingsContext';

const PromptEngineeringScreen = () => {
  const { settings, updateSettings } = useSettingsContext();
  const [imagePrompt, setImagePrompt] = useState(settings.imagePrompt || '');
  const [grammarPrompt, setGrammarPrompt] = useState(settings.grammarPrompt || '');

  const handleSave = () => {
    updateSettings({ imagePrompt, grammarPrompt });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={imagePrompt}
        onChangeText={setImagePrompt}
        placeholder="Image Generation Prompt"
        multiline
      />
      <TextInput
        style={styles.input}
        value={grammarPrompt}
        onChangeText={setGrammarPrompt}
        placeholder="Grammar Prompt"
        multiline
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
  },
});


export default PromptEngineeringScreen;
