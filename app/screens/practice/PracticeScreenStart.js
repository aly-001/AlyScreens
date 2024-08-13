import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import layout from "../../config/layout";
import WordBox from "../../components/WordBox";
import PracticeStartButton from "../../components/PracticeStartButton";
import { useFlashcards } from "../../context/FlashcardContext";

export default function PracticeScreenStart() {
  const {
    stats,
    getNextCard,
    initializeDatabase,
    newCards,
    learningCards,
    laterCards,
    overdueCards,
    dueCards,
  } = useFlashcards();
  const navigation = useNavigation();

  const handleRefresh = async () => {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  const startReview = () => {
    getNextCard();
    navigation.navigate("Word");
  };

  return (
    <View style={styles.superContainer}>
      <StatusBar hidden={true} />
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Practice" />
          </View>
          <View style={styles.allBoxContainer}>
            <View style={styles.wordBoxContainer}>
              <WordBox
                brt={true}
                words={newCards.map((card) => ({
                  id: card.id,
                  word: card.front,
                }))}
                color={colors.newWords}
                title="New"
              />
            </View>
            <View style={styles.wordBoxContainer}>
              <WordBox
                words={learningCards.map((card) => ({
                  id: card.id,
                  word: card.front,
                }))}
                color={colors.learnWords}
                title="Learn"
              />
            </View>
            <View style={styles.wordBoxContainer}></View>
            <View style={styles.wordBoxContainer}>
              <WordBox
                extraPadding={true}
                brb={true}
                words={dueCards.concat(overdueCards).map((card) => ({
                  id: card.id,
                  word: card.front,
                }))}
                color={colors.dueWords}
                title="Due"
              />
            </View>
          </View>
        </ScrollView>
        {newCards.length === 0 &&
        learningCards.length === 0 &&
        dueCards.length === 0 &&
        overdueCards.length === 0 ? (
          <View style={styles.startBoxContainer}>
            <PracticeStartButton text="Start" deactivated={true} />
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.5} onPress={startReview} style={styles.startBoxContainer}>
            <PracticeStartButton text="Start" deactivated={false} />
          </TouchableOpacity>
        )}
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
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: 210,
    paddingBottom: 120, // Add extra padding at the bottom to account for the start box
  },
  headerContainer: {
    position: "absolute",
    marginBottom: 10,
    top: 18,
    left: 18,
  },
  allBoxContainer: {
    borderRadius: 20,
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  wordBoxContainer: {
    paddingHorizontal: layout.margins.homeScreenWidgets - 15,
  },
  startBoxContainer: {
    position: "absolute",
    bottom: layout.margins.practiceScreenStart.startButton, // Position 100px from the bottom
    left: 0,
    right: 0,
    paddingHorizontal: layout.margins.practiceScreenStart.startButtonHorizontal,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 10,
  },
});