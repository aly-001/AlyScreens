import { View, StyleSheet, Text } from "react-native";
import React from "react";
import WidgetHeader from "./WidgetHeader";
import borderRadius from "../config/borderRadius";
import margins from "../config/margins";
import shadows from "../config/shadows";

export default function BottomWidget({ header, IconComponent, iconColor="#000" }) {
  return (
    <View style={styles.container}>
      <WidgetHeader text={header} />
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: margins.homeScreenWidgets / 2,
    height: 190,
    backgroundColor: "white",
    borderRadius: borderRadius.homeScreenWidgets,

    shadowColor: shadows.homeScreenWidgets.shadowColor,
    shadowOffset: shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: shadows.homeScreenWidgets.shadowRadius,
    elevation: shadows.homeScreenWidgets.elevation,
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
   },

   icon: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial',
    fontSize: 50,
    position: 'absolute',
    fontWeight: 'bold',
    opacity: 0.5,
  }
});
