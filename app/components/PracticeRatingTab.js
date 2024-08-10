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
      onPress={() => onPress(rating)}
      activeOpacity={0.7}
    >
      <View style={styles.outerContainer}>
        <View style={[styles.innerContainer, { backgroundColor: color }]} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
     width: 100,
    marginBottom: 45,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  innerContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.07,
  },
  textContainer: {
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.utilityGrey,
    fontSize: 20,
    fontWeight: 'bold',
  }
});