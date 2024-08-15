import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { useFlashcards } from "../context/FlashcardContext";
import WidgetHeader from "./WidgetHeader";
import layout from "../config/layout";
import { useThemeColors } from "../config/colors";
import text from "../config/text";

export default function StatBoxMax() {
  const colors = useThemeColors();
  const { allCards, youngCards, matureCards } = useFlashcards();

  return (
    <View style={[styles.container, {backgroundColor: colors.mainComponentBackground}]}>
      <WidgetHeader text="Dictionary" noMargin />
      <View style={styles.segmentContainer}>
        <View style={styles.statSegment}>
          <View style={styles.labelTextBox}>
            <Text style={[styles.labelText, {color: colors.utilityGrey}]}>{text.homeScreen.dictionaryStatsTags.allWords}</Text>
          </View>
          <View style={[styles.numberTextBox, {color: colors.utilityGrey}]}>
            <Text style={[styles.numberText, {color: colors.utilityGrey}]}>{allCards.length}</Text>
          </View>
        </View>
        <View style={[styles.divider, {backgroundColor: colors.divider}]} />
        <View style={styles.statSegment}>
          <View style={styles.labelTextBox}>
            <Text style={[styles.labelText, {color: colors.utilityGrey}]}>{text.homeScreen.dictionaryStatsTags.youngWords}</Text>
          </View>
          <View style={[styles.numberTextBox]}>
            <Text style={[styles.numberText, {color: colors.utilityGrey}]}>{youngCards.length}</Text>
          </View>
        </View>
        <View style={[styles.divider, {backgroundColor: colors.divider}]} />
        <View style={styles.statSegment}>
          <View style={styles.labelTextBox}>
            <Text style={[styles.labelText, {color: colors.utilityGrey}]}>{text.homeScreen.dictionaryStatsTags.matureWords}</Text>
          </View>
          <View style={[styles.numberTextBox]}>
            <Text style={[styles.numberText, {color: colors.utilityGrey}]}>{matureCards.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.borderRadius.homeScreenWidgets,
    borderBottomEndRadius: layout.borderRadius.homeScreenWidgetsSandwich,
    borderBottomStartRadius: layout.borderRadius.homeScreenWidgetsSandwich,

    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  segmentContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  divider: {
    width: 1,
    marginBottom: 40,
    height: 40,
    top: 30,
  },
  statSegment: {
    top: -10,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
  },
  labelTextBox: {
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    color: "#666",
    // Add any additional styling for the label text here
  },
  numberTextBox: {
    marginTop: 5,
    // Add any additional styling for the number box here
  },
  numberText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    // Add any additional styling for the number text here
  },
});