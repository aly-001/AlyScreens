import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'openai_api_key';

export const APIKeyManager = {
  saveAPIKey: async (apiKey) => {
    try {
      await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  },

  getAPIKey: async () => {
    try {
      return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  },

  deleteAPIKey: async () => {
    try {
      await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }
};
