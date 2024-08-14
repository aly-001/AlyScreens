import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { useThemeColors } from '../config/colors';

export default function PracticeStatsFooter({ newCount, learnCount, dueCount }) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
     <Text style={[ styles.count , {color: colors.newWords}]}>{newCount}</Text> 
     <Text style={[ styles.count , {color: colors.learnWords}]}>{learnCount}</Text> 
     <Text style={[ styles.count , {color: colors.dueWords}]}>{dueCount}</Text> 

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    justifyContent: "space-around",
    alignItems: "center",
    width: 180,
    height: 60,
  },
  count: {
    fontSize: 20,
    fontWeight: "600",
  },
});