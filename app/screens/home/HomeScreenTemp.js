import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { useThemeColors } from "../../config/colors";
import layout from "../../config/layout";
import MyLibrary from "../../components/MyLibrary";
import BottomWidget from "../../components/BottomWidget";
import StatBoxMax from "../../components/StatBoxMax";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { readBookColor, readBookTitle } from "../../nativeReader/BookUtils";

export default function HomeScreenTemp() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [dolphinSR, setDolphinSR] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [youngCards, setYoungCards] = useState([]);
  const [matureCards, setMatureCards] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    initializeDatabase();
    fetchBooks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const initializeDatabase = async () => {
    try {
      const database = SQLite.openDatabase("flashcards.db");

      database.transaction(tx => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS masters (id TEXT PRIMARY KEY NOT NULL, data TEXT);
          CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY NOT NULL, data TEXT);
          `,
          [],
          () => {
            console.log("Tables created successfully");
          },
          (txObj, error) => {
            console.error("Error creating tables:", error);
          }
        );
      });

      setDolphinSR(new DolphinSR(database));
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const booksDir = FileSystem.documentDirectory + "bookjs/";
      const dirInfo = await FileSystem.getInfoAsync(booksDir);

      if (!dirInfo.exists) {
        console.log("Books directory does not exist.");
        setBooks([]);
        return;
      }

      const dirContents = await FileSystem.readDirectoryAsync(booksDir);
      const bookDirs = dirContents.filter(item => item !== "." && item !== "..");

      const fetchedBooks = await Promise.all(bookDirs.map(async (bookDirName) => {
        const bookDir = `${booksDir}${bookDirName}/`;
        const color = await readBookColor(bookDir);
        const title = await readBookTitle(bookDir);
        return {
          name: bookDirName,
          title: title,
          subtitle: "Your Subtitle Here",
          color: color,
          status: 0,
        };
      }));

      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate("Reader", {
      bookDirName: book.name,
    });
  };

  const handleLibraryPress = () => {
    navigation.navigate("Library");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.homeScreenBackground }]}>
      <ScreenHeader />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.topWidgetContainer}>
          <StatBoxMax value={allCards.length} label="All Cards" />
          <StatBoxMax value={youngCards.length} label="Young Cards" />
          <StatBoxMax value={matureCards.length} label="Mature Cards" />
        </View>
        <MyLibrary 
          books={books} 
          onBookPress={handleBookPress} 
          onPressLibrary={handleLibraryPress}
        />
        <BottomWidget />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Ensure this matches your theme
  },
  scrollContent: {
    padding: 10,
    paddingVertical: 30,
  },
  topWidgetContainer: {
    marginHorizontal: layout.margins.homeScreenWidgets / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
  },
});