import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import colors from '../config/colors';
import PracticeStatsFooter from '../components/PracticeStatsFooter';

export default function PracticeScreenWord({word, context, statsLearn, statsNew, statsDue}) {
  return (
    <View style={styles.container}>
     <View style={styles.wordContainer}>
        <Text style={styles.word}>{word}</Text> 
      </View> 
      <View style={styles.contextContainer}>
        <Text style={styles.context}>{context}</Text>
      </View>
      <View style={styles.footer}><PracticeStatsFooter newCount={statsNew} learnCount={statsLearn} dueCount={statsDue}/></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.homeScreenBackground,
  },
  wordContainer: {
    marginBottom: 70,
  },
  contextContanier:{
  },
  word: {
    fontSize: 34,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  context: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.75,
  },
  footer:{
    position: "absolute",
    bottom: 20,
  }
});
