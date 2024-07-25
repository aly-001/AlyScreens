import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import { injectedScript } from "./injectedScript";

export default function EpubReader({ uri, handleWebViewMessage }) {
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
        onReady={(reader) => console.log(reader)}
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