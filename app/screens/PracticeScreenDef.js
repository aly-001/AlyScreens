import { View, StyleSheet, Text, Dimensions, Image, SafeAreaView, StatusBar } from "react-native";
import React from "react";
import colors from "../config/colors";
import PracticeStatsFooter from "../components/PracticeStatsFooter";
import PracticeRatingTab from "../components/PracticeRatingTab";
import PracticeDividerLine from "../components/PracticeDividerLine";
import PracticeAudio from "../components/PracticeAudio";

const { width, height } = Dimensions.get("window");

export default function PracticeScreenWord({
  definition,
  word,
  context,
  contextDef,
  statsLearn,
  statsNew,
  statsDue,
  onSelectDifficulty,
}) {
  const handleRatingPress = (rating) => {
    if (onSelectDifficulty) {
      onSelectDifficulty(rating);
    }
  };

  const grey = false; // You can change this to true to test the grey area

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.superContainer}>
        {grey ? (
          <View style={styles.greyArea} />
        ) : (
          <Image 
            source={require('../../assets/composait.webp')} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.container}>
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{word}</Text>
          </View>
          <View style={styles.defContainer}>
            <Text style={styles.def}>{definition}</Text>
          </View>
          <View style={styles.dividerLine}>
            <PracticeDividerLine width="100%" height={2} color={colors.utilityGreyUltraLight} />
          </View>
          <View style={styles.contextContainer}>
            <Text style={styles.context}>{context}</Text>
          </View>
          <View style={styles.defContainer}>
            <Text style={styles.contextDef}>{contextDef}</Text>
          </View>
          <View style={styles.audio}>
            <PracticeAudio />
          </View>
          <View style={styles.footer}>
            <PracticeStatsFooter
              newCount={statsNew}
              learnCount={statsLearn}
              dueCount={statsDue}
            />
          </View>
          <View style={styles.allTabsContainer}>
            <View style={styles.tabContainer}>
              <PracticeRatingTab rating="Again" onPress={handleRatingPress} />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab rating="Hard" onPress={handleRatingPress} />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab rating="Good" onPress={handleRatingPress} />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab rating="Easy" onPress={handleRatingPress} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  superContainer: {
    flex: 1,
  },
  greyArea: {
    position: 'absolute',
    left: (width - 900) / 2,
    width: 900,
    height: 450,
    backgroundColor: colors.utilityGreyUltraLight,
    opacity: .5,
  },
  image: {
    position: 'absolute',
    left: (width - 900) / 2,
    width: 900,
    height: 450,
  },
  container: {
    marginHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  defContainer: {
    width: width * 0.8,
  },
  def: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  contextDef: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  word: {
    marginTop: 200,
    fontSize: 50,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  context: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
  },
  contextContainer: {
    width: width * 0.8,
  },
  audio: {
    position: "absolute",
    bottom: 160,
  },
  footer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
  allTabsContainer: {
    position: "absolute",
    bottom: height * 0.25 - 210,
    right: -40,
  },
  tabContainer: {
    marginBottom: 0,
  },
  dividerLine: {
    marginVertical: 50,
    width: '100%',
    width: width * 0.8,
  },
});