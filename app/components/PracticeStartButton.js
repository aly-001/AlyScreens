import { View, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../config/colors';
import layout from '../config/layout';

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
    justifyContent: "center",
    alignItems: "center",

    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  start: {
    // color: colors.appleBlue,
    padding: 20,
    fontSize: 23,
    fontWeight: "600",
    color: colors.utilityGrey,
  }
});
