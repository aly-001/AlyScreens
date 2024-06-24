import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import EpubPicker from '../components/EpubPicker';
import EpubReader from '../reader/EpubReader';
import DefinitionPopup from '../components/DefinitionPopup';
import useEpubManager from '../hooks/useEpubManager';
import useDefinitionManager from '../hooks/useDefinitionManager';
import LocationPointer from '../components/LocationPointer';

export default function ReadScreen() {
  const [location, setLocation] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const { fileUri, handlePickComplete } = useEpubManager();
  const { 
    popupVisible, 
    currentWord, 
    currentDefinition, 
    isLoading, 
    started,
    finished,
    added,
    handleWebViewMessageDefinition, 
    handleClosePopup,
    handleToggle,
  } = useDefinitionManager();

  const handleWebViewMessage = (message) => {
    handleWebViewMessageDefinition(message);
    if (message.location) {
      setLocation(message.location);
    }
  };

  if (fileUri) {
    return (
      <ReaderProvider>
        <EpubReader 
          uri={fileUri} 
          fileSystem={useFileSystem} 
          handleWebViewMessage={handleWebViewMessage}
        />
        <DefinitionPopup
          location={location}
          visible={popupVisible}
          onClose={handleClosePopup}
          word={currentWord}
          definition={currentDefinition}
          isLoading={isLoading}
          added={added}
          finished={finished}
          started={started}
          onToggleCheck={handleToggle}
        />
        <LocationPointer location={location} visible={popupVisible } />
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
