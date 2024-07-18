import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from "../components/ScreenHeader";
import Screen from "../components/Screen";
import colors from "../config/colors";
import layout from "../config/layout";
import WordBox from "../components/WordBox";
import PracticeStartButton from "../components/PracticeStartButton";
import { useFlashcards } from "../context/FlashcardContext";

export default function PracticeScreenStart() {
  const { stats, getNextCard, initializeDatabase,  newCards, learningCards, dueCards } = useFlashcards();
  const navigation = useNavigation();

  const handleRefresh = async () => {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
      <Screen>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Practice" />
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox 
              words={newCards.map(card => ({ id: card.id, word: card.front }))} 
              color={colors.newWords} 
              title="New" 
            />
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox
              words={learningCards.map(card => ({ id: card.id, word: card.front }))}
              color={colors.learnWords}
              title="Learn"
            />
          </View>
          <View style={styles.wordBoxContainer}>
            <WordBox 
              words={dueCards.map(card => ({ id: card.id, word: card.front }))} 
              color={colors.dueWords} 
              title="Due" 
            />
          </View>
          <View style={styles.startBoxContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={startReview}>
              <PracticeStartButton text="Start" />
            </TouchableOpacity>
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
  wordBoxContainer: {
    paddingHorizontal: layout.margins.homeScreenWidgets - 15,
    marginBottom: layout.margins.homeScreenWidgets,
  },
  startBoxContainer: {
    paddingHorizontal: layout.margins.homeScreenWidgets - 15,
    marginTop: 140,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 10,
  },
});