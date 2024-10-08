import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import colors, { useThemeColors } from "../config/colors";
import BookCoverThumb from "../components/BookCoverThumb";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import layout from "../config/layout";
import {
  loadEpubFromUri,
  parseContainerXml,
  parseContentOpf,
  parseTableOfContents,
  extractBookTitle,
  processHtmlContent,
} from "./epubHandler";
import { hexToHSL, generateUniqueSoftColor } from "./BookUtils";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


function NativeLibrary() {
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();
  const bookDirectory = `${FileSystem.documentDirectory}bookjs/`;
  const colors = useThemeColors(); // Use the hook to get theme colors

  useEffect(() => {
    loadBooks();
    // Uncomment the line below to delete all books
    // deleteAllBooks();
  }, []);

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
        const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
        const bookInfo = JSON.parse(bookInfoContent);
        return { id: bookDir, ...bookInfo };
      }));

      setBooks(loadedBooks);

      // await logBookjsContents(bookDirectory);
    } catch (error) {
      console.error('Error in loadBooks:', error);
      Alert.alert('Error', 'Failed to load books. Check console for details.');
    }
  };

  const logBookjsContents = async (directory) => {
    try {
      console.log(`Contents of ${directory}:`);
      const contents = await FileSystem.readDirectoryAsync(directory);
      for (const item of contents) {
        const itemPath = `${directory}${item}`;
        const itemInfo = await FileSystem.getInfoAsync(itemPath);
        if (itemInfo.isDirectory) {
          console.log(`  Directory: ${item}`);
          await logBookjsContents(itemPath + '/');
        } else {
          console.log(`  File: ${item}`);
          if (item === 'bookInfo.js') {
            const fileContents = await FileSystem.readAsStringAsync(itemPath);
            console.log(`Contents of ${itemPath}:`, fileContents);
          }
        }
      }
    } catch (error) {
      console.error(`Error logging contents of ${directory}:`, error);
    }
  };

  const deleteAllBooks = async () => {
    try {
      console.log('Deleting all books...');
      const dirInfo = await FileSystem.getInfoAsync(bookDirectory);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(bookDirectory, { idempotent: true });
        console.log('All books deleted successfully');
        setBooks([]);
        Alert.alert('Success', 'All books have been deleted from your library.');
      } else {
        console.log('Book directory does not exist, nothing to delete');
      }
    } catch (error) {
      console.error('Error in deleteAllBooks:', error);
      Alert.alert('Error', 'Failed to delete all books. Check console for details.');
    }
  };

  const loadAndSaveEpub = async (fileUri) => {
    try {
      console.log('Loading EPUB from URI:', fileUri);
      const zip = await loadEpubFromUri(fileUri);
      console.log('EPUB loaded successfully');

      console.log('Parsing container.xml...');
      const rootfilePath = await parseContainerXml(zip);
      console.log('Root file path:', rootfilePath);

      console.log('Parsing content.opf...');
      const { metadata, manifestItems, spineItems } = await parseContentOpf(zip, rootfilePath);
      console.log('Content.opf parsed successfully');

      // Extract book title with type checking
      const bookTitleRaw = extractBookTitle(metadata);
      let bookTitle = '';

      if (typeof bookTitleRaw === 'string') {
        bookTitle = bookTitleRaw;
      } else if (bookTitleRaw && typeof bookTitleRaw === 'object') {
        bookTitle = bookTitleRaw['#text'] || 'Unknown_Title';
      } else {
        bookTitle = 'Unknown_Title';
      }

      console.log('Extracted book title:', bookTitle);

      // Generate book ID safely with Unicode support
      let bookId = bookTitle
        .trim()
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/[^\p{L}\p{N}_-]/gu, ''); // Remove unsupported characters

      console.log('Generated book ID after regex:', bookId);

      // Fallback if bookId is empty
      if (!bookId) {
        const timestamp = Date.now();
        bookId = `book_${timestamp}`;
        console.warn('Book ID was empty after regex. Generated fallback book ID:', bookId);
      }

      console.log('Final book ID:', bookId);

      const bookDir = `${bookDirectory}${bookId}/`;
      console.log('Checking if book directory exists:', bookDir);
      const dirInfo = await FileSystem.getInfoAsync(bookDir);
      if (dirInfo.exists) {
        console.log('Book directory already exists');
        Alert.alert('Duplicate Book', `The book "${bookTitle}" already exists.`);
        return;
      }

      console.log('Creating book directory...');
      await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
      console.log('Book directory created successfully');

      // Extract existing colors from the current books
      const existingColors = books.map(book => book.color);
      console.log('Existing colors:', existingColors);

      // Create a set of used hues based on existing colors
      const usedHues = new Set();
      existingColors.forEach(hex => {
        const hsl = hexToHSL(hex);
        if (hsl) {
          usedHues.add(Math.round(hsl.h));
        }
      });

      // Generate a unique soft color
      const randomColor = generateUniqueSoftColor(existingColors, usedHues);
      console.log('Generated unique soft color for the book:', randomColor);

      const bookInfo = {
        title: bookTitle,
        color: randomColor, // This color is now unique and soft
      };

      console.log('Saving book info...');
      const bookInfoData = JSON.stringify(bookInfo, null, 2);
      await FileSystem.writeAsStringAsync(`${bookDir}bookInfo.js`, bookInfoData);
      console.log('Book info saved successfully');

      let chaptersList = [];
      try {
        console.log('Parsing table of contents...');
        chaptersList = await parseTableOfContents(zip, manifestItems);
        console.log('Table of contents parsed successfully');
      } catch (error) {
        console.warn('Error parsing TOC:', error);
        console.warn('TOC not found, using spine items as fallback.');
        chaptersList = spineItems.map((itemref, index) => {
          const manifestItem = manifestItems.find((item) => item.id === itemref.idref);
          return {
            id: manifestItem.id,
            label: `Section ${index + 1}`,
            contentSrc: manifestItem.href,
            index: index,
          };
        });
        console.log('Generated chapters list from spine items');
      }

      console.log('Saving table of contents...');
      const tocData = JSON.stringify({ chapters: chaptersList }, null, 2);
      await FileSystem.writeAsStringAsync(`${bookDir}toc.js`, tocData);
      console.log('Table of contents saved successfully');

      console.log('Processing and saving chapters...');
      for (let i = 0; i < chaptersList.length; i++) {
        const chapter = chaptersList[i];
        console.log(`Processing chapter ${i + 1}:`, chapter.label);
        const contentSrc = chapter.contentSrc;

        const chapterPath = resolvePath(rootfilePath, contentSrc);
        console.log('Resolved chapter path:', chapterPath);

        console.log('Reading chapter content...');
        const htmlText = await zip.file(chapterPath).async('text');
        console.log('Chapter content read successfully');

        console.log('Processing HTML content...');
        const parsedContent = processHtmlContent(htmlText);
        console.log('HTML content processed successfully');

        const chapterFileName = `ch${String(i + 1).padStart(2, '0')}.js`;
        console.log('Saving processed chapter:', chapterFileName);
        const chapterData = JSON.stringify(parsedContent, null, 2);
        await FileSystem.writeAsStringAsync(`${bookDir}${chapterFileName}`, chapterData);
        console.log('Chapter saved successfully');

        chaptersList[i].contentSrc = chapterFileName;
      }

      console.log('Saving updated table of contents...');
      const updatedTocData = JSON.stringify({ chapters: chaptersList }, null, 2);
      await FileSystem.writeAsStringAsync(`${bookDir}toc.js`, updatedTocData);
      console.log('Updated table of contents saved successfully');

      Alert.alert('Success', `Book "${bookTitle}" has been added to your library.`);
    } catch (error) {
      console.error('Error in loadAndSaveEpub:', error);
      Alert.alert('Error', 'Failed to load and save EPUB. Check console for details.');
    }
  };

  const resolvePath = (rootfilePath, relativePath) => {
    const rootDir = rootfilePath.substring(0, rootfilePath.lastIndexOf('/') + 1);
    return `${rootDir}${relativePath}`;
  };

  const handleBookPress = (book) => {
    navigation.navigate('Reader', { bookDirName: book.id });
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

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        await loadAndSaveEpub(fileUri);
        await loadBooks(); // Refresh the books list after adding a new book
      }
    } catch (error) {
      console.error('Error in handleUpload:', error);
      Alert.alert('Error', 'Failed to upload document. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.superContainer, { backgroundColor: colors.homeScreenBackground }]}>
      <Screen>
        <View style={styles.contentContainer}>

          <View style={[styles.booksContainerWrapper]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={[styles.booksContainer]}>
                {books.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    onPress={() => handleBookPress(book)}
                    onLongPress={() => handleLongPress(book)}
                    delayLongPress={500}
                    style={styles.bookWrapper}
                  >
                    <BookCoverThumb
                      title={book.title}
                      subtitle="Unknown Author" // You may want to extract this from EPUB metadata
                      color={book.color}
                      status={0} // You may want to implement a status system
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleUpload} style={styles.button} disabled={isLoading}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>PDF support is coming soon!</Text> 
              <Text style={styles.footerText}>Currently only EPUBs work. Please ensure any file conversions comply with applicable copyright laws and terms of use.</Text>
            </View>
          </View>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 50,
  },
  headerContainer: {
    marginBottom: 10,
  },
  booksContainerWrapper: {
    height: layout.margins.libraryScreen.maxScrollViewHeight,
  },
  scrollContent: {
    padding: 10,
    paddingVertical: 30,
  },
  booksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  bookWrapper: {
    margin: 5,
  },
  footerContainer: {
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'dodgerblue',
  },
  footerTextContainer: {
    paddingHorizontal: 45,
    marginTop: 10,
  },
  footerText: {
    opacity: 0.5,
  },
});

export default NativeLibrary;