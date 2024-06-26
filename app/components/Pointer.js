import { View, StyleSheet } from "react-native";
import React from "react";
import colors from "../config/colors";

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
    borderWidth: 1.75,
    borderColor: colors.utilityGreyUltraLight,
  },
  coverBottom: {
    transform: [{ rotate: "135deg" }],
    width: 80,
    height: 20,
    backgroundColor: "white",
    position: "absolute",
    top: -5.8,
    left: -39.9,
  },
  coverTop: {
    transform: [{ rotate: "135deg" }],
    width: 80,
    height: 20,
    backgroundColor: "white",
    position: "absolute",
    top: 10.5,
    left: -32.9,
  },
});
