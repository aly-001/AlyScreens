import { View, StyleSheet, ScrollView, Text } from "react-native";
import React from "react";
import Word from "./Word";
import colors from "../config/colors";
import layout from "../config/layout";

export default function WordBox({ words = [], color = "black", title = "" }) {
  return (
    <View style={styles.container}>
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
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#e0e0e0",
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  hiddenStrip: {
    width: 25,
  },
  wordsContainer: {
    paddingBottom: 30,
    paddingTop: 20,
    opacity: .6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "600",
  },
  headerCount: {
    fontSize: 23,
    fontWeight: "600",
  }
});