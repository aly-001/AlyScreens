import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript";
import { useBooks } from "../hooks/useBooks";

export default function EpubReader({ uri, handleWebViewMessage, tableOfContents, setTableOfContents, handleStatus }) {
  const { injectJavascript, getCurrentLocation, goToLocation, changeTheme } = useReader();
  const [initialLocation, setInitialLocation] = useState(null);
  const prevTableOfContentsRef = useRef(false);
  const colorScheme = "dark";
  
  const { getBookByUri, updateBookStatus } = useBooks();
  
  useEffect(() => {
    const book = getBookByUri(uri);
    if (book?.cfi) {
      setInitialLocation(book.cfi);
    }
    handleStatus(book?.status || 0);
  }, [getBookByUri, uri]);

  useEffect(() => {
    if (tableOfContents && !prevTableOfContentsRef.current) {
      goToLocation(0);
      setTableOfContents(false);
    }
    prevTableOfContentsRef.current = tableOfContents;
  }, [tableOfContents, goToLocation, setTableOfContents]);

  useEffect(() => {
    const darkTheme = {
      body: {
        background: '#000000',
        color: '#FFFFFF'
      }
    };
    const lightTheme = {
      body: {
        background: '#FFFFFF',
        color: '#000000'
      }
    };
    changeTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme, changeTheme]);

  const handleCallFunctions = useCallback(() => {
    injectJavascript("window.runFunctionsForOneMinute();");
  }, [injectJavascript]);

  const handleLocationChange = useCallback(() => {
    try {
      const location = getCurrentLocation();
      if (!location?.end?.percentage) return;
      const percentage = Math.round(location.end.percentage * 100);
      const cfi = location.start.cfi;
      
      console.log("Location changed:", percentage, cfi);
      updateBookStatus(uri, percentage, cfi);
      handleStatus(percentage);
    } catch (error) {
      console.error("Error in handleLocationChange:", error);
    }
  }, [getCurrentLocation, updateBookStatus, uri, handleStatus]);

  return (
    <View style={[styles.readerContainer, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <Reader
        src={uri}
        injectedJavascript={injectedScript}
        fileSystem={useFileSystem}
        initialLocation={initialLocation}
        onWebViewMessage={handleWebViewMessage}
        onReady={handleCallFunctions}
        onSwipeLeft={handleCallFunctions}
        onSwipeRight={handleCallFunctions}
        onLocationsReady={handleLocationChange}
        onLocationChange={handleLocationChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  readerContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: 640,
  },
  lightContainer: {
    backgroundColor: "white",
  },
  darkContainer: {
    backgroundColor: "black",
  },
});