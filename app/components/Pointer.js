import { View, StyleSheet } from "react-native";
import React from "react";

export default function Pointer({ direction }) {
  return (
    <View style={styles.container}>
     {direction==="U" ? <View style={styles.coverBottom}></View> : <View style={styles.coverTop}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    backgroundColor: "white",
    transform: [{ rotate: "45deg" }],
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "grey"
  },
  coverBottom: {
    transform: [{ rotate: "135deg" }],
    width: 80,
    height: 20,
    backgroundColor: "white",
    position: "absolute",
    top: -5.3,
    left: -39.9,
  },
  coverTop: {
    transform: [{ rotate: "135deg" }],
    width: 80,
    height: 20,
    backgroundColor: "white",
    position: "absolute",
    top: 10.3,
    left: -32.9,
  },
});
