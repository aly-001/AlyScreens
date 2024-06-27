import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import ScreenHeader from "../components/ScreenHeader";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import Screen from "../components/Screen";
import StatBox from "../components/StatBox";
import colors from "../config/colors";
import layout from "../config/layout";
import MyLibrary from "../components/MyLibrary";
import BottomWidget from "../components/BottomWidget";

export default function HomeScreen({}) {
  return (
    <View style={styles.superContainer}>
      <Screen>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Home" />
          </View>
          <View style={styles.topWidgetContainer}>
            <StatBox header="All" value={25} valueColor="green" />
            <StatBox header="Learning" value={8} valueColor="blue" />
            <StatBox header="Mature" value={3} valueColor="red" />
          </View>
          <View style={styles.libraryContainer}>
            <MyLibrary />
          </View>
          <View style={styles.bottomWidgetContainer}>
            <BottomWidget
              header="Help"
              IconComponent={(props) => (
                <FontAwesome5
                  name="question"
                  size={65}
                  color={colors.homeScreenIcon}
                  style={{ position: "absolute", top: -30 }}
                  {...props}
                />
              )}
            />
            <BottomWidget
              header="Config"
              IconComponent={(props) => (
                <FontAwesome6
                  name="gear"
                  size={65}
                  color={colors.homeScreenIcon}
                  style={{ position: "absolute", top: -30 }}
                  {...props}
                />
              )}
            />
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  contentContainer: {
    flex: 1,
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: 210,
  },
  headerContainer: {
    position: "absolute",
    top: 30,
    left: layout.margins.homeScreenWidgets,
    zIndex: 1,
  },
  topWidgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
  },
  libraryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
  },
  bottomWidgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 80,
  },
});
