import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useThemeColors } from "../../config/colors";
import Screen from "../../components/Screen";
import ScreenHeader from "../../components/ScreenHeader";
import layout from "../../config/layout";
import { DolphinSR } from "../../../lib/index";
import * as SQLite from "expo-sqlite";
import {
  getAllCards,
  getYoungCards,
  getMatureCards,
} from "../../context/FlashcardContext";
import Word from "../../components/Word";
import FlashcardBackModal from "../../components/FlashcardBackModal";

const DictionaryScreen = () => {
  const colors = useThemeColors();
  const [dolphinSR, setDolphinSR] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [youngCards, setYoungCards] = useState([]);
  const [matureCards, setMatureCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync("flashcards.db");

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY, data TEXT);
        CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, data TEXT);
      `);

      const dolphinSRInstance = new DolphinSR();
      setDolphinSR(dolphinSRInstance);
      await loadDeck(database, dolphinSRInstance);
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  };

  const loadDeck = async (database, dolphinSRInstance) => {
    try {
      const mastersResult = await database.getAllAsync("SELECT * FROM masters");
      const reviewsResult = await database.getAllAsync("SELECT * FROM reviews");

      const loadedMasters = mastersResult.map((row) => ({
        ...JSON.parse(row.data),
        id: row.id, // Ensure each master has an id
      }));
      const loadedReviews = reviewsResult.map((row) => ({
        ...JSON.parse(row.data),
        id: row.id, // Ensure each review has an id
        ts: new Date(JSON.parse(row.data).ts),
      }));

      dolphinSRInstance.addMasters(...loadedMasters);
      dolphinSRInstance.addReviews(...loadedReviews);

      updateWords(dolphinSRInstance);
    } catch (error) {
      console.error("Load deck error:", error);
      console.error("Error stack:", error.stack);
    }
  };

  const updateWords = (dolphinSRInstance) => {
    const processCards = (cards) =>
      cards.map((card) => ({
        ...card,
        id: card.id || `card-${Math.random().toString(36).substr(2, 9)}`, // Ensure each card has a unique id
      }));

    setAllCards(processCards(getAllCards(dolphinSRInstance)));
    setYoungCards(processCards(getYoungCards(dolphinSRInstance)));
    setMatureCards(processCards(getMatureCards(dolphinSRInstance)));
  };

  const renderCards = (cards) => {
    return cards
      .map((card) => {
        try {
          const frontData = JSON.parse(card.front);
          return (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card)}
            >
              <Word word={frontData.word} color={colors.word} />
            </TouchableOpacity>
          );
        } catch (error) {
          console.error("Error parsing card front:", error);
          return null;
        }
      })
      .filter(Boolean);
  };

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const renderSection = (title, cards) => (
    <View style={[styles.scrollViewContainer, {backgroundColor: colors.mainComponentBackground}]} key={title}>
      <Text style={[styles.sectionTitle, { color: colors.utilityGrey }]}>
        {title} ({cards.length})
      </Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.wordsContainer}>{renderCards(cards)}</View>
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.superContainer, {backgroundColor: colors.homeScreenBackground}]}>
      <Screen>
        <View style={styles.headerContainer}>
          <ScreenHeader text="Dictionary" />
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
            {renderSection("All Words", allCards)}
            {renderSection("Young Words", youngCards)}
            {renderSection("Mature Words", matureCards)}
          </View>
        </ScrollView>
      </Screen>
      <FlashcardBackModal
        visible={modalVisible}
        card={selectedCard}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 30,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    marginHorizontal: layout.margins.dictionaryScreen.widgetsHorizontal / 2,
    marginBottom: layout.margins.dictionaryScreen.widgetsVertical,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderRadius: layout.borderRadius.dictionaryScreenWidgets,
  },
  sectionTitle: {
    fontSize: layout.fontSize.dictionary.sectionTitle,
    fontWeight: "bold",
    marginBottom: 10,
    color: "purple",
  },
  scrollView: {
    maxHeight: layout.margins.dictionaryScreen.maxScrollViewHeight,
    borderRadius: 10,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
  },
});

export default DictionaryScreen;
