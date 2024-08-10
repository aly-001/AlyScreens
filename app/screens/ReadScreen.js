import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  Animated,
  StyleSheet,
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
import { useTabBarVisibility } from "../navigation/TabBarVisibilityContext";
import { addCard } from "../services/CardManager";

import { useSettingsContext } from "../context/useSettingsContext";
import { useAPIKey } from "../context/APIKeyContext";
import { useBooks } from "../context/BooksContext";

const duration = 200; // Animation duration

const BookHeader = ({ bookTitle, style, onTocPress }) => {
  const truncatedTitle = bookTitle.length > 100 
    ? bookTitle.substring(0, 97) + '...' 
    : bookTitle;

  return (
    <Animated.View style={[styles.headerContainer, style]}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={onTocPress}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons
                name="view-grid-outline"
                size={24}
                color={colors.utilityGrey}
              />
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {truncatedTitle}
          </Text>
          <View style={styles.headerIconContainer}>
            <FontAwesome6 name="bookmark" size={24} color={colors.utilityGrey} />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default function ReadScreen() {
  const { getBookStatus } = useBooks();
  const { apiKey } = useAPIKey();
  const { setTabBarVisible } = useTabBarVisibility();
  const isFocused = useIsFocused();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tableOfContents, setTableOfContents] = useState(false);

  const settings = useSettingsContext().settings;
  const route = useRoute();
  const [location, setLocation] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const { handlePickComplete } = useEpubManager();
  
  const { uri, title, color } = route.params || {};
  const { status } = getBookStatus(uri);

  useEffect(() => {
    console.log("Status:", status);
  }, [status]);

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

  const headerOpacity = useRef(new Animated.Value(1)).current;
  const footerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      setTabBarVisible(!isFullscreen);
    }
    return () => {
      if (isFocused) {
        setTabBarVisible(true);
      }
    };
  }, [isFocused, isFullscreen, setTabBarVisible]);

  useEffect(() => {
    if (isFullscreen) {
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: duration,
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
    
    const addCardFromMessage = (message) => {
      if (message.word && message.innerContext && message.outerContext) {
        const cleanWord = message.word.replace(/^[^\w]+|[^\w]+$/g, '');
        const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        const { innerContext, outerContext } = message;
        
        addCard(apiKey, capitalizedWord, innerContext, outerContext, 'en', settings)
          .then(() => {
            console.log('Card added successfully');
          })
          .catch((error) => {
            console.error('Error adding card:', error);
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

  const handleTocPress = () => {
    setTableOfContents(true);
  };

  if (uri) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <TouchableWithoutFeedback onPress={handleMiddlePress}>
          <View style={styles.readerContainer}>
            <ReaderProvider>
              <EpubReader
                uri={uri}
                fileSystem={useFileSystem}
                handleWebViewMessage={handleWebViewMessage}
                tableOfContents={tableOfContents}
                setTableOfContents={setTableOfContents}
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
          style={{ opacity: headerOpacity }}
          onTocPress={handleTocPress}
        />
        <BookHiddenFooter 
          progress={status}
          color={color}
          style={{ opacity: footerOpacity }}
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerIconContainer: {
    width: 24,
    alignItems: 'center',
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