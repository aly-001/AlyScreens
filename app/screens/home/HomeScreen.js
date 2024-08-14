import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Animated, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import layout from "../../config/layout";
import MyLibrary from "../../components/MyLibrary";
import BottomWidget from "../../components/BottomWidget";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native-gesture-handler";
import StatBoxMax from "../../components/StatBoxMax";
import { FlashcardProvider } from "../../context/FlashcardContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F38181",
      "#A8D8EA",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const loadBooks = useCallback(async () => {
    try {
      const bookMetadata = await AsyncStorage.getItem("bookMetadata");
      if (bookMetadata) {
        setBooks(JSON.parse(bookMetadata));
      } else {
        const bookDir = FileSystem.documentDirectory + "books/";
        await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
        const bookFiles = await FileSystem.readDirectoryAsync(bookDir);
        const bookList = bookFiles.map((file) => ({
          uri: bookDir + file,
          name: file,
          title: file.replace(".epub", ""),
          subtitle: "Unknown Author",
          color: getRandomColor(),
          status: 0,
        }));
        setBooks(bookList);
        await AsyncStorage.setItem("bookMetadata", JSON.stringify(bookList));
      }
    } catch (error) {
      console.error("Error loading books:", error);
      Alert.alert("Error", "Failed to load books. Please try again.");
    }
  }, []);

  const deleteBook = useCallback(async (uri) => {
    try {
      const bookMetadata = await AsyncStorage.getItem("bookMetadata");
      if (!bookMetadata) {
        throw new Error("No book metadata found");
      }
      let updatedBooks = JSON.parse(bookMetadata);
      const bookIndex = updatedBooks.findIndex(book => book.uri === uri);
      if (bookIndex === -1) {
        throw new Error("Book not found");
      }
      await FileSystem.deleteAsync(uri, { idempotent: true });
      updatedBooks.splice(bookIndex, 1);
      await AsyncStorage.setItem("bookMetadata", JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      console.log(`Book deleted successfully: ${uri}`);
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "Failed to delete the book. Please try again.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const addBook = useCallback(async (newBook) => {
    try {
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
      return true;
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Failed to add the book to your library. Please try again.");
      return false;
    }
  }, [books]);

  const updateBookStatus = useCallback(async (uri, status, cfi) => {
    try {
      const updatedBooks = books.map(book => 
        book.uri === uri ? { ...book, status, cfi } : book
      );
      setBooks(updatedBooks);
      await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  }, [books]);

  const handleBookPress = (bookName) => {
    const book = books.find((b) => b.name === bookName);
    if (book) {
      navigation.navigate("Read", {
        screen: "ReadScreen",
        params: {
          uri: book.uri,
          title: book.title,
          color: book.color,
          status: book.status,
        },
      });
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });


  return (
    <View style={styles.container}>
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
            <FlashcardProvider>
              <StatBoxMax />
            </FlashcardProvider>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Library")}
        >
          <View style={styles.libraryContainer}>
            <MyLibrary books={books} onBookPress={handleBookPress} />
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
            header="Settings"
            IconComponent={(props) => (
              <FontAwesome6
                name="gear"
                size={layout.icons.homeScreenBottomWidget}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
            onPress={() => navigation.navigate("Config")}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
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
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
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