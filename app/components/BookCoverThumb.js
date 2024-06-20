import { View, StyleSheet, Text } from "react-native";
import React from "react";
import colors from "../config/colors";
import fonts from "../config/fonts";
import shortenText from "../utils/shortenText"; // Adjust the path according to your file structure

export default function BookCoverThumb({ title, subtitle, color, status }) {
  const statusPercent = status + "%";
  const maxChars = 20; // Example max character count, adjust as needed

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
        <Text style={styles.subtitle}>{shortenedSubtitle}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    alignItems: "center",
    width: 185,
    marginBottom: 10,
  },
  book: {
    width: 150,
    height: 190,
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
    fontSize: 18,
    color: colors.utilityBlue,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: fonts.main,
    fontWeight: "500",
    fontSize: 18,
    color: colors.utilityBlueLight,
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
  strip: {
    backgroundColor: "white",
    zIndex: 0,
    height: 155,
    width: 2,
    position: "absolute",
    top: 0,
    opacity: 0.3,
    left: 25,
  },
});
