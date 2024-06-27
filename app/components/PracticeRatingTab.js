import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../config/colors";

export default function PracticeRatingTab({ rating, onPress }) {
  let color = rating === "Again" ? colors.tabs.again 
            : rating === "Hard" ? colors.tabs.hard 
            : rating === "Good" ? colors.tabs.good 
            : colors.tabs.easy;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: color }]}
      onPress={() => onPress(rating)}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{rating}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,  
    marginBottom: 45,
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    opacity: 0.70,
  },
  text: {
    color: "white",
    fontSize: 20,
  }
});