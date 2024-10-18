import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";

import ChapterContent from "./ChapterContent";
import TableOfContents from "./TableOfContents";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import useDefinitionManager from "../hooks/useDefinitionManager";
import DefinitionPopup from "../components/DefinitionPopup";
import { addCard } from "../services/CardManager";
import { useAPIKey } from "../context/APIKeyContext";
import { useSettingsContext } from "../context/useSettingsContext";
import { callLLMTrueFalse } from "../services/LLMManager";
import { ReadingContext } from '../context/ReadingContext'; // Import the ReadingContext

function Reader() {
  const { apiKey } = useAPIKey();
  const settings = useSettingsContext().settings;
  const route = useRoute();
  const navigation = useNavigation();
  const { bookDirName: routeBookDirName } = route.params || {};

  const { bookDirName, setBookDirName } = useContext(ReadingContext); // Use the context

  useEffect(() => {
    // If bookDirName is not set in context but exists in navigation params, set it
    if (!bookDirName && routeBookDirName) {
      setBookDirName(routeBookDirName);
    }
  }, [bookDirName, routeBookDirName, setBookDirName]);

  // **New: Reload content when the screen gains focus**
  useFocusEffect(
    React.useCallback(() => {
      if (bookDirName) {
        loadBook();
      }
    }, [bookDirName])
  );

  const bookDirectory = bookDirName
    ? `${FileSystem.documentDirectory}bookjs/${bookDirName}/`
    : null;

  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [currentChapterContent, setCurrentChapterContent] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [bookTitle, setBookTitle] = useState("");

  // **New State for Word Press Location**
  const [wordPressLocation, setWordPressLocation] = useState(null);

  // **New State for Last Scroll Y**
  const [lastScrollY, setLastScrollY] = useState(0);

  // Initialize the useDefinitionManager hook
  const {
    popupVisible,
    currentWord,
    currentDefinition,
    isLoading: isDefinitionLoading, // Renamed for clarity
    finished,
    added,
    grammarStarted,
    grammarLoading,
    grammarFinished,
    currentGrammar,
    moduleALoading,
    currentModuleA,
    moduleBLoading,
    currentModuleB,
    audioBase64,
    audioLoading,
    handleWebViewMessageDefinition,
    handleClosePopup,
    handleToggle,
  } = useDefinitionManager();

  useEffect(() => {
    if (bookDirName) {
      loadBook();
    } else {
      setIsLoading(false);
    }
  }, [bookDirName]);

  const loadBook = async () => {
    setIsLoading(true);
    try {
      // Read TOC
      const tocPath = `${bookDirectory}toc.js`;
      const tocExists = await FileSystem.getInfoAsync(tocPath);
      if (!tocExists.exists) {
        throw new Error("TOC not found.");
      }

      const tocContent = await FileSystem.readAsStringAsync(tocPath);
      const toc = JSON.parse(tocContent);

      setChapters(toc.chapters);

      // **Retrieve lastChapterLocation and lastScrollY from bookInfo.js**
      const bookInfoPath = `${bookDirectory}bookInfo.js`;
      let initialChapterIndex = 0; // Default to first chapter
      let initialScrollY = 0; // Default scroll position

      const bookInfoExists = await FileSystem.getInfoAsync(bookInfoPath);
      if (bookInfoExists.exists) {
        const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
        const bookInfo = JSON.parse(bookInfoContent);
        if (
          bookInfo.lastChapterLocation !== undefined &&
          bookInfo.lastChapterLocation >= 0 &&
          bookInfo.lastChapterLocation < toc.chapters.length
        ) {
          initialChapterIndex = bookInfo.lastChapterLocation;
          console.log("lastChapterLocation:", initialChapterIndex);
        }
        if (
          bookInfo.lastScrollY !== undefined &&
          typeof bookInfo.lastScrollY === "number"
        ) {
          initialScrollY = bookInfo.lastScrollY;
          console.log("lastScrollY:", initialScrollY);
        }
      }

      setCurrentChapterIndex(initialChapterIndex);
      setLastScrollY(initialScrollY);

      // **Load the chapter based on initialChapterIndex**
      if (toc.chapters.length > 0) {
        await loadChapter(
          initialChapterIndex,
          toc.chapters[initialChapterIndex].contentSrc,
          initialScrollY
        );
      }

      // Optionally, set the book title
      setBookTitle(formatBookTitle(bookDirName));
    } catch (error) {
      console.error("Error loading book:", error);
      Alert.alert("Error", "Failed to load the book.");
      navigation.navigate("Home"); // Navigate to Home if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  const loadChapter = async (index, chapterFileName, scrollY = 0) => {
    setIsLoading(true); // Start loading indicator
    try {
      const chapterPath = `${bookDirectory}${chapterFileName}`;
      const chapterContent = await FileSystem.readAsStringAsync(chapterPath);
      const parsedChapter = JSON.parse(chapterContent);
      setCurrentChapterContent(parsedChapter);
      setCurrentChapterIndex(index);
      setShowToc(false);
      // **Reset lastScrollY to the passed scrollY value**
      setLastScrollY(scrollY);
    } catch (error) {
      console.error("Error loading chapter:", error);
      Alert.alert("Error", "Failed to load chapter content.");
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const handleSelectChapter = async (index) => {
    await loadChapter(index, chapters[index].contentSrc, 0); // Reset scrollY when selecting a new chapter
    // go to bookInfo and update lastChapterLocation and reset lastScrollY
    const bookInfoPath = `${bookDirectory}bookInfo.js`;
    const bookInfoExists = await FileSystem.getInfoAsync(bookInfoPath);
    if (bookInfoExists.exists) {
      const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
      const bookInfo = JSON.parse(bookInfoContent);
      bookInfo.lastChapterLocation = index;
      bookInfo.lastScrollY = 0; // Reset scroll position
      await FileSystem.writeAsStringAsync(bookInfoPath, JSON.stringify(bookInfo));
    }
  };

  const handleNextChapter = async () => {
    if (currentChapterIndex + 1 < chapters.length) {
      await loadChapter(
        currentChapterIndex + 1,
        chapters[currentChapterIndex + 1].contentSrc,
        0 // Reset scrollY when navigating to next chapter
      );
      // go to bookInfo and update lastChapterLocation and reset lastScrollY
      const bookInfoPath = `${bookDirectory}bookInfo.js`;
      const bookInfoExists = await FileSystem.getInfoAsync(bookInfoPath);
      if (bookInfoExists.exists) {
        const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
        const bookInfo = JSON.parse(bookInfoContent);
        bookInfo.lastChapterLocation = currentChapterIndex + 1;
        bookInfo.lastScrollY = 0; // Reset scroll position
        await FileSystem.writeAsStringAsync(bookInfoPath, JSON.stringify(bookInfo));
        console.log("bookInfo updated:", bookInfo);
      }
    } else {
      Alert.alert("Info", "This is the last chapter.");
    }

    // log the entire bookjs folder in the documents directory
    console.log(
      "bookjs folder:",
      await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}bookjs/${bookDirName}/`)
    );
    // log the contents of the bookInfo.js file and then update the "lastChapterLocation" property
    const bookInfoPath = `${bookDirectory}bookInfo.js`;
    const bookInfoExists = await FileSystem.getInfoAsync(bookInfoPath);
    if (bookInfoExists.exists) {
      const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
      console.log("bookInfo:", bookInfoContent);
      const bookInfo = JSON.parse(bookInfoContent);
      bookInfo.lastChapterLocation = currentChapterIndex + 1;
      bookInfo.lastScrollY = 0; // Reset scroll position
      await FileSystem.writeAsStringAsync(bookInfoPath, JSON.stringify(bookInfo));
      console.log("bookInfo updated:", bookInfo);
    }
  };

  const handlePrevChapter = async () => {
    if (currentChapterIndex > 0) {
      await loadChapter(
        currentChapterIndex - 1,
        chapters[currentChapterIndex - 1].contentSrc,
        0 // Reset scrollY when navigating to previous chapter
      );
      // go to bookInfo and update lastChapterLocation and reset lastScrollY
      const bookInfoPath = `${bookDirectory}bookInfo.js`;
      const bookInfoExists = await FileSystem.getInfoAsync(bookInfoPath);
      if (bookInfoExists.exists) {
        const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
        const bookInfo = JSON.parse(bookInfoContent);
        bookInfo.lastChapterLocation = currentChapterIndex - 1;
        bookInfo.lastScrollY = 0; // Reset scroll position
        await FileSystem.writeAsStringAsync(bookInfoPath, JSON.stringify(bookInfo));
      }
    } else {
      Alert.alert("Info", "This is the first chapter.");
    }
  };

  const formatBookTitle = (dirName) => {
    // Replace underscores and remove invalid characters for display
    return dirName.replace(/_/g, " ").replace(/[^a-zA-Z0-9 _-]/g, "");
  };

  const handlePress = async (pressObject) => {
    setWordPressLocation(pressObject.location);
    handleWebViewMessageDefinition(pressObject);
    console.log("Settings:", settings.flashcardsEnabled, settings.AIDecidesWhenToGenerate, settings.AIDecidesWhenToGeneratePrompt);

    if (settings.flashcardsEnabled) {
      if (settings.AIDecidesWhenToGenerate) {
        // AI decides whether to add a card
        const result = await callLLMTrueFalse(
          `Generate true/false based on the word: "${pressObject.word}" and the query below: ${settings.AIDecidesWhenToGeneratePrompt}. Here's a little more context: ${pressObject.innerContext}`
        );
        console.log(
          "prompt to LLM: ",
          `Generate true/false based on the word: "${pressObject.word}" and the query below: ${settings.AIDecidesWhenToGeneratePrompt}. Here's a little more context: ${pressObject.innerContext}`
        );
        console.log("LLM True/False:", result?.result);
        if (result?.result) {
          handleAddCard(pressObject);
          console.log("CARD ADDED WITH AI DECISION");
        } else {
          console.log("CARD NOT ADDED WITH AI DECISION");
        }
      } else {
        // Always add a card without calling AI
        handleAddCard(pressObject);
        console.log("CARD ADDED WITHOUT AI DECISION");
      }
    } else {
      // Do not call AI or add a card
      console.log("CARD NOT ADDED");
    }
  };

  const handleAddCard = (message) => {
    if (message.word && message.innerContext && message.outerContext) {
      // Updated regex to include all Unicode letters (Cyrillic, Hebrew, Arabic, etc.)
      const cleanWord = message.word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
      const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      const { innerContext, outerContext } = message;
  
      addCard(capitalizedWord, innerContext, outerContext, 'en', settings)
        .then(() => {
          console.log('Card added successfully');
        })
        .catch((error) => {
          console.error('Error adding card:', error);
        });
    }
  };

  // **New Handler to Update lastScrollY**
  const handleLocationChange = async (location) => {
    console.log("Location changed:", location);
    setLastScrollY(location);
    // Update bookInfo.js with the new scroll position
    const bookInfoPath = `${bookDirectory}bookInfo.js`;
    const bookInfoExists = await FileSystem.getInfoAsync(bookInfoPath);
    if (bookInfoExists.exists) {
      const bookInfoContent = await FileSystem.readAsStringAsync(bookInfoPath);
      const bookInfo = JSON.parse(bookInfoContent);
      bookInfo.lastScrollY = location;
      await FileSystem.writeAsStringAsync(bookInfoPath, JSON.stringify(bookInfo));
      console.log("lastScrollY updated:", location);
    }
  };

  const handleClosePopupWithLocationReset = () => {
    handleClosePopup();
    // **Reset the Word Press Location**
    setWordPressLocation(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!bookDirName) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Text style={styles.infoText}>
          Select a book to read from the Library.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home", { screen: "Library" })}
        >
          <Text style={styles.buttonText}>Go to Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      {showToc ? (
        <TableOfContents
          chapters={chapters}
          onSelectChapter={handleSelectChapter}
        />
      ) : (
        <ChapterContent
          chapterContent={currentChapterContent}
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
          setShowToc={setShowToc}
          bookTitle={bookTitle}
          onShowToc={() => setShowToc(true)}
          onWordPress={handlePress} // Updated prop to handle pressObject
          onLocationChange={handleLocationChange} // **Use the new handler**
          startLocation={lastScrollY} // **Pass the lastScrollY here**
        />
      )}
      {/* Definition Popup */}
      <DefinitionPopup
        location={wordPressLocation}
        visible={popupVisible}
        onClose={handleClosePopupWithLocationReset} // **Use the new handler**
        word={currentWord}
        definition={currentDefinition}
        isLoading={isDefinitionLoading}
        added={added}
        finished={finished}
        onToggleCheck={handleToggle}
        currentGrammar={currentGrammar}
        grammarLoading={grammarLoading}
        audioBase64={audioBase64}
        audioLoading={audioLoading}
        currentModuleA={currentModuleA}
        moduleALoading={moduleALoading}
        currentModuleB={currentModuleB}
        moduleBLoading={moduleBLoading}
        grammarStarted={grammarStarted}
        grammarFinished={grammarFinished}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555555",
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4e8cff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default Reader;
