import { View, StyleSheet, Text } from "react-native";
import React from "react";
import layout from "../config/layout";
import { useThemeColors } from "../config/colors";

export default function Word({ word, id, color }) {
  const colors = useThemeColors();
  return (
    <View style={[ styles.container]}>
      <View style={[ styles.wordContainer, {borderColor: colors.wordBorder} ]}>
        <Text style={[ styles.word, {color: colors.wordBorder} ]}>{word}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginHorizontal: 1, marginVertical: 10,},
  wordContainer:{
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  word: {
    fontSize: layout.fontSize.word,
    fontWeight: "500",
  }
});
