import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { useThemeColors } from "../../config/colors";
import fonts from "../../config/fonts";
import layout from "../../config/layout";

export default function WidgetHeader({ text, noMargin = false }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, noMargin ? null : styles.marginBottom]}>
      <Text style={[styles.header, { color: colors.widgetHeader }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marginBottom: {
    marginBottom: layout.margins.homeScreen.widgetHeader,
  },
  header: {
    fontSize: layout.fontSize.widgetHeader,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: fonts.main,
    margin: layout.margins.screenHeaderMargin,
  },
  chevron: {
    position: "absolute",
    right: 28,
    top: 28,
  },
});
