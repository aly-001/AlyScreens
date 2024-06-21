import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript";

export default function EpubReader({ uri, handleWebViewMessage }) {
  return (
    <View style={styles.readerContainer}>
      <Reader
        injectedJavascript={injectedScript}
        src={uri}
        fileSystem={useFileSystem}
        initialLocation="epubcfi(/6/14!/4/2/12/2[c002p0005]/1:160)"
        onWebViewMessage={(message) => {
          console.log("word", message.word);
          console.log("innerContext", message.innerContext);
          console.log("outerContext", message.outerContext);
          console.log("location", message.location);
          handleWebViewMessage(message);
        }}
      />
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
