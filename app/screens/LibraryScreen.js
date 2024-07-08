import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import colors from '../config/colors';
import { useBooks } from '../context/BooksContext';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const { books, loadBooks, addBook } = useBooks();

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleBookPress = (book) => {
    navigation.navigate('Read', {
      screen: 'ReadScreen',
      params: {
        uri: book.uri,
        title: book.title,
        color: book.color,
        status: 40,
      },
    });
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item)}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  const handleUpload = async () => {
    try {
      console.log("Uploading file");
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });
      
      if (result.assets && result.assets.length > 0) {
        console.log("Successfully picked file");
        const sourceUri = result.assets[0].uri;
        const originalName = result.assets[0].name;
        const bookDir = FileSystem.documentDirectory + 'books/';
        const destinationUri = bookDir + originalName;
        await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri,
        });
        const fileInfo = await FileSystem.getInfoAsync(destinationUri);
        if (!fileInfo.exists) {
          throw new Error('Failed to copy file to document directory');
        }
        const newBook = {
          uri: destinationUri,
          name: originalName,
          title: originalName.replace('.epub', ''),
          subtitle: 'Unknown Author',
          color: getRandomColor(),
          status: 0
        };
        await addBook(newBook);
        Alert.alert('Success', 'EPUB file stored successfully');
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to store EPUB file');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.name}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Upload Book" onPress={handleUpload} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
    padding: 20,
  },
  listContainer: {
    flex: 1,
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactiveGrey,
  },
  bookTitle: {
    fontSize: 16,
    color: colors.utilityGrey,
  },
  buttonContainer: {
    height: 100,
  },
});

export default LibraryScreen;