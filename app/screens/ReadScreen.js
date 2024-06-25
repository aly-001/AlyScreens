import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import EpubPicker from '../components/EpubPicker';
import EpubReader from '../reader/EpubReader';
import DefinitionPopup from '../components/DefinitionPopup';
import useEpubManager from '../hooks/useEpubManager';
import useDefinitionManager from '../hooks/useDefinitionManager';
import LocationPointer from '../components/LocationPointer';
import colors from '../config/colors';

const bookTitle = "Brave New World";

const BookHeader = ({ bookTitle }) => (
  <SafeAreaView style={styles.headerContainer}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{bookTitle}</Text>
    </View>
  </SafeAreaView>
);

export default function ReadScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  useLayoutEffect(() => {
    navigation.setParams({ hideTabBar: isFullscreen });
  }, [navigation, isFullscreen]);

  const handleWebViewMessage = (message) => {
    handleWebViewMessageDefinition(message);
    if (message.location) {
      setLocation(message.location);
    }
  };

  const handleMiddlePress = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (fileUri) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={isFullscreen} />
        {isFullscreen && <View style={styles.statusBarOverlay} />}
        <TouchableWithoutFeedback onPress={handleMiddlePress}>
          <View style={styles.readerContainer}>
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
              <LocationPointer location={location} visible={popupVisible} />
            </ReaderProvider>
          </View>
        </TouchableWithoutFeedback>
        {!isFullscreen && <BookHeader bookTitle={bookTitle}/>}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <BookHeader bookTitle={bookTitle} />
        <View style={styles.pickerContainer}>
          <Text>No EPUB file selected</Text>
          <EpubPicker onPickComplete={handlePickComplete} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: "white"
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', 
    zIndex: 1,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    color: colors.utilityGrey,
    fontSize: 18,
    fontWeight: 'bold',
  },
  readerContainer: {
    backgroundColor: "purple",
    flex: 1,
    paddingBottom: 20, // Add padding to account for the tab bar
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight,
    backgroundColor: 'white', // Match this with your reader background color
    zIndex: 2,
  },
});