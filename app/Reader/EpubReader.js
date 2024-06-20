import * as React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Reader, ReaderProvider } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript"; // Import the injected JavaScript
// Mock function to fetch definition from an LLM

export default function EpubReader({ uri, handleWebViewMessage }) {
  return (
    <View style={styles.readerContainer}>
      <Reader
        src={uri}
        fileSystem={useFileSystem}
        initialLocation="epubcfi(/6/14!/4/2/12/2[c002p0005]/1:160)"
        injectedJavascript={injectedScript} // Use the imported script here
        // onWebViewMessage={handleWebViewMessage}
        onWebViewMessage={(message) => {
          console.log("word", message.word);
          console.log("innerContext", message.innerContext);
          console.log("outerContext", message.outerContext);

          handleWebViewMessage(message);

          // console.log("entireTextHTML", message.entireTextHTML);
        }}
      ></Reader>
    </View>
  );
}

const styles = StyleSheet.create({
  readerContainer: {
    flex: 1,
    marginTop: 50,
    margin: 20,
  },
});
