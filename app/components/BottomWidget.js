import { View, StyleSheet, Text } from "react-native";
import React from "react";
import WidgetHeader from "./WidgetHeader";
import layout from "../config/layout";

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
    marginHorizontal: layout.margins.homeScreenWidgets/2,
    height: 190,
    backgroundColor: "white",
    borderRadius: layout.borderRadius.homeScreenWidgets,
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
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
