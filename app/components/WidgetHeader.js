import { View, StyleSheet, Text } from "react-native";
import React from "react";
import colors from "../config/colors";
import fonts from "../config/fonts";
import layout from "../config/layout";

export default function WidgetHeader({ text, noMargin = false }) {
  return (
    <View style={[styles.container, noMargin ? null : styles.marginBottom]}>
      <Text style={styles.header}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marginBottom: {
    marginBottom: 60,
  },
  header: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: fonts.main,
    margin: layout.margins.screenHeaderMargin,
    color: colors.widgetHeader,
  },
  chevron: {
    position: "absolute",
    right: 28,
    top: 28,
  },
});