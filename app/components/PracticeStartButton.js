import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../config/colors';
import layout from '../config/layout';

export default function PracticeStartButton({ text, deactivated }) {
  return (
    <View style={[
      styles.container,
      deactivated ? styles.deactivatedContainer : styles.activatedContainer
    ]}>
      <Text style={[
        styles.start,
        deactivated ? styles.deactivatedText : styles.activatedText
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: layout.borderRadius.startButton,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  activatedContainer: {
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  deactivatedContainer: {
    // No shadow for deactivated state
  },
  start: {
    padding: 20,
    fontSize: 23,
    fontWeight: "500",
  },
  activatedText: {
    color: "dodgerblue",
  },
  deactivatedText: {
    color: "grey",
  }
});