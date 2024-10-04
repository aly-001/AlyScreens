import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useThemeColors } from "../config/colors";
import { Entypo } from '@expo/vector-icons';

export default function Toggle({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useThemeColors();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.mainComponentBackground },
      ]}
      onPress={toggleOpen}
    >
      <View style={styles.header}>
        <Entypo 
          name={isOpen ? "triangle-down" : "triangle-right"} 
          size={24} 
          color={colors.utilityGrey}
        />
        <Text style={[styles.title, { color: colors.utilityGrey }]}>
          {title}
        </Text>
      </View>
      {isOpen && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
});