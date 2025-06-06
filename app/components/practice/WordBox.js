import { View, StyleSheet, ScrollView, Text } from "react-native";
import React from "react";
import Word from "./Word";
import { useThemeColors } from "../../config/colors";
import layout from "../../config/layout";

export default function WordBox({ words = [], color = "black", title = "", brb = false, brt = false, extraPadding=false}) {
  const colors = useThemeColors();
  return (
    <View style={[
      {backgroundColor: colors.mainComponentBackground, marginBottom: 50, borderRadius: 20}, 
      brt && styles.topBorderRadius,
      brb && styles.bottomBorderRadius,
      extraPadding && {paddingBottom: 30},
    ]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.utilityGrey }]}>{title}</Text>
        <Text style={[styles.headerCount, { color }]}>{words.length}</Text>
      </View>
      <ScrollView horizontal style={styles.wordsContainer}>
        <View style={styles.hiddenStrip}></View>
        {words.map((word) => (
          <Word key={word.id} word={word.word} color={colors.word}/>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBorderRadius: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomBorderRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  hiddenStrip: {
    width: 25,
  },
  wordsContainer: {
    paddingBottom: 10,
    paddingTop: 10,
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerTitle: {
    fontSize: layout.fontSize.dictionary.sectionTitle,
    fontWeight: "600",
  },
  headerCount: {
    fontSize: layout.fontSize.dictionary.sectionTitle,
    fontWeight: "600",
  }
});