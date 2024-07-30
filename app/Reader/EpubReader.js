import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { injectedScript } from "./injectedScript";

export default function EpubReader({ uri, handleWebViewMessage }) {
  const { injectJavascript } = useReader();
// Temporary solution to fade and fall the functions every swipe, but 
// eventually will need to figure out how to call it only when the
// iframe content changes
const handleCallFunctions = () => {
  injectJavascript(`
    setTimeout(() => {
      const createWhiteBackground = () => {
        const whiteScreen = document.createElement('div');
        whiteScreen.style.position = 'fixed';
        whiteScreen.style.top = 0;
        whiteScreen.style.left = 0;
        whiteScreen.style.width = '100%';
        whiteScreen.style.height = '100%';
        whiteScreen.style.backgroundColor = 'white';
        whiteScreen.style.zIndex = 1000;
        document.body.appendChild(whiteScreen);
        return whiteScreen;
      };

      // Function to apply fade out effect
      const applyFadeOut = (element) => {
        element.style.transition = 'background-color 300ms';
        element.style.backgroundColor = 'transparent';
        setTimeout(() => {
          document.body.removeChild(element);
        }, 400);
      };

      const whiteScreen = createWhiteBackground();
      setTimeout(() => {
        
      applyCustomStyles();
      wrapWordsInSpans();
      addLongPressListener();
      applyFadeOut(whiteScreen);
      }, 100);
      
    }, 0);
  `);
};

  const handleOnReady = () => {
    console.log("Ready");
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
        onSwipeRight={handleCallFunctions}
        onRendered={() => console.log("rendered")}
        onLocationsReady={() => console.log("locations ready")}
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
