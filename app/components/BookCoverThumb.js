import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { useThemeColors } from "../config/colors";
import fonts from "../config/fonts";
import shortenText from "../utils/shortenText";
import layout from "../config/layout";

/**
 * Utility function to determine if a color is light or dark
 * Returns true if the color is light, false otherwise
 */
const isLightColor = (hexColor) => {
  // Remove the hash symbol if present
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export default function BookCoverThumb({ title, subtitle, color, status }) {
  const colors = useThemeColors();

  // Adjust status
  const statusRounded = status > 90 ? 100 : status;
  const statusPercent = `${statusRounded}%`;

  // Shorten titles if necessary
  const maxTitleChars = 30;
  const maxSubtitleChars = 50;
  const shortenedTitle = shortenText(title, maxTitleChars);
  const shortenedSubtitle = shortenText(subtitle, maxSubtitleChars);

  // Set text color to always be dark
  const textColor = "#000000";

  return (
    <View style={styles.bookContainer}>
      <View style={styles.strip}></View>
      <View style={[{ backgroundColor: color }, styles.book]}>
        <View style={styles.statusSection}>
          <View
            style={[
              { width: statusPercent, backgroundColor: colors.black, opacity: 0.4 },
              styles.status,
            ]}
          ></View>
        </View>
      </View>
      <Text style={[styles.title, { color: textColor }]}>{shortenedTitle}</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>{shortenedSubtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    alignItems: "center",
    width: layout.components.bookCoverThumb.spacingWidth,
    marginBottom: 10,
  },
  book: {
    width: layout.components.bookCoverThumb.width,
    height: layout.components.bookCoverThumb.height,
    borderRadius: 15,
    justifyContent: "flex-end",
    overflow: "hidden",
    opacity: 0.9,
  },
  strip: {
    height: 5,
    width: "100%",
    backgroundColor: "#FFFFFF",
    opacity: 0.3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  statusSection: {
    backgroundColor: "white",
    opacity: 0.3,
    borderTopColor: "white",
  },
  status: {
    height: 25,
  },
  title: {
    textAlign: "center",
    fontFamily: fonts.main,
    fontWeight: "500",
    fontSize: layout.components.bookCoverThumb.titleFontSize,
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: fonts.main,
    fontWeight: "400",
    fontSize: layout.components.bookCoverThumb.subtitleFontSize,
    marginTop: 2,
  },
});