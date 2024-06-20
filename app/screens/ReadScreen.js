import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';

import EpubPicker from '../components/EpubPicker';
import { saveEpub, loadStoredEpub } from '../services/EpubManager';
import EpubReader from '../Reader/EpubReader';

export default function ReadScreen() {
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

  if (fileUri) {
    return (
      <ReaderProvider>
        <EpubReader uri={fileUri} fileSystem={useFileSystem} />
      </ReaderProvider>
    );
  } else {
    return (
      <View>
        <Text>No EPUB file selected</Text>
        <EpubPicker onPickComplete={handlePickComplete} />
      </View>
    );
  }
}