import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { saveEpub, loadStoredEpub } from '../services/EpubManager';

export default function useEpubManager() {
  const [fileUri, setFileUri] = useState(null);

  useEffect(() => {
    loadEpub();
  }, []);

  const loadEpub = async () => {
    const uri = await loadStoredEpub();
    setFileUri(uri);
  };

  const handlePickComplete = async (fileAsset) => {
    try {
      const uri = await saveEpub(fileAsset);
      setFileUri(uri);
      Alert.alert('Success', 'EPUB file stored successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to store EPUB file');
    }
  };

  return { fileUri, handlePickComplete };
}