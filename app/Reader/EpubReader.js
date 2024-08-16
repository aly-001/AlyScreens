import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript";
import { useBooks } from "../hooks/useBooks";

export default function EpubReader({ uri, handleWebViewMessage, tableOfContents, setTableOfContents, handleStatus }) {
  const { injectJavascript, getCurrentLocation, goToLocation } = useReader();
  const [initialLocation, setInitialLocation] = useState(null);
  const prevTableOfContentsRef = useRef(false);
  
  const { getBookByUri, updateBookStatus } = useBooks(); // Use the hook to get necessary functions
  
  useEffect(() => {
    const book = getBookByUri(uri);
    if (book?.cfi) {
      setInitialLocation(book.cfi);
    handleStatus(book.status);
    }
  }, [getBookByUri, uri]);

  useEffect(() => {
    if (tableOfContents && !prevTableOfContentsRef.current) {
      goToLocation(0);
      setTableOfContents(false);
    }
    prevTableOfContentsRef.current = tableOfContents;
  }, [tableOfContents, goToLocation, setTableOfContents]);

  const handleCallFunctions = useCallback(() => {
    injectJavascript("window.runFunctionsForOneMinute();");
    // handleLocationChange();
  }, [injectJavascript]);

  const handleLocationChange = useCallback(() => {
    console.log("location change")
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
  }, [getCurrentLocation, updateBookStatus, uri]);

  return (
    <View style={styles.readerContainer}>
      <Reader
        src={uri}
        injectedJavascript={injectedScript}
        fileSystem={useFileSystem}
        initialLocation={initialLocation}
        onWebViewMessage={handleWebViewMessage}
        onReady={handleCallFunctions}
        onSwipeLeft={handleCallFunctions}
        onSwipeRight={handleCallFunctions}
        onLocationChange={handleLocationChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  readerContainer: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: 640,
  },
});