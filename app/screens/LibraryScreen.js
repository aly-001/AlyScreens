import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import colors from "../config/colors";
import { useBooks } from "../context/BooksContext";
import BookCoverThumb from "../components/BookCoverThumb";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import layout from "../config/layout";
import PracticeStartButton from "../components/PracticeStartButton";

const LibraryScreen = () => {
  const navigation = useNavigation();
  const { books, loadBooks, addBook, deleteBook } = useBooks();

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleBookPress = (book) => {
    navigation.navigate("Read", {
      screen: "ReadScreen",
      params: {
        uri: book.uri,
        title: book.title,
        color: book.color,
        status: book.status,
      },
    });
  };

  const handleLongPress = (book) => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteBook(book.uri);
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

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const handleUpload = async () => {
    try {
      console.log("Uploading file");
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/epub+zip",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        console.log("Successfully picked file");
        const sourceUri = result.assets[0].uri;
        const originalName = result.assets[0].name;
        const bookDir = FileSystem.documentDirectory + "books/";
        const destinationUri = bookDir + originalName;
        await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri,
        });
        const fileInfo = await FileSystem.getInfoAsync(destinationUri);
        if (!fileInfo.exists) {
          throw new Error("Failed to copy file to document directory");
        }
        const newBook = {
          uri: destinationUri,
          name: originalName,
          title: originalName.replace(".epub", ""),
          subtitle: "Unknown Author",
          color: getRandomColor(),
          status: 0,
        };
        await addBook(newBook);
        Alert.alert("Success", "EPUB file stored successfully");
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Failed to store EPUB file");
    }
  };

  return (
    <View style={styles.superContainer}>
      <Screen>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Library" />
          </View>

          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.booksContainer}>
                {books.map((book) => (
                  <TouchableOpacity
                    key={book.name}
                    onPress={() => handleBookPress(book)}
                    onLongPress={() => handleLongPress(book)}
                    delayLongPress={500}
                    style={styles.bookWrapper}
                  >
                    <BookCoverThumb
                      title={book.title}
                      subtitle={book.subtitle}
                      color={book.color}
                      status={book.status}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
          </View>
          <View style={styles.startBoxContainer}>
          <TouchableOpacity onPress={handleUpload} style={styles.button}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
        <View style={{paddingHorizontal: 45}}>

        <Text style={{opacity: .5}}>PDF support is coming soon!</Text> 
        <Text style={{opacity: .5}}>Currently only EPUBs work. Please ensure any file conversions comply with applicable copyright laws and terms of use.</Text>
        </View>
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
};

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
  container: {
  },
  scrollContent: {
    padding: 10,
  },
  booksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  bookWrapper: {
    margin: 5,
  },
  upload: {
    // color: colors.appleBlue,
    padding: 20,
    fontSize: 23,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  startBoxContainer: {
    position: "absolute",
    bottom: 130, 
    width: "100%",
    paddingHorizontal: layout.margins.homeScreenWidgets - 15,
    marginTop: 140,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20, // Change this value to adjust the text size
    color: 'dodgerblue',
  },
});

export default LibraryScreen;
