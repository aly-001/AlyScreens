import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { injectedScript } from "./injectedScript";

export default function EpubReader({ uri, handleWebViewMessage }) {
  const { injectJavascript } = useReader();
  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef(null);

  const handleCallFunctions = () => {
    injectJavascript(`
      setTimeout(() => {
        applyCustomStyles();
        wrapWordsInSpans();
        addLongPressListener();
      }, 100);
    `);
  };

  useEffect(() => {
    console.log("isReady updated:", isReady);
  }, [isReady]);

  useFocusEffect(
    React.useCallback(() => {
      setIsReady(false);
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      console.log("effect hook called");
      timerRef.current = setTimeout(() => {
        console.log("timer is ticking");
        if (!isReady) {
          Alert.alert(
            "Reader Not Ready",
            "The reader is taking longer than expected to load. Please restart your device.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        } else {
          console.log("Timer test passed");
        }
      }, 2000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [isReady])
  );

  const handleOnReady = () => {
    console.log("Reader is ready!");
    setIsReady(true);
    handleCallFunctions();
  };

  return (
    <View style={styles.readerContainer}>
      <Reader
        src={uri}
        injectedJavascript={injectedScript}
        fileSystem={useFileSystem}
        initialLocation="epubcfi(/6/14!/4/2/12/2[c002p0005]/1:160)"
        onWebViewMessage={(message) => {
          console.log("word", message.word);
          console.log("innerContext", message.innerContext);
          console.log("outerContext", message.outerContext);
          console.log("location", message.location);
          handleWebViewMessage(message);
        }}
        onReady={handleOnReady}
        onSwipeLeft={handleCallFunctions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  readerContainer: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 0,
    minHeight: 640,
  },
});
