import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
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

const bookTitle = "Le Compte de Monte-Cristo";
const progress = 13; // This should be a state variable that updates as the user reads
const progressColor = "#D15A6C";
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
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
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

  const headerAnimation = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const footerOpacity = useRef(new Animated.Value(1)).current;

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
        <BookHeader 
          bookTitle={bookTitle} 
          style={{ 
            transform: [{ translateY: headerAnimation }],
            opacity: headerOpacity
          }}
        />
        <BookHiddenFooter 
          progress={progress}
          color={progressColor}
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
    height: "100%",
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
    paddingHorizontal: 10, // Add some horizontal padding
  },
  headerTitle: {
    color: colors.utilityGrey,
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIconContainer: {
    marginHorizontal: 20, 
  },
  
  hiddenFooterContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    backgroundColor: "dodgerblue",
    zIndex: 2,
  },
  hiddenFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 10, // Add some horizontal padding
  },
  
  readerContainer: {
    backgroundColor: "white",
    flex: 1,
    paddingBottom: 20, // Add padding to account for the tab bar
  },
  pickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
