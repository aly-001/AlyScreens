import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useThemeColors } from "../config/colors";

export default function MainButton({ title, onPress }) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.appleBlue },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.title, { color: colors.mainComponentBackground }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 25,
  },
});