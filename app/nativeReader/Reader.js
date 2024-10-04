import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {
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
  const [chapters, setChapters] = useState([]);
  const [currentChapterContent, setCurrentChapterContent] = useState([]);
  const [showToc, setShowToc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [bookDirectory, setBookDirectory] = useState(null);

  const pickDocument = async () => {
    console.log('Picking document...');
    setIsLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      console.log('Document picker result:', result);

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        console.log('Selected file URI:', fileUri);
        await loadEpub(fileUri);
      } else {
        console.log('Document picking cancelled');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      setIsLoading(false);
    }
  };

  const loadEpub = async (fileUri) => {
    console.log('Loading EPUB from URI:', fileUri);
    setIsLoading(true);
    try {
      const zipFile = await loadEpubFromUri(fileUri);
      setZip(zipFile);
      console.log('EPUB loaded successfully');

      const rootfilePath = await parseContainerXml(zipFile);
      console.log('Root file path:', rootfilePath);

      const { metadata, manifestItems, spineItems } = await parseContentOpf(zipFile, rootfilePath);
      console.log('Metadata:', metadata);
      console.log('Manifest items count:', manifestItems.length);
      console.log('Spine items count:', spineItems.length);

      // Extract the book title for the book identifier
      const bookTitleObj = extractBookTitle(metadata);
      console.log('Book title object:', bookTitleObj);
      const bookTitle = bookTitleObj['#text'] || 'Unknown Title';
      console.log('Book title:', bookTitle);
      const bookId = bookTitle.replace(/\s+/g, '_');

      // Create directory for the book
      const bookDir = `${FileSystem.documentDirectory}bookjs/${bookId}/`;
      await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });

      console.log('Book directory created:', bookDir);

      // Parse the table of contents
      let chaptersList = [];
      try {
        chaptersList = await parseTableOfContents(zipFile, manifestItems);
        console.log('Table of contents parsed successfully');
      } catch (error) {
        console.warn('TOC not found, using spine items:', error);
        // Fallback to spine items
        chaptersList = spineItems.map((itemref, index) => {
          const manifestItem = manifestItems.find((item) => item.id === itemref.idref);
          return {
            id: manifestItem.id,
            label: manifestItem.href,
            contentSrc: manifestItem.href,
            index: index,
          };
        });
      }

      console.log('Chapters list:', chaptersList);

      // Save TOC to a file
      const tocData = JSON.stringify({ chapters: chaptersList }, null, 2);
      await FileSystem.writeAsStringAsync(`${bookDir}toc.js`, tocData);

      // Process and save each chapter
      for (let i = 0; i < chaptersList.length; i++) {
        const chapter = chaptersList[i];
        const contentSrc = chapter.contentSrc;

        // Resolve the path relative to the rootfile
        const chapterPath = resolvePath(rootfilePath, contentSrc);
        const htmlText = await zipFile.file(chapterPath).async('text');

        // Process HTML content into JSON structure
        const parsedContent = processHtmlContent(htmlText);

        // Save parsed content as a .js file
        const chapterFileName = `ch${String(i + 1).padStart(2, '0')}.js`;
        const chapterData = JSON.stringify(parsedContent, null, 2);
        await FileSystem.writeAsStringAsync(`${bookDir}${chapterFileName}`, chapterData);

        // Update the chapter's contentSrc to point to the saved file
        chapter.contentSrc = chapterFileName;
      }

      // Save updated TOC with updated contentSrc paths
      const updatedTocData = JSON.stringify({ chapters: chaptersList }, null, 2);
      await FileSystem.writeAsStringAsync(`${bookDir}toc.js`, updatedTocData);

      console.log('All chapters processed and saved');

      setBookDirectory(bookDir);
      setChapters(chaptersList);
      setShowToc(true);
    } catch (error) {
      console.error('Error loading EPUB:', error);
      Alert.alert('Error', 'Failed to load EPUB file.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resolves the chapter path relative to the rootfile directory.
   * @param {string} rootfilePath - The path to the `content.opf` file.
   * @param {string} relativePath - The relative path from the manifest.
   * @returns {string} The resolved path.
   */
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
      const chapter = chapters[index];
      const chapterFilePath = `${bookDirectory}${chapter.contentSrc}`;
      console.log('Loading chapter from:', chapterFilePath);

      const chapterContent = await FileSystem.readAsStringAsync(chapterFilePath);
      console.log('Chapter content loaded, length:', chapterContent.length);

      const parsedChapter = JSON.parse(chapterContent);
      console.log('Chapter parsed successfully');

      setCurrentChapterContent(parsedChapter);
      setShowToc(false);
    } catch (error) {
      console.error('Error loading chapter:', error);
      Alert.alert('Error', 'Failed to load chapter content.');
    } finally {
      setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Info', 'This is the last chapter.');
    }
  };

  const handlePrevChapter = async () => {
    if (currentChapterIndex > 0) {
      setIsLoading(true);
      try {
        const prevIndex = currentChapterIndex - 1;
        setCurrentChapterIndex(prevIndex);

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

export default Reader;