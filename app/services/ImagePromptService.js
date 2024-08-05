import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultPrompts from '../config/defaultPrompts.json';

const STORAGE_KEY = 'USER_IMAGE_PROMPT';

export const getImagePrompt = async () => {
  try {
    const storedPrompt = await AsyncStorage.getItem(STORAGE_KEY);
    return storedPrompt !== null ? storedPrompt : defaultPrompts.defaultImagePrompt;
  } catch (error) {
    console.error('Error retrieving image prompt:', error);
    return defaultPrompts.defaultImagePrompt;
  }
};

export const setImagePrompt = async (prompt) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, prompt);
  } catch (error) {
    console.error('Error saving image prompt:', error);
  }
};