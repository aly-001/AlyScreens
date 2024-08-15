import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useThemeColors } from "../../config/colors";

const AppearanceScreen = () => {
  const colors = useThemeColors();
  const { settings, updateSettings } = useSettingsContext();

  const themeOptions = ["Light", "Dark", "System"];

  const handleThemeChange = (event) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    const newTheme = themeOptions[selectedIndex].toLowerCase();
    updateSettings({ theme: newTheme });
  };

  const currentThemeIndex = themeOptions.findIndex(
    (option) => option.toLowerCase() === settings.theme
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.homeScreenBackground}}>

    <View
      style={[
        styles.container,
      ]}
    >
      <View style={[styles.group, {backgroundColor: colors.mainComponentBackground}]}>
        <View style={styles.description}>
          <Text style={[styles.descriptionText, { color: colors.utilityGrey }]}>
            THEME
          </Text>
        </View>
        <SegmentedControl
          appearance={colors.appearanceSwitch}
          values={themeOptions}
          selectedIndex={currentThemeIndex}
          onChange={handleThemeChange}
          style={styles.segmentedControl}
        />
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  group: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  segmentedControl: {
  },
  description: {
    flex: 1,
    position: "absolute",
    top: -22,
    left: 15,
    opacity: 0.6,
  },
  descriptionText: {
    fontSize: 12,
  },
});

export default AppearanceScreen;
