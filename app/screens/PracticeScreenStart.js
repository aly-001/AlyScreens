import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import ScreenHeader from "../components/ScreenHeader";

import Screen from "../components/Screen";
import colors from "../config/colors";
import layout from "../config/layout";
import WordBox from "../components/WordBox";
import PracticeStartButton from "../components/PracticeStartButton";

// some random words that could be defined words from a book
const newWords = [
  { id: 1, word: "Pourpre" },
  { id: 2, word: "Composait" },
];

const learnWords = [
  { id: 1, word: "Éblouissant" },
  { id: 2, word: "Vengeance" },
  { id: 3, word: "Trésor" },
  { id: 4, word: "Château d'If" },
  { id: 5, word: "Intrigue" },
  { id: 6, word: "Honneur" },
  { id: 7, word: "Conspiration" },
  { id: 8, word: "Duel" },
  { id: 9, word: "Aristocrate" },
  { id: 10, word: "Emprisonnement" },
  { id: 11, word: "Rédemption" },
  { id: 12, word: "Mascarade" }
];

const dueWords = [
  { id: 1, word: "Éphémère" },
  { id: 2, word: "Mélancolie" },
  { id: 3, word: "Subterfuge" }
];

export default function HomeScreen({}) {
  return (
    <View style={styles.superContainer}>
      <Screen>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Practice" />
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox words={newWords} color={colors.newWords} title="New" />
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox
              words={learnWords}
              color={colors.learnWords}
              title="Learn"
            />
          </View>

          <View style={styles.wordBoxContainer}>
            <WordBox words={dueWords} color={colors.dueWords} title="Due" />
          </View>

          <View style={styles.startBoxContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => console.log("Pressed")}
            >
              <PracticeStartButton />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  contentContainer: {
    flex: 1,
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: 210,
  },
  headerContainer: {
    position: "absolute",
    top: 30,
    left: layout.margins.homeScreenWidgets,
    zIndex: 1,
  },
  wordBoxContainer: {
    paddingHorizontal: layout.margins.homeScreenWidgets -15,
    marginBottom: (layout.margins.homeScreenWidgets),
  },
  startBoxContainer: {
    paddingHorizontal: layout.margins.homeScreenWidgets - 15,
    marginTop: 140,
  },
});
