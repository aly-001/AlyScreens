import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { ReaderProvider } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

import EpubPicker from "../components/EpubPicker";
import EpubReader from "../reader/EpubReader";
import DefinitionPopup from "../components/DefinitionPopup";
import useEpubManager from "../hooks/useEpubManager";
import useDefinitionManager from "../hooks/useDefinitionManager";
import LocationPointer from "../components/LocationPointer";
import colors from "../config/colors";
import BookHiddenFooter from "../components/BookHiddenFooter";
import { TabBarVisibilityContext } from "../navigation/TabBarVisibilityContext"; // Adjust the import path as needed
import { addCard } from "../services/CardManager";

import { useSettingsContext } from "../context/useSettingsContext";
import { useAPIKey } from "../context/APIKeyContext";


const duration = 300; // Animation duration

const BookHeader = ({ bookTitle, style }) => (
  <Animated.View style={[styles.headerContainer, style]}>
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <MaterialCommunityIcons
            name="view-grid-outline"
            size={24}
            color={colors.utilityGrey}
          />
        </View>
        <Text style={styles.headerTitle}>{bookTitle}</Text>
        <View style={styles.headerIconContainer}>
          <FontAwesome6 name="bookmark" size={24} color={colors.utilityGrey} />
        </View>
      </View>
    </SafeAreaView>
  </Animated.View>
);

export default function ReadScreen() {
  const {apiKey} = useAPIKey();
  console.log("APIKEY", apiKey);

  const settings = useSettingsContext().settings;
  const route = useRoute();
  const isFocused = useIsFocused();
  const { setIsTabBarVisible } = useContext(TabBarVisibilityContext);
  const [location, setLocation] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { handlePickComplete } = useEpubManager();
  
  const { uri, title, color, status } = route.params || {};

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
    currentGrammar,
    grammarLoading,
    currentModuleA,
    moduleALoading,
    currentModuleB,
    moduleBLoading,
    audioBase64,
    audioLoading,
  } = useDefinitionManager();

  const headerAnimation = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const footerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      setIsTabBarVisible(!isFullscreen);
    }
    return () => {
      if (isFocused) {
        setIsTabBarVisible(true);
      }
    };
  }, [isFocused, isFullscreen, setIsTabBarVisible]);

  useEffect(() => {
    if (isFullscreen) {
      Animated.parallel([
        Animated.timing(headerAnimation, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      headerAnimation.setValue(0);
      headerOpacity.setValue(0);
      footerOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFullscreen]);

  const handleWebViewMessage = (message) => {
    handleWebViewMessageDefinition(message);
    
    if (message.location) {
      setLocation(message.location);
    }
    
    // Turn below into a function and call it based on whether settings.flashcardsEnabled is true
    const addCardFromMessage = (message) => {
      
      if (message.word && message.innerContext && message.outerContext) {
        const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, '');
        const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        const { innerContext, outerContext } = message;
        
        // Call addCard without awaiting
        addCard(apiKey, capitalizedWord, innerContext, outerContext, 'en', settings)
          .then(() => {
            console.log('Card added successfully');
            // Optionally, you can update some state here to reflect the new card
            // For example: setLastAddedCardMessage('New card added successfully!');
          })
          .catch((error) => {
            console.error('Error adding card:', error);
            // Optionally, you can update some state to show an error message
            // For example: setCardAddError('Failed to add new card. Please try again.');
          });
        
      }
    }

    if (settings.flashcardsEnabled) {
      addCardFromMessage(message);
    }

  };

  const handleMiddlePress = () => {
    setIsFullscreen((prev) => !prev);
  };

  if (uri) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={isFullscreen} />
        <TouchableWithoutFeedback onPress={handleMiddlePress}>
          <View style={styles.readerContainer}>
            <ReaderProvider>
              <EpubReader
                uri={uri}
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
                currentGrammar={currentGrammar}
                grammarLoading={grammarLoading}
                audioBase64={audioBase64}
                audioLoading={audioLoading}
                currentModuleA={currentModuleA}
                moduleALoading={moduleALoading}
                currentModuleB={currentModuleB}
                moduleBLoading={moduleBLoading}
              />
              <LocationPointer location={location} visible={popupVisible} />
            </ReaderProvider>
          </View>
        </TouchableWithoutFeedback>
        <BookHeader 
          bookTitle={title} 
          style={{ 
            transform: [{ translateY: headerAnimation }],
            opacity: headerOpacity
          }}
        />
        <BookHiddenFooter 
          progress={status}
          color={color}
          style={{ 
            transform: [{ translateY: headerAnimation }],
            opacity: footerOpacity
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <BookHeader bookTitle={title} />
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
    backgroundColor: "white",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: colors.utilityGrey,
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIconContainer: {
    marginHorizontal: 20,
  },
  readerContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});