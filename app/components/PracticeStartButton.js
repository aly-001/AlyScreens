import { View, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../config/colors';

export default function PracticeStartButton({}) {
  return (
    <View style={styles.container}>
      <Text style={styles.start}>Start</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#e0e0e0",
    borderWidth: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  start: {
    // color: colors.appleBlue,
    padding: 20,
    fontSize: 23,
    fontWeight: "600",
    color: colors.utilityGrey,
  }
});
