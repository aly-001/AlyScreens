import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import layout from "../config/layout";
import { useThemeColors } from "../config/colors";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for heart icon

export default function PracticeStartButton({
  text,
  deactivated,
  onPress,
  width = 120,
  hearts = false,
}) {
  const colors = useThemeColors();
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          { backgroundColor: colors.mainComponentBackground, width: width },
          deactivated ? styles.deactivatedContainer : styles.activatedContainer,
        ]}
        disabled={deactivated}
      >
        <Text
          style={[
            styles.start,
            { color: deactivated ? "grey" : colors.highlightColor }, // Use highlightColor
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
      {hearts && (
        <View style={styles.heartContainer}>
        <FontAwesome
          name="heart"
          size={24}
          color={colors.highlightColor}
            style={styles.heartIcon}
          />
          <View style={styles.heartContainer}>
        <FontAwesome
          name="heart"
          size={34}
          color={colors.highlightColor}
            style={[styles.heartIcon, {transform: [{ rotate: '0deg' }], top: 30, right: 10}]}
          />
        </View>
        </View>
        
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(245, 245, 245, 1)", // Matching navigation button background
    height: 50,
    borderRadius: 25, // Same border radius as navigation buttons
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10, // Optional: Adds some spacing
    flexDirection: "row", // Align text and icon in a row
    top: -30,
  },
  activatedContainer: {
    // Add any specific styles for activated state if needed
  },
  deactivatedContainer: {
    opacity: 0.6, // Visually indicate deactivated state
  },
  start: {
    fontSize: 18, // Adjusted font size
    fontWeight: "500",
  },
  heartIcon: {
    marginLeft: 5, // Add some space between text and heart icon
  },
  heartContainer: {
    position: 'absolute',
    top: -45,
    right: '56%',
    marginLeft: -25, // Half of the heart size to center it
    // rotate the heart icon
    transform: [{ rotate: '-10deg' }],
  },
});
