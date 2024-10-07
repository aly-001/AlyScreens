import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {
  parseContainerXml,
  parseContentOpf,
  parseTableOfContents,
  extractBookTitle,
  processHtmlContent,
} from './epubHandler';
import ChapterContent from './ChapterContent';
import TableOfContents from './TableOfContents';
import { useRoute, useNavigation } from '@react-navigation/native';

function Reader() {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookDirName } = route.params || {}; // Receive bookDirName via navigation if available

  const bookDirectory = bookDirName
    ? `${FileSystem.documentDirectory}bookjs/${bookDirName}/`
    : null;

  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [currentChapterContent, setCurrentChapterContent] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [bookTitle, setBookTitle] = useState('');

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
        throw new Error('TOC not found.');
      }

      const tocContent = await FileSystem.readAsStringAsync(tocPath);
      const toc = JSON.parse(tocContent);

      setChapters(toc.chapters);

      // Load the first chapter
      if (toc.chapters.length > 0) {
        await loadChapter(0, toc.chapters[0].contentSrc);
      }

      // Optionally, set the book title
      setBookTitle(formatBookTitle(bookDirName));
    } catch (error) {
      console.error('Error loading book:', error);
      Alert.alert('Error', 'Failed to load the book.');
      navigation.navigate('Home'); // Navigate to Home if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  const loadChapter = async (index, chapterFileName) => {
    setIsLoading(true); // Start loading indicator
    try {
      const chapterPath = `${bookDirectory}${chapterFileName}`;
      const chapterContent = await FileSystem.readAsStringAsync(chapterPath);
      const parsedChapter = JSON.parse(chapterContent);
      setCurrentChapterContent(parsedChapter);
      setCurrentChapterIndex(index);
      setShowToc(false);
    } catch (error) {
      console.error('Error loading chapter:', error);
      Alert.alert('Error', 'Failed to load chapter content.');
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const handleSelectChapter = async (index) => {
    await loadChapter(index, chapters[index].contentSrc);
  };

  const handleNextChapter = async () => {
    if (currentChapterIndex + 1 < chapters.length) {
      await loadChapter(currentChapterIndex + 1, chapters[currentChapterIndex + 1].contentSrc);
    } else {
      Alert.alert('Info', 'This is the last chapter.');
    }
  };

  const handlePrevChapter = async () => {
    if (currentChapterIndex > 0) {
      await loadChapter(currentChapterIndex - 1, chapters[currentChapterIndex - 1].contentSrc);
    } else {
      Alert.alert('Info', 'This is the first chapter.');
    }
  };

  const handleWordPress = (word) => {
    console.log('Word pressed:', word);
    // Handle the word interaction here
    // For example, display a modal with the word's definition
  };

  const formatBookTitle = (dirName) => {
    // Replace underscores and remove invalid characters for display
    return dirName.replace(/_/g, ' ').replace(/[^a-zA-Z0-9 _-]/g, '');
  };

  const promptSelectBook = () => {
    Alert.alert(
      'No Book Selected',
      'Please select a book from the Library to read.',
      [
        {
          text: 'Go to Library',
          onPress: () => navigation.navigate('Home', { screen: 'Library' }),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
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
      <View style={styles.container}>
        <Text style={styles.infoText}>Select a book to read from the Library.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home', { screen: 'Library' })}>
          <Text style={styles.buttonText}>Go to Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showToc ? (
        <TableOfContents chapters={chapters} onSelectChapter={handleSelectChapter} />
      ) : (
        <ChapterContent
          chapterContent={currentChapterContent}
          onWordPress={handleWordPress}
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
          setShowToc={setShowToc}
          bookTitle={bookTitle}
          onShowToc={() => setShowToc(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555555',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4e8cff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Reader;