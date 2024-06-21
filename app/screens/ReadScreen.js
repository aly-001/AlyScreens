import React from 'react';
import { View, Text } from 'react-native';
import { ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import EpubPicker from '../components/EpubPicker';
import EpubReader from '../reader/EpubReader';
import DefinitionPopup from '../components/DefinitionPopup';
import useEpubManager from '../hooks/useEpubManager';
import useDefinitionManager from '../hooks/useDefinitionManager';

export default function ReadScreen() {
  const { fileUri, handlePickComplete } = useEpubManager();
  const { 
    popupVisible, 
    currentWord, 
    currentDefinition, 
    isLoading, 
    handleWebViewMessage, 
    handleClosePopup 
  } = useDefinitionManager();

  if (fileUri) {
    return (
      <ReaderProvider>
        <EpubReader 
          uri={fileUri} 
          fileSystem={useFileSystem} 
          handleWebViewMessage={handleWebViewMessage}
        />
        <DefinitionPopup
          visible={popupVisible}
          onClose={handleClosePopup}
          word={currentWord}
          definition={currentDefinition}
          isLoading={isLoading}
        />
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