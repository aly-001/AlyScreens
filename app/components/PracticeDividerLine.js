import { View, StyleSheet } from 'react-native';
import React from 'react';
import colors from "../config/colors";

export default function PracticeDividerLine({ width = '100%', height = 1, color = colors.utilityGrey }) {
  return (
    <View style={[styles.divider, { width, height, backgroundColor: color }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
    borderRadius: 5,
  },
});