import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";

import Screen from "../components/Screen";
import colors from "../config/colors";
import MyLibrary from "../components/MyLibrary";
import StatBox from "../components/StatBox";
import margins from "../config/margins";
import BottomWidget from "../components/BottomWidget";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen({}) {
  return (
    <View style={styles.superContainer}>
      <Screen>
        <View style={styles.container}>
          <View style={styles.statBoxContainer}>
            <StatBox
              style={styles.statBox}
              header="All"
              value="25"
              valueColor="blue"
            />
            <StatBox
              style={styles.statBox}
              header="Learning"
              value="8"
              valueColor="green"
            />
            <StatBox
              style={styles.statBox}
              header="Mature"
              value="3"
              valueColor="red"
            />
          </View>
          <View style={styles.myLibraryContainer}>
            <MyLibrary />
          </View>
          <View style={styles.statBoxContainer}>
            <BottomWidget
              header="Help"
              IconComponent={(props) => (
                <FontAwesome5
                  name="question"
                  size={65}
                  color={colors.homeScreenIcon}
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
                  {...props}
                />
              )}
            />
          </View>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  statBoxContainer: {
    marginHorizontal: margins.homeScreenWidgets / 2,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "dodgerblue",
  },
  myLibraryContainer: {
    marginHorizontal: margins.homeScreenWidgets /2,
    height: 400,
  },
  container: {
    flex: 1,
  },
});
