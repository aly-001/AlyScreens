import { View, StyleSheet, Text, SafeAreaView, StatusBar } from "react-native";
import React from "react";
import colors from "../config/colors";
import PracticeStatsFooter from "../components/PracticeStatsFooter";
import PracticeDividerLine from "../components/PracticeDividerLine";

export default function PracticeScreenWord({
  word,
  context,
  statsLearn,
  statsNew,
  statsDue,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.superContainer}>
        <View style={styles.container}>
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{word}</Text>
          </View>
          <View style={styles.dividerLine}>
            <PracticeDividerLine width="100%" height={2} color={colors.utilityGreyUltraLight} />
          </View>
          <View style={styles.contextContainer}>
            <Text style={styles.context}>{context}</Text>
          </View>
          <View style={styles.footer}>
            <PracticeStatsFooter
              newCount={statsNew}
              learnCount={statsLearn}
              dueCount={statsDue}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  superContainer: {
    flex: 1,
  },
  container: {
    marginHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  wordContainer: {
  },
  contextContainer: {
  },
  word: {
    fontSize: 50,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  context: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
  },
  footer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
  },
  dividerLine: {
    marginVertical: 50,
    width: '100%',
  },
});