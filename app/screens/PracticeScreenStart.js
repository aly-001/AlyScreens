import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import ScreenHeader from "../components/ScreenHeader";

import Screen from "../components/Screen";
import colors from "../config/colors";
import layout from "../config/layout";
import WordBox from "../components/WordBox";
import PracticeStartButton from "../components/PracticeStartButton";

// some random words that could be defined words from a book
const newWords = [
  {id: 1, word:"Abate"},
  {id: 2, word: "Benevolent"},
  {id: 3, word: "Cacophony"},
  {id: 4, word: "Deleterious"},
  {id: 5, word: "Ephemeral"},
  {id: 6, word: "Furtive"},
  {id: 7, word: "Gregarious"},
  {id: 8, word: "Hapless"},
  {id: 9, word: "Innocuous"},
  {id: 10, word: "Juxtapose"},
  {id: 11, word: "Kowtow"},
  {id: 12, word: "Languid"},
  {id: 13, word: "Mellifluous"},
  {id: 14, word: "Nefarious"},
]

const learnWords = [
  {id: 1, word: "Adroit"},
  {id: 2, word: "Bucolic"},
  {id: 3, word: "Clandestine"},
  {id: 4, word: "Dichotomy"},
  {id: 5, word: "Ebullient"},
  {id: 6, word: "Fervent"},
  {id: 7, word: "Garrulous"},
  {id: 8, word: "Histrionic"},
  {id: 9, word: "Ineffable"},
  {id: 10, word: "Jubilant"},
]

const dueWords = [
  {id: 1, word: "Alacrity"},
  {id: 2, word: "Banal"},
  {id: 3, word: "Cacophony"},
  {id: 4, word: "Deleterious"},
  {id: 5, word: "Ephemeral"},
]

export default function HomeScreen({}) {
  return (
    <View style={styles.superContainer}>
      <Screen>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Practice" />
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox words={newWords} color={colors.newWords} title="New"/>
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox words={learnWords} color={colors.learnWords} title="Learn"/>
          </View>
 
          <View style={styles.wordBoxContainer}>
            <WordBox words={dueWords} color={colors.dueWords} title="Due"/>
          </View>
 
          <View style={styles.startBoxContainer}>
            <PracticeStartButton/>
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
  wordBoxContainer:{
    paddingHorizontal: layout.margins.practiceScreenPaddingHorizontal, 
    marginBottom:  20,
  },
  startBoxContainer: {
    paddingHorizontal: layout.margins.practiceScreenPaddingHorizontal,
    marginTop: 140,
  }
});
