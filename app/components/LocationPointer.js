import { View, StyleSheet } from "react-native";
import React from "react";

export default function LocationPointer({ location, visible }) {
  const top = location.top + location.height * 2 + 5;
  const left = location.left + location.width / 2 + 15;
  if (visible)
    return <View style={[styles.container, { top: top -6, left: left - location.width/2, width: location.width + 10 }]}></View>;
  else return null;
}

const styles = StyleSheet.create({
  container: {
     height: 40,
    backgroundColor: "yellow",
    position: "absolute",
    opacity: 0.10,
    borderRadius: 10,
  },
});
