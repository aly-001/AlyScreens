import React, { useState, useEffect } from 'react';rom 'react';
import { View, Button, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { BooksContext } from '../context/BooksContext'; // Import BooksContext
  loadEpubFromUri,
  parseContainerXml,
  parseContentOpf,
  parseTableOfContents,
  extractBookTitle,
  processHtmlContent,
} from './epubHandler';
import TableOfContents from './TableOfContents';
import ChapterContent from './ChapterContent';

function Reader() {
  const [zip, setZip] = useState(null);
  const { addBook } = useContext(BooksContext); // Use BooksContext
  const [currentChapterContent, setCurrentChapterContent] = useState([]);
  const [showToc, setShowToc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [bookDirectory, setBookDirectory] = useState(null);

  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    const findSavedBooks = async () => {
      try {
        const bookjsDir = `${FileSystem.documentDirectory}bookjs/`;
        const dirInfo = await FileSystem.getInfoAsync(bookjsDir);
        
        if (dirInfo.exists) {
          const bookDirs = await FileSystem.readDirectoryAsync(bookjsDir);
          const books = await Promise.all(bookDirs.map(async (bookId) => {
            const tocPath = `${bookjsDir}${bookId}/toc.js`;
            const tocExists = await FileSystem.getInfoAsync(tocPath);
            if (tocExists.exists) {
              const tocContent = await FileSystem.readAsStringAsync(tocPath);
              const toc = JSON.parse(tocContent);
              return { id: bookId, title: bookId.replace(/_/g, ' '), chapters: toc.chapters };
            }
            return null;
          }));
          setSavedBooks(books.filter(book => book !== null));
        }
      } catch (error) {
        console.error('Error finding saved books:', error);
      }
    };

    findSavedBooks();
  }, []);

      setZip(zipFile);
      console.log('EPUB loaded successfully');

    console.log('Picking document...');
      console.log('Root file path:', rootfilePath);

      const { metadata, manifestItems, spineItems } = await parseContentOpf(zipFile, rootfilePath);
      console.log('Metadata:', metadata);
      console.log('Manifest items count:', manifestItems.length);
      console.log('Spine items count:', spineIuri

      console.log('Document picker result:', result);

      if (!result.canceled) {
      const bookTitleObj = extractBookTitle(metadata);
        console.log('Selected file URI:', fileUri);
      const bookTitle = bookTitleObj['#text'] || 'Unknown Title';
      // Cre
        console.log('Document picking cancelled');rectory for the book
      const bookDir = `${FileSystem.documentDirectory}bookjs/${bookId}/`;
      await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });

      console.log('Book directory created:', bookDir);

      // Parse the table of contents
      let chaptersList = [];
      try {
        chaptersList = await parseTableOfContents(zipFile, manifestItems);
    console.log('Loading EPUB from URI:', fileUri);
      } catch (error) {
        console.warn('TOC not found, using spine items:', error);
        // Fallback to spine items
        chaptersList = spineItems.map((itemref, index) tems.find((item) => item.id === itemref.idref);
      console.log('EPUB loaded successfully');
            id: manifestItem.id,
    
      console.log('Book title:', bookTitle);        label: manifestItem.href,
      console.log('Root file path:', rootfilePath);

          };
      console.log('Metadata:', metadata);
      console.log('Manifest items count:', manifestItems.length);
      console.log('Spine items count:', spineItems.length);
      console.log('Chapters list:', chaptersList);
      const bookTitleObj = extractBookTitle(metadata);
      console.log('Book title object:', bookTitleObj);
      const bookTitle = bookTitleObj['#text'] || 'Unknown Title';null, 2);
      await FileSystem.writeAsStringAsync(`${bookDir}toc.js`, tocData);

      // Process and save each chapter
      for (let i = 0; i < chaptersList.length; i++) {
        const chapter = chaptersList[i];
        const contentSrc = chapter.contentSrc;

      console.log('Book directory created:', bookDir);

        const htmlText = await zipFile.file(chapterPath).async('text');

        // Process HTML content into JSON structure
        const parsedContent = processHtmlContent(htmlText);
        console.log('Table of contents parsed successfully');
        // Save parsed content as a .js file
        console.warn('TOC not found, using spine items:', error);')
      }.js`;
        const chapterData = JSON.stringify(parsedContent, null, 2);
        await FileSystem.writeAsStringAsync(`${bookDir}${chapterFileName}`, chapterData);

        // Update the chapter's contentSrc to point to the saved file
        chapter.contentSrc = chapterFileName;
      }

      // Save updated TOC with updated contentSrc paths
      const updatedTocData = JSON.stringify({ chapters: chaptersList }, null, 2);
      await FileSystem.writeAsString${bookDir}toc.js`, updatedTocData);

      console.log('All chapters processed and saved');
      console.log('Chapters list:', chaptersList);

      setChapters(chaptersList);
      setShowToc(true);
    } catch (error) {
      console.error('Error loading EPUB:', error);

      // **Save the book to the library**
      const newBook = {
        uri: fileUri,
        title: bookTitle,
        id: bookId,
        directory: bookDir,
        chapters: chaptersList.length,
      };
      await addBook(newBook);
      console.log('Book added to library:', newBook);
      Alert.alert('Success', `${bookTitle} has been added to your library.`);
  const resolvePath = (rootfilePath, relativePath) => {
    const rootDir = rootfilePath.substring(0, rootfilePath.lastIndexOf('/') + 1);
    const resolvedPath = rootDir + relativePath;
    return resolvedPath;
  };

  const handleSelectChapter = async (index) => {
    console.log('Selecting chapter at index:', index);
    setIsLoading(true);
    try {
      setCurrentChapterIndex(index);

      // Read from the saved chapter file
      console.log('All chapters processed and saved');

      console.log('Loading chapter from:', chapterFilePath);

      const chapterContent = await FileSystem.readAsStringAsync(chapterFilePath);

      // **Save the book to the library**
      const newBook = {
        uri: fileUri,
        title: bookTitle,
        id: bookId,
        directory: bookDir,
        chapters: chaptersList.length,
      };
      await addBook(newBook);
      console.log('Book added to library:', newBook);
      Alert.alert('Success', `${bookTitle} has been added to your library.`);
    }
  };

  const handleNextChapter = async () => {
    if (currentChapterIndex + 1 < chapters.length) {
      setIsLoading(true);
      try {
        const nextIndex = currentChapterIndex + 1;
        setCurrentChapterIndex(nextIndex);

        // Read from the saved chapter file
        const chapter = chapters[nextIndex];
        const chapterFilePath = `${bookDirectory}${chapter.contentSrc}`;
        const chapterContent = await FileSystem.readAsStringAsync(chapterFilePath);

        const parsedChapter = JSON.parse(chapterContent);

        setCurrentChapterContent(parsedChapter);
      } catch (error) {
        console.error('Error loading next chapter:', error);
        Alert.alert('Error', 'Failed to load next chapter.');
    console.log('Selecting chapter at index:', index);
        setIsLoading(false);
      }
    } else {
      Alert.alert('Info', 'This is the last chapter.');
    }
  };

      console.log('Loading chapter from:', chapterFilePath);

      setIsLoading(true);
      console.log('Chapter content loaded, length:', chapterContent.length);
        const prevIndex = currentChapterIndex - 1;
        setCurrentChapterIndex(prevIndex);
      console.log('Chapter parsed successfully');
        // Read from the saved chapter file
        const chapter = chapters[prevIndex];
        const chapterFilePath = `${bookDirectory}${chapter.contentSrc}`;
        const chapterContent = await FileSystem.readAsStringAsync(chapterFilePath);

        const parsedChapter = JSON.parse(chapterContent);

        setCurrentChapterContent(parsedChapter);
      } catch (error) {
        console.error('Error loading previous chapter:', error);
        Alert.alert('Error', 'Failed to load previous chapter.');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Info', 'This is the first chapter.');
    }
  };

  const handleWordPress = (word) => {
    console.log('Word pressed:', word);
    // Handle the word interaction here
    // For example, you could display a modal with the word's definition
  };

  return (
    <View style={{ flex: 1, backgroundColor: "pink", justifyContent: "center", alignItems: "center" }}>
      {!zip && !isLoading && (
        <Button title="Pick an EPUB file" onPress={pickDocument} />
      )}
      {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      )}
      {zip && showToc && (
        <TableOfContents
          chapters={chapters}
          onSelectChapter={(index) => handleSelectChapter(index)}
        />
      )}
      {zip && !showToc && (
        <ChapterContent
          chapterContent={currentChapterContent}
          onWordPress={handleWordPress}
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
          onShowToc={() => setShowToc(true)}
        />
      )}
    </View>
  );
}

export default Reader;  onShowToc={() => setShowToc(true)}
                <Button title="Pick an EPUB file" onPress={pickDocument} />red    console.log('Word pressed:', word);
 ,,, backgroundColor: "red"     console.log('Word pressed:', word);
pink, justifyContent: "center", alignItems: "center"  onShowToc={() => setShowToc(true)}
                <>
          <Button title="Pick an EPUB file" onPress={pickDocument} />
          {savedBooks.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Button title="Load Saved Book" onPress={() => {/* TODO: Implement book selection */}} />
            </View>
          )}
        </>