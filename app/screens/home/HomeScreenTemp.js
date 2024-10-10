import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import { useThemeColors } from "../../config/colors";
import layout from "../../config/layout";
import MyLibrary from "../../components/MyLibrary";
import BottomWidget from "../../components/BottomWidget";
import { TouchableOpacity } from "react-native-gesture-handler";
import StatBoxMax from "../../components/StatBoxMax";
import { DolphinSR } from "../../../lib/index";
import * as SQLite from "expo-sqlite";
import {
  getAllCards,
  getYoungCards,
  getMatureCards,
} from "../../context/FlashcardContext";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import BookCoverThumb from "../../components/BookCoverThumb";

export default function HomeScreenTemp() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [dolphinSR, setDolphinSR] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [youngCards, setYoungCards] = useState([]);
  const [matureCards, setMatureCards] = useState([]);
  
  const [books, setBooks] = useState([]);
  const bookDirectory = `${FileSystem.documentDirectory}bookjs/`;

  useEffect(() => {
    initializeDatabase();
    loadBooks();
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
        id: row.id,
      }));
      const loadedReviews = reviewsResult.map((row) => ({
        ...JSON.parse(row.data),
        id: row.id,
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
        id: card.id || `card-${Math.random().toString(36).substr(2, 9)}`,
      }));

    setAllCards(processCards(getAllCards(dolphinSRInstance)));
    setYoungCards(processCards(getYoungCards(dolphinSRInstance)));
    setMatureCards(processCards(getMatureCards(dolphinSRInstance)));
  };

  useFocusEffect(
    useCallback(() => {
      initializeDatabase();
      loadBooks();
    }, [])
  );

  const loadBooks = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(bookDirectory);
      if (!dirInfo.exists) {
        console.log('Book directory does not exist, creating it...');
        await FileSystem.makeDirectoryAsync(bookDirectory, { intermediates: true });
        console.log('Book directory created successfully');
      }

      console.log('Reading book directory...');
      const booksList = await FileSystem.readDirectoryAsync(bookDirectory);
      console.log(`Found ${booksList.length} books in the directory`);

      const loadedBooks = await Promise.all(booksList.map(async (bookDir) => {
        const bookInfoPath = `${bookDirectory}${bookDir}/bookInfo.js`;
        try {
          const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
          const bookInfo = JSON.parse(bookInfoContent);
          return { id: bookDir, ...bookInfo };
        } catch (error) {
          console.error(`Failed to load book info for ${bookDir}:`, error);
          return null;
        }
      }));

      setBooks(loadedBooks.filter(book => book !== null));
    } catch (error) {
      console.error('Error in loadBooks:', error);
      Alert.alert('Error', 'Failed to load books. Check console for details.');
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate('Reader', { bookDirName: book.id });
  };

  const handleBookLongPress = (book) => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(`${bookDirectory}${book.id}`, { idempotent: true });
              await loadBooks(); // Refresh the book list
              Alert.alert("Success", "Book deleted successfully");
            } catch (error) {
              console.error("Failed to delete book:", error);
              Alert.alert("Error", "Failed to delete book");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, {backgroundColor: colors.homeScreenBackground}]}>
      <Animated.View style={[styles.screenHeaderContainer, { opacity: headerOpacity }]}>
        <ScreenHeader text="Home" />
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.topWidgetContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Dictionary")}
          >
            <StatBoxMax
              allWordsCount={allCards.length}
              youngWordsCount={youngCards.length}
              matureWordsCount={matureCards.length}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Library")}
        >
          <View style={[styles.libraryContainer]}>
            <MyLibrary books={books} onBookPress={handleBookPress} onBookLongPress={handleBookLongPress} />
          </View>
        </TouchableOpacity>
        <View style={styles.bottomWidgetContainer}>
          <BottomWidget
            style={{
              borderBottomEndRadius:
                layout.borderRadius.homeScreenWidgetsSandwich,
            }}
            header="Help"
            IconComponent={(props) => (
              <FontAwesome5
                name="question"
                size={layout.icons.homeScreenBottomWidget}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
          />
          <BottomWidget
            style={{
              borderBottomStartRadius:
                layout.borderRadius.homeScreenWidgetsSandwich,
            }}
            header="Donate"
            IconComponent={(props) => (
              <FontAwesome6
                name="hand-holding-heart"
                size={layout.icons.homeScreenBottomWidget}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
            onPress={() => navigation.navigate("Donate")} // Added onPress handler
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: layout.margins.homeScreen.betweenHeaderAndWidgets + 60, // Add extra padding to account for the header
  },
  topWidgetContainer: {
    marginHorizontal: layout.margins.homeScreenWidgets / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
  },
  libraryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: layout.margins.homeScreenWidgets,
    marginLeft: 0,
  },
  bottomWidgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
  },
  icon: {
    bottom: 20,
    paddingBottom: 30,
  },
});