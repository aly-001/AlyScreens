import { View, StyleSheet, Text } from "react-native";
import React from "react";

export default function Word({ word, id, color }) {
  return (
    <View style={[ styles.container]}>
      <View style={[ styles.wordContainer, {borderColor: color} ]}>
        <Text style={[ styles.word, {color: color} ]}>{word}</Text>
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
    fontSize: 20,
    fontWeight: "500",
  }
});
