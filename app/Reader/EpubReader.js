import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript";

export default function EpubReader({ uri, handleWebViewMessage }) {
  const { injectJavascript } = useReader();

  const handleCallFunctions = () => {
    injectJavascript(`
      setTimeout(() => {
        applyCustomStyles();
        wrapWordsInSpans();
        addLongPressListener();
      }, 100);
    `);
  };

  return (
    <View style={styles.readerContainer}>
      <Reader
        src={uri}
        injectedJavascript={injectedScript}
        fileSystem={useFileSystem}
        initialLocation="epubcfi(/6/14!/4/2/12/2[c002p0005]/1:160)"
        onWebViewMessage={(event) => {
          const message = JSON.parse(event.nativeEvent.data);
          console.log("Received message:", message);
          handleWebViewMessage(message);
        }}
        onReady={handleCallFunctions}
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