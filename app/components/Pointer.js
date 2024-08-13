import React from "react";
import { View, StyleSheet } from "react-native";

export default function Pointer({ direction }) {
  return (
    <View style={[
      styles.triangle,
      direction === "U" ? styles.triangleDown : styles.triangleUp
    ]} />
  );
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangleUp: {
    borderBottomColor: 'rgba(200, 200, 200, 1)',
    bottom: 6,
  },
  triangleDown: {
    transform: [{ rotate: '180deg' }],
    borderBottomColor: 'rgba(200, 200, 200, 1)',
    top: 6,
  },
});