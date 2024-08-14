import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useThemeColors } from "../config/colors";
import layout from "../config/layout";

export default function PracticeRatingTab({ rating, onPress }) {
  const colors = useThemeColors();
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
          <Text style={[styles.text, {color: colors.utilityGrey}]}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
     width: layout.components.practiceRatingTab.width,
    marginBottom: layout.components.practiceRatingTab.marginBottom,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  innerContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.07,
  },
  textContainer: {
    paddingVertical: layout.components.practiceRatingTab.textContainerPaddingVertical,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: layout.components.practiceRatingTab.textFontSize,
    fontWeight: 'bold',
  }
});