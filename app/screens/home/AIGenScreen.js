import React, { useState } from "react";
import { View, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, Text } from "react-native";
import { useThemeColors } from "../../config/colors";
import Screen from "../../components/Screen";
import ScreenHeader from "../../components/ScreenHeader";
import Toggle from "../../components/Toggle";
import MainButton from "../../components/MainButton";
import Slider from "@react-native-community/slider";

const AIGenScreen = () => {
  const colors = useThemeColors();
  const [contentsText, setContentsText] = useState('Jess is an insurance agent living in New York. She encounters an evil billionaire Davis who sells her data...');
  const [difficulty, setDifficulty] = useState(5);
  const [style, setStyle] = useState('Tom Wolfe');
  const [length, setLength] = useState(50);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={[
          styles.superContainer,
          { backgroundColor: colors.homeScreenBackground },
        ]}
      >
        <Screen>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Generate" />
            <View style={styles.container}>
              <View style={styles.toggleContainer}>
                <Toggle title="Difficulty">
                  <View style={styles.sliderContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={1}
                      maximumValue={10}
                      step={1}
                      value={difficulty}
                      onValueChange={setDifficulty}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor="#000000"
                    />
                    <Text style={styles.sliderValue}>{difficulty}</Text>
                  </View>
                </Toggle>
              </View>
              <View style={styles.toggleContainer}>
                <Toggle title="Style">
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: "#f5f5f5", color: colors.utilityGrey }
                    ]}
                    placeholder="Enter style details"
                    placeholderTextColor={colors.utilityGrey}
                    value={style}
                    onChangeText={setStyle}
                    multiline={true}
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </Toggle>
              </View>
              <View style={styles.toggleContainer}>
                <Toggle title="Length">
                  <View style={styles.sliderContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={10}
                      maximumValue={100}
                      step={10}
                      value={length}
                      onValueChange={setLength}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor="#000000"
                    />
                    <Text style={styles.sliderValue}>{`${length} pages`}</Text>
                  </View>
                </Toggle>
              </View>
              <View style={styles.toggleContainer}>
                <Toggle title="Contents">
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: "#f5f5f5", color: colors.utilityGrey }
                    ]}
                    placeholder="Enter content details"
                    placeholderTextColor={colors.utilityGrey}
                    value={contentsText}
                    onChangeText={setContentsText}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </Toggle>
              </View>
              <View style={styles.buttonContainer}>
                <MainButton title="Generate Book" />
              </View>
            </View>
          </View>
        </Screen>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 10,
  },
  container: {
    padding: 20,
    paddingTop: 50,
    height: "100%",
  },
  toggleContainer: {
    marginBottom: 0,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    marginLeft: 10,
    fontSize: 16,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
    height: 80,
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    bottom: 210,
  }
});

export default AIGenScreen;