import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { saveEpub, loadStoredEpub, removeEpub } from '../services/EpubManager';

export default function useEpubManager() {
  const [fileUri, setFileUri] = useState(null);

  useEffect(() => {
    //removeEpubFile();
    loadEpub();
  }, []);

  const loadEpub = async () => {
    const uri = await loadStoredEpub();
    setFileUri(uri);
  };

  const removeEpubFile = async () => {
    try {
      const uri = await removeEpub();
      setFileUri(null);
      Alert.alert('Success', 'EPUB file removed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove EPUB file');
    }
  }

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