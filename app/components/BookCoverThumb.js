import { View, StyleSheet, Text } from "react-native";
import React from "react";
import colors from "../config/colors";
import fonts from "../config/fonts";
import shortenText from "../utils/shortenText"; // Adjust the path according to your file structure
import layout from "../config/layout";

export default function BookCoverThumb({ title, subtitle, color, status }) {
  const statusPercent = status + "%";
  const maxChars = 30; // Example max character count, adjust as needed

  const shortenedTitle = shortenText(title, maxChars);
  const shortenedSubtitle = shortenText(subtitle, maxChars);

  return (
    <>
      <View style={styles.bookContainer}>
        <View style={styles.strip}></View>
        <View style={[{ backgroundColor: color }, styles.book]}>
          <View style={styles.statusSection}>
            <View style={[{ width: statusPercent }, styles.status]}></View>
          </View>
        </View>

        <Text style={styles.title}>{shortenedTitle}</Text>
      </View>
    </>
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
    justifyContent: "center",
    marginBottom: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
    opacity: .9,
  },
  title: {
    textAlign: "center",
    fontFamily: fonts.main,
    fontWeight: "500",
    fontSize: layout.components.bookCoverThumb.titleFontSize,
    color: colors.utilityGrey,
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: fonts.main,
    fontWeight: "500",
    fontSize: 18,
    color: colors.utilityGreyLight,
  },
  statusSection: {
    backgroundColor: "white",
    opacity: 0.3,
    borderTopColor: "white",
  },
  status: {
    height: 25,
    backgroundColor: "black",
    opacity: 0.4,
  },
});
