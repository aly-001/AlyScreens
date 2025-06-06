import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultPrompts from "../config/defaultPrompts.json";
import { getImagePrompt, setImagePrompt } from '../services/ImagePromptService';

const useSettings = () => {
  const [settings, setSettings] = useState({
    openAIKey: '',
    translationPopupTranslation: true,
    translationPopupAudio: false,
    translationPopupGrammar: false,
    translationPopupModuleA: false,
    flashcardsEnabled: false, // **Flashcards default to disabled**
    flashcardsFrontWord: true,
    flashcardsFrontContext: false,
    flashcardsFrontGrammar: false,
    flashcardsFrontModuleA: false,
    flashcardsFrontModuleB: false,
    flashcardsBackWord: true,
    flashcardsBackWordTranslation: true,
    flashcardsBackContext: false,
    flashcardsBackContextTranslation: false,
    flashcardsBackAudio: true,
    flashcardsBackContextAudio: false,
    flashcardsBackImage: true,
    flashcardsBackGrammar: false,
    flashcardsBackModuleA: false,
    flashcardsBackModuleB: false,
    languageTag: 'en-US',
    translationPrompt: defaultPrompts.defaultTranslationPrompt,
    imagePrompt: defaultPrompts.defaultImagePrompt,
    grammarPrompt: defaultPrompts.defaultGrammarPrompt,
    moduleAPrompt: defaultPrompts.defaultModuleAPrompt,
    moduleBPrompt: defaultPrompts.defaultModuleBPrompt,
    theme: 'light',
    AIDecidesWhenToGeneratePrompt: defaultPrompts.defaultAIDecidesWhenToGeneratePrompt,
    AIDecidesWhenToGenerate: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('userSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      }
      
      // Load image prompt separately
      const imagePrompt = await getImagePrompt();
      setSettings(prevSettings => ({
        ...prevSettings,
        imagePrompt
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);

      // If imagePrompt is being updated, save it separately
      if (newSettings.imagePrompt) {
        await setImagePrompt(newSettings.imagePrompt);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return { settings, updateSettings };
};

export default useSettings;