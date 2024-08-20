import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript";
import { useBooks } from "../context/BooksContext";

export default function EpubReader({ uri, handleWebViewMessage, tableOfContents, setTableOfContents, handleStatus }) {
  const { injectJavascript, getCurrentLocation, goToLocation } = useReader();
  const { books, updateBookStatus } = useBooks();
  const [initialLocation, setInitialLocation] = useState(null);
  const prevTableOfContentsRef = useRef(false);

  useEffect(() => {
    const book = books.find(book => book.uri === uri);
    if (book?.cfi) {
      setInitialLocation(book.cfi);
      handleStatus(book.status);
    }
  }, [books, uri]);

  useEffect(() => {
    if (tableOfContents && !prevTableOfContentsRef.current) {
      goToLocation(0);
      setTableOfContents(false);
    }
    prevTableOfContentsRef.current = tableOfContents;
  }, [tableOfContents, goToLocation, setTableOfContents]);

  const handleCallFunctions = useCallback(() => {
    injectJavascript("window.runFunctionsForOneMinute();");
  }, [injectJavascript]);

  const handleLocationChange = useCallback(() => {
    if (!updateBookStatus) return;
    try {
      const location = getCurrentLocation();
      if (!location?.end?.percentage) return;
      const percentage = location.end.percentage * 100;
      const cfi = location.start.cfi;
      
      updateBookStatus(uri, percentage, cfi)
        .catch(error => console.error("Error updating book status:", error));
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
        onLocationsReady={handleLocationChange}
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